# =============================================================================
# LIFETIME WORLD - GOOGLE CLOUD LLM TRAINING BURST INFRASTRUCTURE
# =============================================================================
# Terraform configuration for on-demand H100 GPU clusters
#
# Usage:
#   terraform init
#   terraform plan -var-file="training.tfvars"
#   terraform apply -var-file="training.tfvars"
#
# Estimated Costs:
#   - A3 Mega (8x H100): ~€35/hr on-demand, ~€14/hr spot
#   - Storage: ~€0.02/GB/month
#   - Networking: ~€0.12/GB egress
# =============================================================================

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "lifetime-terraform-state"
    prefix = "llm-training"
  }
}

# =============================================================================
# VARIABLES
# =============================================================================

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region (europe-north1 recommended for GDPR)"
  type        = string
  default     = "europe-north1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "europe-north1-a"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "training_cluster_name" {
  description = "Name for the training cluster"
  type        = string
  default     = "lifetime-llm-training"
}

variable "gpu_type" {
  description = "GPU accelerator type"
  type        = string
  default     = "nvidia-h100-80gb"
}

variable "gpu_count" {
  description = "Number of GPUs per node"
  type        = number
  default     = 8
}

variable "node_count" {
  description = "Number of training nodes"
  type        = number
  default     = 1
}

variable "machine_type" {
  description = "Machine type for training nodes"
  type        = string
  default     = "a3-megagpu-8g"  # 8x H100 80GB
}

variable "use_spot" {
  description = "Use spot/preemptible instances (60% cheaper)"
  type        = bool
  default     = false
}

variable "disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
  default     = 500
}

variable "checkpoint_bucket" {
  description = "GCS bucket for model checkpoints"
  type        = string
  default     = "lifetime-llm-checkpoints"
}

variable "dataset_bucket" {
  description = "GCS bucket for training datasets"
  type        = string
  default     = "lifetime-llm-datasets"
}

variable "hf_token" {
  description = "Hugging Face API token"
  type        = string
  sensitive   = true
}

variable "wandb_api_key" {
  description = "Weights & Biases API key"
  type        = string
  sensitive   = true
  default     = ""
}

# =============================================================================
# PROVIDER CONFIGURATION
# =============================================================================

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# =============================================================================
# NETWORKING
# =============================================================================

resource "google_compute_network" "training_network" {
  name                    = "${var.training_cluster_name}-network"
  auto_create_subnetworks = false
  description             = "VPC network for LLM training cluster"
}

resource "google_compute_subnetwork" "training_subnet" {
  name          = "${var.training_cluster_name}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.training_network.id
  
  private_ip_google_access = true
  
  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

resource "google_compute_firewall" "allow_internal" {
  name    = "${var.training_cluster_name}-allow-internal"
  network = google_compute_network.training_network.name

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.0.0.0/24"]
  description   = "Allow internal communication between training nodes"
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "${var.training_cluster_name}-allow-ssh"
  network = google_compute_network.training_network.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"]  # IAP ranges
  target_tags   = ["training-node"]
  description   = "Allow SSH via IAP"
}

resource "google_compute_firewall" "allow_nccl" {
  name    = "${var.training_cluster_name}-allow-nccl"
  network = google_compute_network.training_network.name

  allow {
    protocol = "tcp"
    ports    = ["29500-29600"]  # NCCL/PyTorch distributed
  }

  source_ranges = ["10.0.0.0/24"]
  target_tags   = ["training-node"]
  description   = "Allow NCCL communication for distributed training"
}

# =============================================================================
# CLOUD STORAGE - Checkpoints & Datasets
# =============================================================================

resource "google_storage_bucket" "checkpoints" {
  name          = var.checkpoint_bucket
  location      = var.region
  force_destroy = false
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
  
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
  
  labels = {
    environment = var.environment
    purpose     = "llm-checkpoints"
    project     = "lifetime-world"
  }
}

resource "google_storage_bucket" "datasets" {
  name          = var.dataset_bucket
  location      = var.region
  force_destroy = false
  
  uniform_bucket_level_access = true
  
  labels = {
    environment = var.environment
    purpose     = "llm-datasets"
    project     = "lifetime-world"
  }
}

# =============================================================================
# SECRET MANAGER - Credentials
# =============================================================================

resource "google_secret_manager_secret" "hf_token" {
  secret_id = "llm-training-hf-token"
  
  replication {
    auto {}
  }
  
  labels = {
    environment = var.environment
    purpose     = "llm-training"
  }
}

resource "google_secret_manager_secret_version" "hf_token" {
  secret      = google_secret_manager_secret.hf_token.id
  secret_data = var.hf_token
}

resource "google_secret_manager_secret" "wandb_key" {
  count     = var.wandb_api_key != "" ? 1 : 0
  secret_id = "llm-training-wandb-key"
  
  replication {
    auto {}
  }
  
  labels = {
    environment = var.environment
    purpose     = "llm-training"
  }
}

resource "google_secret_manager_secret_version" "wandb_key" {
  count       = var.wandb_api_key != "" ? 1 : 0
  secret      = google_secret_manager_secret.wandb_key[0].id
  secret_data = var.wandb_api_key
}

# =============================================================================
# SERVICE ACCOUNT
# =============================================================================

resource "google_service_account" "training_sa" {
  account_id   = "${var.training_cluster_name}-sa"
  display_name = "LLM Training Service Account"
  description  = "Service account for Lifetime World LLM training nodes"
}

resource "google_project_iam_member" "training_sa_storage" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.training_sa.email}"
}

resource "google_project_iam_member" "training_sa_secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.training_sa.email}"
}

resource "google_project_iam_member" "training_sa_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.training_sa.email}"
}

resource "google_project_iam_member" "training_sa_monitoring" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.training_sa.email}"
}

# =============================================================================
# COMPUTE INSTANCES - Training Nodes
# =============================================================================

resource "google_compute_instance" "training_node" {
  count        = var.node_count
  name         = "${var.training_cluster_name}-node-${count.index}"
  machine_type = var.machine_type
  zone         = var.zone
  
  tags = ["training-node"]
  
  boot_disk {
    initialize_params {
      image = "projects/ml-images/global/images/c0-deeplearning-common-gpu-v20240128-debian-11-py310"
      size  = var.disk_size_gb
      type  = "pd-ssd"
    }
  }
  
  guest_accelerator {
    type  = var.gpu_type
    count = var.gpu_count
  }
  
  network_interface {
    subnetwork = google_compute_subnetwork.training_subnet.id
    
    access_config {
      # Ephemeral public IP for initial setup
    }
  }
  
  scheduling {
    preemptible         = var.use_spot
    automatic_restart   = !var.use_spot
    on_host_maintenance = "TERMINATE"
  }
  
  service_account {
    email  = google_service_account.training_sa.email
    scopes = ["cloud-platform"]
  }
  
  metadata = {
    enable-oslogin = "TRUE"
  }
  
  metadata_startup_script = <<-EOF
    #!/bin/bash
    set -e
    
    # Install NVIDIA drivers and CUDA
    /opt/deeplearning/install-driver.sh
    
    # Install training dependencies
    pip install --upgrade pip
    pip install \
      transformers>=4.57.6 \
      datasets>=2.16.0 \
      accelerate>=0.26.0 \
      peft>=0.7.0 \
      bitsandbytes>=0.42.0 \
      trl>=0.7.0 \
      deepspeed>=0.13.0 \
      flash-attn --no-build-isolation \
      wandb \
      google-cloud-storage \
      google-cloud-secret-manager
    
    # Setup GCS FUSE for checkpoint access
    echo "deb https://packages.cloud.google.com/apt gcsfuse-$(lsb_release -c -s) main" | tee /etc/apt/sources.list.d/gcsfuse.list
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    apt-get update && apt-get install -y gcsfuse
    
    # Mount checkpoints bucket
    mkdir -p /mnt/checkpoints
    gcsfuse --implicit-dirs ${var.checkpoint_bucket} /mnt/checkpoints
    
    # Mount datasets bucket
    mkdir -p /mnt/datasets
    gcsfuse --implicit-dirs ${var.dataset_bucket} /mnt/datasets
    
    # Fetch secrets
    export HF_TOKEN=$(gcloud secrets versions access latest --secret=llm-training-hf-token)
    echo "export HF_TOKEN=$HF_TOKEN" >> /etc/profile.d/llm-training.sh
    
    # Set environment variables
    echo "export MASTER_ADDR=${google_compute_instance.training_node[0].network_interface[0].network_ip}" >> /etc/profile.d/llm-training.sh
    echo "export MASTER_PORT=29500" >> /etc/profile.d/llm-training.sh
    echo "export WORLD_SIZE=${var.node_count}" >> /etc/profile.d/llm-training.sh
    echo "export RANK=${count.index}" >> /etc/profile.d/llm-training.sh
    echo "export LOCAL_RANK=0" >> /etc/profile.d/llm-training.sh
    
    echo "Training node ${count.index} ready!"
  EOF
  
  labels = {
    environment = var.environment
    purpose     = "llm-training"
    project     = "lifetime-world"
    node_rank   = tostring(count.index)
  }
  
  lifecycle {
    ignore_changes = [metadata_startup_script]
  }
}

# =============================================================================
# OUTPUTS
# =============================================================================

output "training_node_ips" {
  description = "Internal IPs of training nodes"
  value       = google_compute_instance.training_node[*].network_interface[0].network_ip
}

output "training_node_external_ips" {
  description = "External IPs of training nodes (for SSH)"
  value       = google_compute_instance.training_node[*].network_interface[0].access_config[0].nat_ip
}

output "checkpoint_bucket" {
  description = "GCS bucket for checkpoints"
  value       = google_storage_bucket.checkpoints.url
}

output "dataset_bucket" {
  description = "GCS bucket for datasets"
  value       = google_storage_bucket.datasets.url
}

output "ssh_command" {
  description = "SSH command to connect to master node"
  value       = "gcloud compute ssh ${google_compute_instance.training_node[0].name} --zone=${var.zone} --tunnel-through-iap"
}

output "estimated_hourly_cost" {
  description = "Estimated hourly cost (EUR)"
  value       = var.use_spot ? "~€${var.node_count * 14}/hr (spot)" : "~€${var.node_count * 35}/hr (on-demand)"
}
