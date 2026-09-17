# LWM Training Manual - Part 2: Data Generation & Training
## Industry-Specific Model Training Lab Notes

**Document ID:** DWS-LWM-TRAIN-001-PART2
**Version:** 1.0
**Classification:** Internal Lab Notebook
**Author:** Lifetime Oy
**Date:** 2026-01-24

**Execution Time:** 16-24 hours (mostly unattended)
**Prerequisites:** Part 1 complete, system health check passed

---

## Lab Session Overview

This lab generates synthetic training data using Claude API and fine-tunes Llama 3.1 8B for a specific industry vertical.

**What You'll Build:**
- Industry-specific training curriculum (via Claude)
- 2000+ synthetic training examples
- Fine-tuned LWM model using QLoRA
- Trained model checkpoints

**Cost Estimate:**
- Claude API: €40-60 (data generation)
- Electricity: €5-8 (16 hours training)
- **Total: €50-70 per industry model**

---

## Section 1: Industry Configuration (30 minutes)

### 1.1 Choose Your Industry

Select one industry vertical for this training session:

- `logistics` - Route optimization, fleet management
- `construction` - BIM coordination, safety protocols  
- `manufacturing` - Process control, quality management
- `energy` - Grid management, emissions tracking
- `healthcare` - Clinical workflows, documentation

**For this lab, we'll use `logistics` as the example.**

###

 1.2 Create Industry Configuration

```bash
# Activate environment
source ~/dws-lwm/venv/bin/activate
cd ~/dws-lwm

# Create logistics configuration
cat > configs/industries/logistics.yaml << 'EOF'
# Logistics Industry LWM Configuration
industry:
  name: "logistics"
  display_name: "Logistics & Fleet Management"
  
  focus_areas:
    - route_optimization
    - fleet_management
    - scheduling_dispatch
    - driver_compliance
    - fuel_efficiency
    - real_time_tracking
    
  regulations:
    - code: "GDPR"
      description: "General Data Protection Regulation"
      relevance: "Driver and customer data handling"
    - code: "WTD"
      description: "Working Time Directive 2003/88/EC"
      relevance: "Driver hours and rest periods"
    - code: "TACH"
      description: "EU Tachograph Regulation 165/2014"
      relevance: "Digital tachograph compliance"
    - code: "ADR"
      description: "European Agreement on Dangerous Goods"
      relevance: "Hazardous material transport"
      
  output_formats:
    - operational_instructions
    - compliance_reports
    - route_plans
    - scheduling_matrices
    
  evaluation_criteria:
    - metric: "route_efficiency"
      weight: 0.25
      description: "Optimality of suggested routes"
    - metric: "compliance_accuracy"
      weight: 0.30
      description: "Correct application of regulations"
    - metric: "practical_applicability"
      weight: 0.25
      description: "Real-world feasibility"
    - metric: "safety_consideration"
      weight: 0.20
      description: "Safety factor integration"
      
  training_data:
    target_samples: 2000
    complexity_distribution:
      simple: 0.30
      medium: 0.50
      complex: 0.20
    include_edge_cases: true
    include_error_scenarios: true
    
  customer_context:
    - name: "Uber Taksi Helsinki"
      use_cases: ["dispatch_optimization", "driver_scheduling"]
    - name: "Bolt"
      use_cases: ["demand_prediction", "surge_management"]
    - name: "Kela"
      use_cases: ["medical_transport", "accessibility_routing"]
EOF

# Verify configuration
cat configs/industries/logistics.yaml
```

### 1.3 Create Base Training Configuration

```bash
cat > configs/base_config.yaml << 'EOF'
# DWS IQ 6 LWM Training Configuration
# Version: 1.0

# Model Configuration
model:
  base_model: "meta-llama/Llama-3.1-8B"
  model_path: "~/dws-lwm/models/base/llama-3.1-8b"
  tokenizer: "meta-llama/Llama-3.1-8B"
  torch_dtype: "bfloat16"
  attn_implementation: "eager"  # Use "flash_attention_2" if available
  max_seq_length: 2048

# Quantization Configuration (QLoRA)
quantization:
  load_in_4bit: true
  bnb_4bit_quant_type: "nf4"
  bnb_4bit_compute_dtype: "bfloat16"
  bnb_4bit_use_double_quant: true

# LoRA Configuration
lora:
  r: 64
  lora_alpha: 128
  lora_dropout: 0.05
  target_modules:
    - "q_proj"
    - "k_proj"
    - "v_proj"
    - "o_proj"
    - "gate_proj"
    - "up_proj"
    - "down_proj"
  bias: "none"
  task_type: "CAUSAL_LM"

# Training Configuration
training:
  num_train_epochs: 3
  per_device_train_batch_size: 4
  gradient_accumulation_steps: 8
  effective_batch_size: 32
  learning_rate: 2.0e-4
  weight_decay: 0.01
  warmup_ratio: 0.03
  lr_scheduler_type: "cosine"
  max_grad_norm: 1.0
  
# Optimization
optimization:
  gradient_checkpointing: true
  bf16: true
  tf32: true
  
# Logging & Checkpointing
logging:
  logging_steps: 10
  save_strategy: "steps"
  save_steps: 100
  save_total_limit: 3
  
# Evaluation
evaluation:
  eval_strategy: "steps"
  eval_steps: 100
  
# Output
output:
  output_dir: "./models/finetuned"
EOF

cat configs/base_config.yaml
```

---

## Section 2: Data Generation with Claude (2-3 hours)

### 2.1 Create Data Generation Script

```bash
cat > scripts/generate_training_data.py << 'PYTHON_EOF'
#!/usr/bin/env python3
"""
DWS IQ 6 - Industry Training Data Generator
Uses Claude API to generate synthetic training data
"""

import anthropic
import json
import yaml
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List
import logging
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/data_generation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class IndustryDataGenerator:
    """Generate synthetic training data for industry LWMs"""
    
    def __init__(self, industry: str):
        self.industry = industry
        self.config = self._load_config()
        self.client = anthropic.Anthropic()
        self.output_dir = Path(f"data/synthetic/{industry}")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def _load_config(self) -> dict:
        """Load industry configuration"""
        config_file = Path(f"configs/industries/{self.industry}.yaml")
        if not config_file.exists():
            raise FileNotFoundError(f"Config not found: {config_file}")
        with open(config_file) as f:
            return yaml.safe_load(f)
    
    def generate_curriculum(self) -> dict:
        """Generate training curriculum using Claude"""
        
        industry_config = self.config['industry']
        
        prompt = f"""Design a comprehensive training curriculum for an LLM specializing in {industry_config['display_name']}.

## Industry Context
Focus areas: {', '.join(industry_config['focus_areas'])}

Regulatory framework:
{self._format_regulations(industry_config['regulations'])}

Output formats: {', '.join(industry_config['output_formats'])}

## Curriculum Requirements

Generate a structured curriculum with:

1. **Core Domain Knowledge** (20 topics)
   - Fundamental concepts and terminology
   - Industry best practices
   - Technical standards

2. **Regulatory Compliance Scenarios** (15 scenarios)
   - Each regulation with practical application
   - Common compliance challenges
   - Audit and documentation requirements

3. **Operational Decision-Making Cases** (15 cases)
   - Real-world operational scenarios
   - Multi-factor decision analysis
   - Optimization problems

4. **Edge Cases and Error Handling** (10 cases)
   - Unusual situations
   - Error recovery procedures
   - Safety-critical scenarios

For each item, provide:
- name: Topic/scenario name
- objective: Learning objective
- concepts: List of key concepts
- complexity: simple/medium/complex

Output as valid JSON:
{{
    "curriculum_id": "logistics-curriculum-v1",
    "industry": "logistics",
    "generated_at": "ISO timestamp",
    "core_knowledge": [...],
    "compliance_scenarios": [...],
    "operational_cases": [...],
    "edge_cases": [...]
}}"""

        logger.info(f"Generating curriculum for {self.industry}")
        
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,
            messages=[{"role": "user", "content": prompt}]
        )
        
        content = response.content[0].text
        
        # Extract JSON
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        curriculum = json.loads(content.strip())
        curriculum['generated_at'] = datetime.now().isoformat()
        
        # Save curriculum
        curriculum_file = self.output_dir / "curriculum.json"
        with open(curriculum_file, 'w') as f:
            json.dump(curriculum, f, indent=2)
            
        logger.info(f"Curriculum saved to {curriculum_file}")
        return curriculum
    
    def _format_regulations(self, regulations: list) -> str:
        """Format regulations for prompt"""
        return "\n".join([
            f"- {r['code']}: {r['description']} (Relevance: {r['relevance']})"
            for r in regulations
        ])
    
    def generate_training_examples(
        self, 
        curriculum: dict, 
        samples_per_topic: int = 30
    ) -> List[dict]:
        """Generate synthetic training examples from curriculum"""
        
        all_examples = []
        industry_config = self.config['industry']
        
        # Combine all curriculum sections
        all_topics = (
            curriculum.get('core_knowledge', []) +
            curriculum.get('compliance_scenarios', []) +
            curriculum.get('operational_cases', []) +
            curriculum.get('edge_cases', [])
        )
        
        total_topics = len(all_topics)
        logger.info(f"Generating examples for {total_topics} topics ({samples_per_topic} per topic)")
        
        for i, topic in enumerate(all_topics):
            topic_name = topic.get('name', f'Topic {i+1}')
            logger.info(f"[{i+1}/{total_topics}] Generating {samples_per_topic} examples for: {topic_name}")
            
            prompt = f"""Generate {samples_per_topic} diverse training examples for a {industry_config['display_name']} AI assistant.

## Topic
Name: {topic.get('name', 'N/A')}
Objective: {topic.get('objective', 'N/A')}
Key concepts: {topic.get('concepts', [])}
Complexity: {topic.get('complexity', 'medium')}

## Requirements

Each example must have:
- instruction: User query/task (natural language, varied phrasing)
- input: Context/data provided (can be empty string if not needed)
- output: Expert response following EU {self.industry} best practices

## Complexity Distribution
- Simple (30%): Direct questions, single-step tasks
- Medium (50%): Multi-step reasoning, practical scenarios
- Complex (20%): Edge cases, multi-factor analysis

## Quality Standards
1. Use realistic industry terminology
2. Include specific EU regulations where relevant
3. Vary question formats (how-to, what-if, explain, calculate, compare)
4. Include realistic data points and measurements
5. Add safety considerations where appropriate

## Output Format
Return a JSON array:
[
    {{
        "instruction": "...",
        "input": "...",
        "output": "...",
        "complexity": "simple|medium|complex",
        "topic": "{topic_name}"
    }},
    ...
]

Only return the JSON array, no other text."""

            try:
                response = self.client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=16384,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                content = response.content[0].text
                
                # Extract JSON
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0]
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0]
                
                examples = json.loads(content.strip())
                all_examples.extend(examples)
                
                logger.info(f"   → Generated {len(examples)} examples")
                
                # Rate limiting - be nice to the API
                time.sleep(1)
                
            except Exception as e:
                logger.error(f"   → Error: {e}")
                continue
        
        # Save all examples
        examples_file = self.output_dir / "training_examples.json"
        with open(examples_file, 'w') as f:
            json.dump(all_examples, f, indent=2)
            
        logger.info(f"Total examples generated: {len(all_examples)}")
        logger.info(f"Examples saved to {examples_file}")
        
        return all_examples
    
    def convert_to_chat_format(self, examples: List[dict]) -> List[dict]:
        """Convert to chat format for SFT training"""
        
        chat_examples = []
        
        system_prompt = f"""You are an expert AI assistant specializing in {self.config['industry']['display_name']}. 
You have deep knowledge of EU regulations, industry best practices, and operational procedures.
Always provide accurate, practical, and safety-conscious advice."""
        
        for ex in examples:
            user_content = ex['instruction']
            if ex.get('input'):
                user_content += f"\n\nContext: {ex['input']}"
                
            chat_ex = {
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                    {"role": "assistant", "content": ex['output']}
                ],
                "metadata": {
                    "complexity": ex.get('complexity', 'medium'),
                    "topic": ex.get('topic', 'general'),
                    "industry": self.industry
                }
            }
            chat_examples.append(chat_ex)
        
        # Save chat format
        chat_file = self.output_dir / "training_chat_format.jsonl"
        with open(chat_file, 'w') as f:
            for ex in chat_examples:
                f.write(json.dumps(ex) + '\n')
                
        logger.info(f"Chat format saved to {chat_file}")
        logger.info(f"Total chat examples: {len(chat_examples)}")
        
        return chat_examples
    
    def generate_evaluation_set(self, n_examples: int = 100) -> List[dict]:
        """Generate held-out evaluation set"""
        
        industry_config = self.config['industry']
        
        prompt = f"""Generate {n_examples} evaluation examples for a {industry_config['display_name']} AI assistant.

These examples will be used to evaluate model performance and must:
1. Be representative of real-world use cases
2. Include gold-standard correct answers
3. Cover all focus areas: {', '.join(industry_config['focus_areas'])}
4. Include evaluation rubrics

For each example, provide:
- instruction: The user's question/task
- input: Any context (can be empty)
- expected_output: The gold-standard correct response
- evaluation_criteria: List of specific points to check for correctness
- difficulty: easy/medium/hard

Output as JSON array:
[
    {{
        "instruction": "...",
        "input": "...",
        "expected_output": "...",
        "evaluation_criteria": ["criterion1", "criterion2", ...],
        "difficulty": "easy|medium|hard"
    }},
    ...
]"""

        logger.info("Generating evaluation set...")
        
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=16384,
            messages=[{"role": "user", "content": prompt}]
        )
        
        content = response.content[0].text
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        eval_examples = json.loads(content.strip())
        
        # Save evaluation set
        eval_file = self.output_dir / "evaluation_set.json"
        with open(eval_file, 'w') as f:
            json.dump(eval_examples, f, indent=2)
            
        logger.info(f"Evaluation set saved to {eval_file}")
        logger.info(f"Evaluation examples: {len(eval_examples)}")
        
        return eval_examples


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate industry training data")
    parser.add_argument("--industry", required=True,
                       choices=["logistics", "construction", "manufacturing", "energy", "healthcare"])
    parser.add_argument("--samples-per-topic", type=int, default=30)
    parser.add_argument("--skip-curriculum", action="store_true")
    parser.add_argument("--eval-only", action="store_true")
    
    args = parser.parse_args()
    
    # Create logs directory
    Path("logs").mkdir(exist_ok=True)
    
    generator = IndustryDataGenerator(args.industry)
    
    if args.eval_only:
        generator.generate_evaluation_set()
        return
    
    # Generate or load curriculum
    curriculum_file = generator.output_dir / "curriculum.json"
    if args.skip_curriculum and curriculum_file.exists():
        with open(curriculum_file) as f:
            curriculum = json.load(f)
        logger.info("Loaded existing curriculum")
    else:
        curriculum = generator.generate_curriculum()
    
    # Generate training examples
    examples = generator.generate_training_examples(
        curriculum, 
        samples_per_topic=args.samples_per_topic
    )
    
    # Convert to chat format
    generator.convert_to_chat_format(examples)
    
    # Generate evaluation set
    generator.generate_evaluation_set()
    
    logger.info("✅ Data generation complete!")
    logger.info(f"   Training examples: {len(examples)}")
    logger.info(f"   Location: {generator.output_dir}")


if __name__ == "__main__":
    main()
PYTHON_EOF

chmod +x scripts/generate_training_data.py
```

### 2.2 Run Data Generation

**⚠️ This step uses Claude API and costs €40-60**

```bash
# Create logs directory
mkdir -p logs

# Run in tmux for long-running process
tmux new-session -d -s data-gen "python scripts/generate_training_data.py --industry logistics --samples-per-topic 30 2>&1 | tee logs/data-generation-logistics.log"

# Attach to watch progress
tmux attach -t data-gen

# Detach: Ctrl+B, D
# Monitor: tail -f logs/data-generation-logistics.log
```

**Expected runtime:** 2-3 hours

**Expected output structure:**
```
data/synthetic/logistics/
├── curriculum.json            (~50KB)
├── training_examples.json     (~2MB)
├── training_chat_format.jsonl (~2MB)
└── evaluation_set.json        (~200KB)
```

### 2.3 Verify Generated Data

```bash
# Check file sizes
ls -lh data/synthetic/logistics/

# Count examples
wc -l data/synthetic/logistics/training_chat_format.jsonl
# Should show: ~2000+ lines

# Inspect sample
head -1 data/synthetic/logistics/training_chat_format.jsonl | jq .

# Check complexity distribution
cat data/synthetic/logistics/training_examples.json | jq '.[] | .complexity' | sort | uniq -c
# Should show roughly: 30% simple, 50% medium, 20% complex
```

---

## Section 3: Model Training Setup (30 minutes)

### 3.1 Create Training Script

```bash
cat > scripts/train_logistics_lwm.py << 'ENDOFSCRIPT'
#!/usr/bin/env python3
"""
DWS IQ 6 - Logistics LWM Training Script
QLoRA fine-tuning of Llama 3.1 8B
"""

import os
import sys
import yaml
import torch
import logging
from pathlib import Path
from datetime import datetime

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
)
from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
)
from datasets import load_dataset
from trl import SFTTrainer, SFTConfig

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class LogisticsLWMTrainer:
    """Train Logistics industry LWM"""
    
    def __init__(self):
        self.industry = "logistics"
        self.config = self._load_config()
        self.output_dir = Path(f"models/finetuned/{self.industry}-lwm")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        
        if torch.cuda.is_available():
            logger.info(f"GPU: {torch.cuda.get_device_name(0)}")
            logger.info(f"VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    
    def _load_config(self) -> dict:
        """Load training configuration"""
        with open("configs/base_config.yaml") as f:
            return yaml.safe_load(f)
    
    def setup_quantization(self) -> BitsAndBytesConfig:
        """Configure 4-bit quantization"""
        quant_config = self.config['quantization']
        
        return BitsAndBytesConfig(
            load_in_4bit=quant_config['load_in_4bit'],
            bnb_4bit_quant_type=quant_config['bnb_4bit_quant_type'],
            bnb_4bit_compute_dtype=getattr(torch, quant_config['bnb_4bit_compute_dtype']),
            bnb_4bit_use_double_quant=quant_config['bnb_4bit_use_double_quant'],
        )
    
    def setup_lora(self) -> LoraConfig:
        """Configure LoRA"""
        lora_config = self.config['lora']
        
        return LoraConfig(
            r=lora_config['r'],
            lora_alpha=lora_config['lora_alpha'],
            lora_dropout=lora_config['lora_dropout'],
            target_modules=lora_config['target_modules'],
            bias=lora_config['bias'],
            task_type=lora_config['task_type'],
        )
    
    def load_model(self):
        """Load and prepare model"""
        model_config = self.config['model']
        model_path = os.path.expanduser(model_config['model_path'])
        
        logger.info(f"Loading model from: {model_path}")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.tokenizer.pad_token_id = self.tokenizer.eos_token_id
        
        # Configure quantization
        bnb_config = self.setup_quantization()
        
        # Load model
        self.model = AutoModelForCausalLM.from_pretrained(
            model_path,
            quantization_config=bnb_config,
            device_map="auto",
            torch_dtype=getattr(torch, model_config['torch_dtype']),
            trust_remote_code=True,
        )
        
        # Prepare for k-bit training
        self.model = prepare_model_for_kbit_training(
            self.model,
            use_gradient_checkpointing=self.config['optimization']['gradient_checkpointing']
        )
        
        # Apply LoRA
        lora_config = self.setup_lora()
        self.model = get_peft_model(self.model, lora_config)
        
        # Log trainable parameters
        trainable = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        total = sum(p.numel() for p in self.model.parameters())
        logger.info(f"Trainable: {trainable:,} ({100 * trainable / total:.2f}%)")
        
        return self.model, self.tokenizer
    
    def load_dataset(self):
        """Load training dataset"""
        data_path = f"data/synthetic/{self.industry}/training_chat_format.jsonl"
        
        logger.info(f"Loading dataset: {data_path}")
        
        dataset = load_dataset("json", data_files=data_path, split="train")
        
        logger.info(f"Dataset size: {len(dataset)} examples")
        
        return dataset
    
    def train(self, dataset):
        """Run training"""
        train_config = self.config['training']
        opt_config = self.config['optimization']
        log_config = self.config['logging']
        
        # Training arguments
        training_args = SFTConfig(
            output_dir=str(self.output_dir),
            num_train_epochs=train_config['num_train_epochs'],
            per_device_train_batch_size=train_config['per_device_train_batch_size'],
            gradient_accumulation_steps=train_config['gradient_accumulation_steps'],
            learning_rate=train_config['learning_rate'],
            weight_decay=train_config['weight_decay'],
            warmup_ratio=train_config['warmup_ratio'],
            lr_scheduler_type=train_config['lr_scheduler_type'],
            max_grad_norm=train_config['max_grad_norm'],
            
            gradient_checkpointing=opt_config['gradient_checkpointing'],
            bf16=opt_config['bf16'],
            tf32=opt_config['tf32'],
            
            logging_steps=log_config['logging_steps'],
            save_strategy=log_config['save_strategy'],
            save_steps=log_config.get('save_steps', 100),
            save_total_limit=log_config['save_total_limit'],
            
            max_seq_length=self.config['model']['max_seq_length'],
            
            run_name=f"{self.industry}-lwm-{datetime.now().strftime('%Y%m%d-%H%M')}",
        )
        
        # Initialize trainer
        trainer = SFTTrainer(
            model=self.model,
            train_dataset=dataset,
            processing_class=self.tokenizer,
            args=training_args,
        )
        
        # Train
        logger.info("=" * 50)
        logger.info("Starting training...")
        logger.info("=" * 50)
        
        trainer.train()
        
        # Save final model
        logger.info(f"Saving model to {self.output_dir}")
        trainer.save_model()
        self.tokenizer.save_pretrained(self.output_dir)
        
        logger.info("✅ Training complete!")
        
        return trainer


def main():
    trainer = LogisticsLWMTrainer()
    
    # Load model
    trainer.load_model()
    
    # Load dataset
    dataset = trainer.load_dataset()
    
    # Train
    trainer.train(dataset)


if __name__ == "__main__":
    main()
ENDOFSCRIPT

chmod +x scripts/train_logistics_lwm.py
```

---

## Section 4: Training Execution (16-20 hours)

### 4.1 Pre-Training Checklist

```bash
# Run pre-flight checks
cat > scripts/pre_training_check.sh << 'EOF'
#!/bin/bash

echo "=== Pre-Training Checklist ==="

# GPU available
nvidia-smi > /dev/null 2>&1 && echo "✅ GPU available" || echo "❌ No GPU"

# Data files exist
[ -f "data/synthetic/logistics/training_chat_format.jsonl" ] && echo "✅ Training data exists" || echo "❌ No training data"

# Model exists
[ -d "$HOME/dws-lwm/models/base/llama-3.1-8b" ] && echo "✅ Base model exists" || echo "❌ No base model"

# Disk space (need ~50GB free)
FREE_GB=$(df -BG ~/dws-lwm | tail -1 | awk '{print $4}' | sed 's/G//')
if [ "$FREE_GB" -gt 50 ]; then
    echo "✅ Disk space: ${FREE_GB}GB available"
else
    echo "⚠️  Disk space: Only ${FREE_GB}GB - need 50GB+"
fi

# Python environment
source ~/dws-lwm/venv/bin/activate
python -c "import torch; print('✅ PyTorch CUDA' if torch.cuda.is_available() else '❌ No CUDA')"

echo ""
echo "Ready to train? (Ctrl+C to abort, or press Enter to continue)"
read
EOF

chmod +x scripts/pre_training_check.sh
bash scripts/pre_training_check.sh
```

### 4.2 Start Training

**⚠️ This runs for 16-20 hours. Use tmux!**

```bash
# Start training in tmux
tmux new-session -d -s lwm-training "python scripts/train_logistics_lwm.py 2>&1 | tee logs/training-logistics-$(date +%Y%m%d-%H%M%S).log"

# Attach to watch
tmux attach -t lwm-training

# Detach: Ctrl+B, D

# Monitor GPU while training runs
watch -n 5 nvidia-smi
```

### 4.3 Monitor Training Progress

```bash
# Watch logs
tail -f logs/training-logistics-*.log

# Check checkpoints
ls -lh models/finetuned/logistics-lwm/

# Monitor GPU usage
nvidia-smi --query-gpu=timestamp,utilization.gpu,utilization.memory,memory.used,memory.total,temperature.gpu --format=csv -l 60 > logs/gpu-usage.csv &
```

**Expected training output:**
```
{'loss': 2.145, 'learning_rate': 0.00019, 'epoch': 0.10}
{'loss': 1.987, 'learning_rate': 0.00018, 'epoch': 0.20}
{'loss': 1.756, 'learning_rate': 0.00017, 'epoch': 0.30}
...
{'loss': 0.982, 'learning_rate': 0.00005, 'epoch': 2.80}
{'loss': 0.945, 'learning_rate': 0.00002, 'epoch': 2.90}
{'loss': 0.921, 'learning_rate': 0.00000, 'epoch': 3.00}

✅ Training complete!
```

**Training convergence criteria:**
- Final loss < 1.0
- Loss decreasing steadily
- No NaN losses
- GPU utilization > 80%

---

## Section 5: Post-Training Tasks (30 minutes)

### 5.1 Verify Training Results

```bash
# Check checkpoint directory
ls -lh models/finetuned/logistics-lwm/

# Expected files:
# - adapter_config.json
# - adapter_model.safetensors
# - checkpoint-*/
# - tokenizer files
# - training_args.bin

# Check file sizes
du -sh models/finetuned/logistics-lwm/*

# Adapter should be ~300-500MB
```

### 5.2 Test Trained Model

```bash
cat > scripts/test_trained_model.py << 'EOF'
#!/usr/bin/env python3
"""Quick test of trained model"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import os

# Paths
base_model_path = os.path.expanduser("~/dws-lwm/models/base/llama-3.1-8b")
adapter_path = "models/finetuned/logistics-lwm"

print("Loading base model...")
tokenizer = AutoTokenizer.from_pretrained(base_model_path)
model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

print("Loading adapter...")
model = PeftModel.from_pretrained(model, adapter_path)

# Test prompt
messages = [
    {"role": "system", "content": "You are an expert Logistics & Fleet Management AI assistant."},
    {"role": "user", "content": "How should I plan driver schedules to comply with EU Working Time Directive?"}
]

# Format with chat template
prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

# Generate
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(
    **inputs,
    max_new_tokens=300,
    do_sample=True,
    temperature=0.7,
    top_p=0.9
)

response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print("\n" + "=" * 60)
print("TEST PROMPT")
print("=" * 60)
print(messages[1]['content'])
print("\n" + "=" * 60)
print("MODEL RESPONSE")
print("=" * 60)
print(response.split("[/INST]")[-1].strip())
print("=" * 60)
EOF

python scripts/test_trained_model.py
```

**Expected response should:**
- Reference Working Time Directive 2003/88/EC
- Mention 48-hour weekly limit
- Discuss rest period requirements
- Use logistics-specific terminology

---

## Lab Session 2 Complete! 🎉

### Checklist

- [ ] Training data generated (~2000 examples)
- [ ] Training completed without errors
- [ ] Final loss < 1.0
- [ ] Checkpoints saved in `models/finetuned/logistics-lwm/`
- [ ] Test inference produces relevant responses

### Files Created

```
data/synthetic/logistics/
├── curriculum.json
├── training_examples.json
├── training_chat_format.jsonl (~2000 lines)
└── evaluation_set.json

models/finetuned/logistics-lwm/
├── adapter_config.json
├── adapter_model.safetensors (~400MB)
├── checkpoint-100/
├── checkpoint-200/
└── tokenizer files
```

### Costs Incurred

- Claude API: €40-60
- Electricity (16h @ 200W): ~€5-8
- **Total: ~€50-70**

### Next Steps

**Proceed to Part 3:** `training-manual-part3-evaluation-deployment.md`

Part 3 covers:
- Model evaluation with Claude-as-judge
- LoRA weight merging
- Production deployment
- Performance benchmarking

---

---

## Section 6: Ollama Model Configuration for Code Review (30 minutes)

After completing Part 1's Ollama installation, configure a code review model for the Level 5 automated PR review.

### 6.1 Create Ollama Modelfile for Code Review

```bash
cat > ~/dws-lwm/configs/ollama/code-reviewer.Modelfile << 'EOF'
# DWS IQ 6 Code Reviewer — Custom Ollama Model
# Based on Qwen3-Coder 30B (MoE, 3.3B active per token)
FROM qwen3-coder:30b

# System prompt for code review
SYSTEM """You are a strict senior code reviewer for DWS IQ 6, an enterprise climate intelligence platform.

Stack: TypeScript 5.9, React 19, Express, Python 3.11, Supabase, TailwindCSS.

Review focus:
1. SECURITY — API key exposure, injection, OWASP Top 10, GDPR compliance
2. CORRECTNESS — logic errors, type safety, edge cases
3. EU COMPLIANCE — AI Act Article 12 logging, data residency, GDPR
4. PERFORMANCE — N+1 queries, memory leaks, bundle size

Your default verdict is REQUEST_CHANGES. Only APPROVE when genuinely excellent.
Format issues as file:line references. Be specific and actionable."""

# Parameters optimized for code review
PARAMETER temperature 0.1
PARAMETER top_p 0.9
PARAMETER num_predict 2000
PARAMETER stop "---"
EOF

# Create the custom model
ollama create dws-code-reviewer -f ~/dws-lwm/configs/ollama/code-reviewer.Modelfile

# Verify
ollama list
# Should show: dws-code-reviewer
```

### 6.2 Test Code Review Model

```bash
# Test with a realistic PR diff
ollama run dws-code-reviewer << 'EOF'
Review this TypeScript code diff:

+import { Request, Response } from 'express';
+
+app.get('/api/users/:id', async (req: Request, res: Response) => {
+  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
+  const result = await db.query(query);
+  res.json(result.rows);
+});
EOF

# Expected: Identifies SQL injection, recommends parameterized query
```

### 6.3 Benchmark Code Review Performance

```bash
cat > ~/dws-lwm/scripts/benchmark_code_review.sh << 'SCRIPT'
#!/bin/bash
# Benchmark Ollama code review response time

echo "=== Ollama Code Review Benchmark ==="
echo "Model: dws-code-reviewer"
echo "Date: $(date)"

PROMPTS=(
    "Review: const x = eval(userInput)"
    "Review: app.use(cors({ origin: '*' }))"
    "Review: const token = 'sk-ant-api03-hardcoded-key'"
)

for i in "${!PROMPTS[@]}"; do
    START=$(date +%s%N)
    ollama run dws-code-reviewer "${PROMPTS[$i]}" > /dev/null 2>&1
    END=$(date +%s%N)
    ELAPSED=$(( (END - START) / 1000000 ))
    echo "Prompt $((i+1)): ${ELAPSED}ms"
done
SCRIPT

chmod +x ~/dws-lwm/scripts/benchmark_code_review.sh
bash ~/dws-lwm/scripts/benchmark_code_review.sh
```

---

**Document Control:**
- **Part:** 2 of 3
- **Version:** 1.1
- **Status:** Lab-tested executable
- **Execution Time:** 16-24 hours
- **Next:** Part 3 - Evaluation & Deployment

---

*Lifetime Oy - Internal Use Only*
