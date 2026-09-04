export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json
          organization_id: string | null
          severity: string
          title: string
          type: string
          user_id: string | null
          visibility: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          organization_id?: string | null
          severity?: string
          title: string
          type: string
          user_id?: string | null
          visibility?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          organization_id?: string | null
          severity?: string
          title?: string
          type?: string
          user_id?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_activity: {
        Row: {
          agent_name: string
          created_at: string | null
          id: string
          metadata: Json | null
          status: string
          task: string
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status: string
          task: string
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          task?: string
        }
        Relationships: []
      }
      agent_approvals: {
        Row: {
          action_details: Json
          action_type: string
          agent_id: string
          approver_email: string
          created_at: string | null
          decision_at: string | null
          event_id: string
          expires_at: string | null
          id: string
          rejection_reason: string | null
          status: string
        }
        Insert: {
          action_details: Json
          action_type: string
          agent_id: string
          approver_email: string
          created_at?: string | null
          decision_at?: string | null
          event_id: string
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string
        }
        Update: {
          action_details?: Json
          action_type?: string
          agent_id?: string
          approver_email?: string
          created_at?: string | null
          decision_at?: string | null
          event_id?: string
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_approvals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "firehorse_events"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_costs: {
        Row: {
          agent_id: string
          api_calls: number | null
          api_cost_eur: number | null
          api_service: string | null
          cost_date: string
          created_at: string | null
          id: string
          input_tokens: number | null
          llm_model: string | null
          llm_provider: string | null
          model_cost_eur: number | null
          output_tokens: number | null
          total_cost_eur: number | null
        }
        Insert: {
          agent_id: string
          api_calls?: number | null
          api_cost_eur?: number | null
          api_service?: string | null
          cost_date?: string
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          llm_model?: string | null
          llm_provider?: string | null
          model_cost_eur?: number | null
          output_tokens?: number | null
          total_cost_eur?: number | null
        }
        Update: {
          agent_id?: string
          api_calls?: number | null
          api_cost_eur?: number | null
          api_service?: string | null
          cost_date?: string
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          llm_model?: string | null
          llm_provider?: string | null
          model_cost_eur?: number | null
          output_tokens?: number | null
          total_cost_eur?: number | null
        }
        Relationships: []
      }
      agent_executions: {
        Row: {
          agent_name: string
          article12_lineage: Json | null
          audit_grade: boolean
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          governed_outcome_layer: boolean
          id: string
          input: Json | null
          org_id: string
          output: Json | null
          project_id: string
          session_id: string
          status: string
          user_id: string
        }
        Insert: {
          agent_name: string
          article12_lineage?: Json | null
          audit_grade?: boolean
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          governed_outcome_layer?: boolean
          id?: string
          input?: Json | null
          org_id: string
          output?: Json | null
          project_id: string
          session_id: string
          status: string
          user_id: string
        }
        Update: {
          agent_name?: string
          article12_lineage?: Json | null
          audit_grade?: boolean
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          governed_outcome_layer?: boolean
          id?: string
          input?: Json | null
          org_id?: string
          output?: Json | null
          project_id?: string
          session_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_logs: {
        Row: {
          agent_name: string
          id: string
          metadata: Json | null
          status: string
          task: string
          timestamp: string | null
        }
        Insert: {
          agent_name: string
          id?: string
          metadata?: Json | null
          status: string
          task: string
          timestamp?: string | null
        }
        Update: {
          agent_name?: string
          id?: string
          metadata?: Json | null
          status?: string
          task?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      agent_metrics: {
        Row: {
          agent_id: string
          api_calls: number | null
          avg_confidence_score: number | null
          avg_icp_score: number | null
          bounces: number | null
          click_rate: number | null
          created_at: string | null
          emails_clicked: number | null
          emails_opened: number | null
          emails_replied: number | null
          emails_sent: number | null
          estimated_cost_eur: number | null
          id: string
          leads_processed: number | null
          linkedin_connections: number | null
          linkedin_inmails: number | null
          meeting_booked_rate: number | null
          meetings_booked: number | null
          metric_date: string
          open_rate: number | null
          reply_rate: number | null
          spam_complaints: number | null
          unsubscribes: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          api_calls?: number | null
          avg_confidence_score?: number | null
          avg_icp_score?: number | null
          bounces?: number | null
          click_rate?: number | null
          created_at?: string | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          estimated_cost_eur?: number | null
          id?: string
          leads_processed?: number | null
          linkedin_connections?: number | null
          linkedin_inmails?: number | null
          meeting_booked_rate?: number | null
          meetings_booked?: number | null
          metric_date?: string
          open_rate?: number | null
          reply_rate?: number | null
          spam_complaints?: number | null
          unsubscribes?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          api_calls?: number | null
          avg_confidence_score?: number | null
          avg_icp_score?: number | null
          bounces?: number | null
          click_rate?: number | null
          created_at?: string | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          estimated_cost_eur?: number | null
          id?: string
          leads_processed?: number | null
          linkedin_connections?: number | null
          linkedin_inmails?: number | null
          meeting_booked_rate?: number | null
          meetings_booked?: number | null
          metric_date?: string
          open_rate?: number | null
          reply_rate?: number | null
          spam_complaints?: number | null
          unsubscribes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_nudges: {
        Row: {
          action_options: string[]
          agent_name: string
          body: string
          channels: string[]
          created_at: string
          entity_id: string
          escalate_at: string
          gate_decision: string
          id: string
          metadata: Json
          org_id: string
          recipient_role: string
          resolution: string | null
          resolved_at: string | null
          signal_key: string
          status: string
          subject: string
          tier: string
        }
        Insert: {
          action_options?: string[]
          agent_name: string
          body: string
          channels?: string[]
          created_at?: string
          entity_id: string
          escalate_at: string
          gate_decision: string
          id: string
          metadata?: Json
          org_id: string
          recipient_role: string
          resolution?: string | null
          resolved_at?: string | null
          signal_key: string
          status?: string
          subject: string
          tier: string
        }
        Update: {
          action_options?: string[]
          agent_name?: string
          body?: string
          channels?: string[]
          created_at?: string
          entity_id?: string
          escalate_at?: string
          gate_decision?: string
          id?: string
          metadata?: Json
          org_id?: string
          recipient_role?: string
          resolution?: string | null
          resolved_at?: string | null
          signal_key?: string
          status?: string
          subject?: string
          tier?: string
        }
        Relationships: []
      }
      agent_signals: {
        Row: {
          agent_id: string
          context_id: string | null
          emitted_at: string | null
          id: string
          metadata: Json | null
          milestone: string
          signal_type: string
        }
        Insert: {
          agent_id: string
          context_id?: string | null
          emitted_at?: string | null
          id?: string
          metadata?: Json | null
          milestone: string
          signal_type: string
        }
        Update: {
          agent_id?: string
          context_id?: string | null
          emitted_at?: string | null
          id?: string
          metadata?: Json | null
          milestone?: string
          signal_type?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          hash: string
          id: string
          last_used_at: string | null
          name: string
          prefix: string
          revoked: boolean
          scopes: string[]
          tier: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          hash: string
          id?: string
          last_used_at?: string | null
          name: string
          prefix: string
          revoked?: boolean
          scopes?: string[]
          tier?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          hash?: string
          id?: string
          last_used_at?: string | null
          name?: string
          prefix?: string
          revoked?: boolean
          scopes?: string[]
          tier?: string | null
          user_id?: string
        }
        Relationships: []
      }
      article12_audit_log: {
        Row: {
          agent_id: string
          created_at: string
          decision_summary: string | null
          id: string
          inference_in_eu: boolean
          inference_location: string
          input_hash: string
          input_token_count: number | null
          model: string
          output_token_count: number | null
          pii_replacement_count: number
          pii_scrub_location: string
          pii_scrubbed: boolean
          pii_types_found: string[] | null
          regulation_ids: string[] | null
          risk_classification: string | null
          scrub_manifest_hash: string | null
          scrubber_version: string
          thinking_block_hash: string | null
          thinking_effort: string | null
          trace_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          decision_summary?: string | null
          id?: string
          inference_in_eu?: boolean
          inference_location?: string
          input_hash: string
          input_token_count?: number | null
          model: string
          output_token_count?: number | null
          pii_replacement_count?: number
          pii_scrub_location?: string
          pii_scrubbed?: boolean
          pii_types_found?: string[] | null
          regulation_ids?: string[] | null
          risk_classification?: string | null
          scrub_manifest_hash?: string | null
          scrubber_version?: string
          thinking_block_hash?: string | null
          thinking_effort?: string | null
          trace_id?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          decision_summary?: string | null
          id?: string
          inference_in_eu?: boolean
          inference_location?: string
          input_hash?: string
          input_token_count?: number | null
          model?: string
          output_token_count?: number | null
          pii_replacement_count?: number
          pii_scrub_location?: string
          pii_scrubbed?: boolean
          pii_types_found?: string[] | null
          regulation_ids?: string[] | null
          risk_classification?: string | null
          scrub_manifest_hash?: string | null
          scrubber_version?: string
          thinking_block_hash?: string | null
          thinking_effort?: string | null
          trace_id?: string
        }
        Relationships: []
      }
      auth_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bim_projects: {
        Row: {
          bim_file_url: string
          building_type: string | null
          country: string
          created_at: string | null
          error_message: string | null
          extraction_data: Json | null
          file_format: string | null
          gross_floor_area_m2: number | null
          id: string
          location: string | null
          org_id: string | null
          project_code: string | null
          project_name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bim_file_url: string
          building_type?: string | null
          country?: string
          created_at?: string | null
          error_message?: string | null
          extraction_data?: Json | null
          file_format?: string | null
          gross_floor_area_m2?: number | null
          id?: string
          location?: string | null
          org_id?: string | null
          project_code?: string | null
          project_name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bim_file_url?: string
          building_type?: string | null
          country?: string
          created_at?: string | null
          error_message?: string | null
          extraction_data?: Json | null
          file_format?: string | null
          gross_floor_area_m2?: number | null
          id?: string
          location?: string | null
          org_id?: string | null
          project_code?: string | null
          project_name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bim_projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_availability: {
        Row: {
          created_at: string | null
          date_override: string | null
          day_of_week: number | null
          end_time: string
          id: string
          is_available: boolean | null
          service_id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_override?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_available?: boolean | null
          service_id: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_override?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          service_id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "booking_services"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_reservations: {
        Row: {
          confirmation_sent_at: string | null
          created_at: string | null
          customer_company: string | null
          customer_email: string
          customer_name: string
          customer_notes: string | null
          customer_phone: string
          duration_minutes: number
          id: string
          reserved_at: string
          risto_notified_at: string | null
          service_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          confirmation_sent_at?: string | null
          created_at?: string | null
          customer_company?: string | null
          customer_email: string
          customer_name: string
          customer_notes?: string | null
          customer_phone: string
          duration_minutes: number
          id?: string
          reserved_at: string
          risto_notified_at?: string | null
          service_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          confirmation_sent_at?: string | null
          created_at?: string | null
          customer_company?: string | null
          customer_email?: string
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string
          duration_minutes?: number
          id?: string
          reserved_at?: string
          risto_notified_at?: string | null
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "booking_services"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_services: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      captain_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          industry: string
          message: string | null
          name: string
          seat_level: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          industry: string
          message?: string | null
          name: string
          seat_level: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          industry?: string
          message?: string | null
          name?: string
          seat_level?: string
          status?: string | null
        }
        Relationships: []
      }
      carbon_calculations: {
        Row: {
          a1_raw_materials: number | null
          a2_transport: number | null
          a3_manufacturing: number | null
          a4_transport_to_site: number | null
          a5_construction: number | null
          b1_use: number | null
          b2_maintenance: number | null
          b3_repair: number | null
          b4_replacement: number | null
          b5_refurbishment: number | null
          b6_operational_energy: number | null
          b7_operational_water: number | null
          bim_project_id: string
          c1_deconstruction: number | null
          c2_transport_eol: number | null
          c3_waste_processing: number | null
          c4_disposal: number | null
          calculated_at: string | null
          calculation_method: string | null
          cbam_status: string | null
          created_at: string | null
          csrd_status: string | null
          d_reuse_recovery: number | null
          ets_status: string | null
          fit55_score: number | null
          id: string
          kg_co2e_per_m2: number | null
          materials_breakdown: Json | null
          total_kg_co2e: number | null
        }
        Insert: {
          a1_raw_materials?: number | null
          a2_transport?: number | null
          a3_manufacturing?: number | null
          a4_transport_to_site?: number | null
          a5_construction?: number | null
          b1_use?: number | null
          b2_maintenance?: number | null
          b3_repair?: number | null
          b4_replacement?: number | null
          b5_refurbishment?: number | null
          b6_operational_energy?: number | null
          b7_operational_water?: number | null
          bim_project_id: string
          c1_deconstruction?: number | null
          c2_transport_eol?: number | null
          c3_waste_processing?: number | null
          c4_disposal?: number | null
          calculated_at?: string | null
          calculation_method?: string | null
          cbam_status?: string | null
          created_at?: string | null
          csrd_status?: string | null
          d_reuse_recovery?: number | null
          ets_status?: string | null
          fit55_score?: number | null
          id?: string
          kg_co2e_per_m2?: number | null
          materials_breakdown?: Json | null
          total_kg_co2e?: number | null
        }
        Update: {
          a1_raw_materials?: number | null
          a2_transport?: number | null
          a3_manufacturing?: number | null
          a4_transport_to_site?: number | null
          a5_construction?: number | null
          b1_use?: number | null
          b2_maintenance?: number | null
          b3_repair?: number | null
          b4_replacement?: number | null
          b5_refurbishment?: number | null
          b6_operational_energy?: number | null
          b7_operational_water?: number | null
          bim_project_id?: string
          c1_deconstruction?: number | null
          c2_transport_eol?: number | null
          c3_waste_processing?: number | null
          c4_disposal?: number | null
          calculated_at?: string | null
          calculation_method?: string | null
          cbam_status?: string | null
          created_at?: string | null
          csrd_status?: string | null
          d_reuse_recovery?: number | null
          ets_status?: string | null
          fit55_score?: number | null
          id?: string
          kg_co2e_per_m2?: number | null
          materials_breakdown?: Json | null
          total_kg_co2e?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_calculations_bim_project_id_fkey"
            columns: ["bim_project_id"]
            isOneToOne: false
            referencedRelation: "bim_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      climate_assistant_usage: {
        Row: {
          cost_usd: number
          created_at: string | null
          date: string
          id: string
          input_tokens: number
          output_tokens: number
          requests: number
          updated_at: string | null
        }
        Insert: {
          cost_usd?: number
          created_at?: string | null
          date: string
          id?: string
          input_tokens?: number
          output_tokens?: number
          requests?: number
          updated_at?: string | null
        }
        Update: {
          cost_usd?: number
          created_at?: string | null
          date?: string
          id?: string
          input_tokens?: number
          output_tokens?: number
          requests?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      command_audit_log: {
        Row: {
          agent_id: string
          bridge: string
          caller_ats: number | null
          created_at: string
          decision: string | null
          denied_reason: string | null
          duration_ms: number | null
          error_text: string | null
          event_hash: string
          event_id: string
          event_type: string
          id: string
          input_digest: string | null
          kya_session_id: string | null
          minimum_ats: number | null
          model_version: string | null
          operator_id: string | null
          org_id: string | null
          output_digest: string | null
          pii_replacement_count: number
          pii_types_found: string[] | null
          prev_hash: string
          risk_classification: string | null
          skill: string
          span_id: string | null
          success: boolean | null
          trace_id: string
        }
        Insert: {
          agent_id: string
          bridge: string
          caller_ats?: number | null
          created_at?: string
          decision?: string | null
          denied_reason?: string | null
          duration_ms?: number | null
          error_text?: string | null
          event_hash: string
          event_id?: string
          event_type: string
          id?: string
          input_digest?: string | null
          kya_session_id?: string | null
          minimum_ats?: number | null
          model_version?: string | null
          operator_id?: string | null
          org_id?: string | null
          output_digest?: string | null
          pii_replacement_count?: number
          pii_types_found?: string[] | null
          prev_hash: string
          risk_classification?: string | null
          skill: string
          span_id?: string | null
          success?: boolean | null
          trace_id: string
        }
        Update: {
          agent_id?: string
          bridge?: string
          caller_ats?: number | null
          created_at?: string
          decision?: string | null
          denied_reason?: string | null
          duration_ms?: number | null
          error_text?: string | null
          event_hash?: string
          event_id?: string
          event_type?: string
          id?: string
          input_digest?: string | null
          kya_session_id?: string | null
          minimum_ats?: number | null
          model_version?: string | null
          operator_id?: string | null
          org_id?: string | null
          output_digest?: string | null
          pii_replacement_count?: number
          pii_types_found?: string[] | null
          prev_hash?: string
          risk_classification?: string | null
          skill?: string
          span_id?: string | null
          success?: boolean | null
          trace_id?: string
        }
        Relationships: []
      }
      compliance_assessments: {
        Row: {
          assessed_by: string
          assessment_type: string
          compliance_status: string
          created_at: string
          gaps: Json
          id: string
          overall_score: number
          profile_id: string
          recommendations: string[]
          regulation_scores: Json
        }
        Insert: {
          assessed_by?: string
          assessment_type?: string
          compliance_status: string
          created_at?: string
          gaps?: Json
          id?: string
          overall_score: number
          profile_id: string
          recommendations?: string[]
          regulation_scores: Json
        }
        Update: {
          assessed_by?: string
          assessment_type?: string
          compliance_status?: string
          created_at?: string
          gaps?: Json
          id?: string
          overall_score?: number
          profile_id?: string
          recommendations?: string[]
          regulation_scores?: Json
        }
        Relationships: [
          {
            foreignKeyName: "compliance_assessments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "compliance_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_profiles: {
        Row: {
          annual_emissions_tonnes: number | null
          annual_revenue_eur: number | null
          country: string
          created_at: string
          employee_count: string
          id: string
          import_value_eur: number | null
          industry: string
          organization_id: string
          regulations: string[]
          updated_at: string
        }
        Insert: {
          annual_emissions_tonnes?: number | null
          annual_revenue_eur?: number | null
          country?: string
          created_at?: string
          employee_count?: string
          id?: string
          import_value_eur?: number | null
          industry: string
          organization_id: string
          regulations?: string[]
          updated_at?: string
        }
        Update: {
          annual_emissions_tonnes?: number | null
          annual_revenue_eur?: number | null
          country?: string
          created_at?: string
          employee_count?: string
          id?: string
          import_value_eur?: number | null
          industry?: string
          organization_id?: string
          regulations?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      concept_context_policy: {
        Row: {
          cloud_profile: string | null
          concept_id: string
          created_at: string
          definition_override: string | null
          id: string
          legal_profile: string | null
          locale: string
          platform_version: string | null
          policy_level: Database["public"]["Enums"]["policy_level_enum"]
          preferred_term: string
          product_edition: string | null
          scope_ref: string | null
          scope_type: Database["public"]["Enums"]["scope_type_enum"]
          updated_at: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          cloud_profile?: string | null
          concept_id: string
          created_at?: string
          definition_override?: string | null
          id?: string
          legal_profile?: string | null
          locale?: string
          platform_version?: string | null
          policy_level?: Database["public"]["Enums"]["policy_level_enum"]
          preferred_term: string
          product_edition?: string | null
          scope_ref?: string | null
          scope_type: Database["public"]["Enums"]["scope_type_enum"]
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          cloud_profile?: string | null
          concept_id?: string
          created_at?: string
          definition_override?: string | null
          id?: string
          legal_profile?: string | null
          locale?: string
          platform_version?: string | null
          policy_level?: Database["public"]["Enums"]["policy_level_enum"]
          preferred_term?: string
          product_edition?: string | null
          scope_ref?: string | null
          scope_type?: Database["public"]["Enums"]["scope_type_enum"]
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      construction_leads: {
        Row: {
          buyer_name: string | null
          buyer_url: string | null
          company_name: string
          contract_type: string | null
          country_code: string | null
          country_name: string | null
          cpv_code: string | null
          cpv_description: string | null
          created_at: string
          created_by: string
          currency: string | null
          deadline_date: string | null
          description: string | null
          document_number: string | null
          estimated_value: number | null
          id: string
          notes: string | null
          notice_type: string | null
          nuts_code: string | null
          org_id: string | null
          place_of_performance: string | null
          procedure_type: string | null
          publication_date: string | null
          raw_data: Json | null
          relevance_score: number | null
          source: string
          status: string | null
          ted_notice_id: string
          ted_url: string | null
          tender_id: string
          title: string
          updated_at: string
        }
        Insert: {
          buyer_name?: string | null
          buyer_url?: string | null
          company_name?: string
          contract_type?: string | null
          country_code?: string | null
          country_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          document_number?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          notice_type?: string | null
          nuts_code?: string | null
          org_id?: string | null
          place_of_performance?: string | null
          procedure_type?: string | null
          publication_date?: string | null
          raw_data?: Json | null
          relevance_score?: number | null
          source?: string
          status?: string | null
          ted_notice_id: string
          ted_url?: string | null
          tender_id: string
          title: string
          updated_at?: string
        }
        Update: {
          buyer_name?: string | null
          buyer_url?: string | null
          company_name?: string
          contract_type?: string | null
          country_code?: string | null
          country_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          document_number?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          notice_type?: string | null
          nuts_code?: string | null
          org_id?: string | null
          place_of_performance?: string | null
          procedure_type?: string | null
          publication_date?: string | null
          raw_data?: Json | null
          relevance_score?: number | null
          source?: string
          status?: string | null
          ted_notice_id?: string
          ted_url?: string | null
          tender_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      content_calendar: {
        Row: {
          created_at: string
          id: string
          platform: string
          post_date: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          post_date: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          post_date?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          contract_number: string | null
          created_at: string | null
          currency: string | null
          customer_id: string
          description: string | null
          document_url: string | null
          end_date: string | null
          id: string
          sent_date: string | null
          signed_date: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"]
          term_months: number | null
          title: string
          total_value: number
          updated_at: string | null
        }
        Insert: {
          contract_number?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id: string
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          sent_date?: string | null
          signed_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          term_months?: number | null
          title: string
          total_value: number
          updated_at?: string | null
        }
        Update: {
          contract_number?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          sent_date?: string | null
          signed_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          term_months?: number | null
          title?: string
          total_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "current_mrr_by_customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts_lifecycle: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string | null
          customer_id: string
          customer_name: string | null
          effective_date: string | null
          expiry_date: string | null
          id: string
          payload: Json | null
          renewal_reminder_date: string | null
          source_file: string | null
          status: string
          total_value: number | null
          type: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          customer_id: string
          customer_name?: string | null
          effective_date?: string | null
          expiry_date?: string | null
          id: string
          payload?: Json | null
          renewal_reminder_date?: string | null
          source_file?: string | null
          status: string
          total_value?: number | null
          type: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          customer_id?: string
          customer_name?: string | null
          effective_date?: string | null
          expiry_date?: string | null
          id?: string
          payload?: Json | null
          renewal_reminder_date?: string | null
          source_file?: string | null
          status?: string
          total_value?: number | null
          type?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      customer_onboarding: {
        Row: {
          annual_revenue: string | null
          company_name: string
          completed_at: string
          country: string
          created_at: string
          data_sources: string[]
          employee_count: string
          erp_connection: Json | null
          id: string
          industry: string
          regulations: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_revenue?: string | null
          company_name: string
          completed_at?: string
          country?: string
          created_at?: string
          data_sources?: string[]
          employee_count?: string
          erp_connection?: Json | null
          id?: string
          industry: string
          regulations?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_revenue?: string | null
          company_name?: string
          completed_at?: string
          country?: string
          created_at?: string
          data_sources?: string[]
          employee_count?: string
          erp_connection?: Json | null
          id?: string
          industry?: string
          regulations?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          churned_at: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          country: string | null
          created_at: string | null
          current_arr: number | null
          current_mrr: number | null
          firehorse_lead_id: string | null
          id: string
          industry: string | null
          lifetime_value: number | null
          name: string
          notes: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          status: Database["public"]["Enums"]["customer_status"]
          updated_at: string | null
          website: string | null
        }
        Insert: {
          churned_at?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          country?: string | null
          created_at?: string | null
          current_arr?: number | null
          current_mrr?: number | null
          firehorse_lead_id?: string | null
          id?: string
          industry?: string | null
          lifetime_value?: number | null
          name: string
          notes?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          churned_at?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          country?: string | null
          created_at?: string | null
          current_arr?: number | null
          current_mrr?: number | null
          firehorse_lead_id?: string | null
          id?: string
          industry?: string | null
          lifetime_value?: number | null
          name?: string
          notes?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_active_proposals"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold2_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold3_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_daily_new_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_linkedin_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_sales_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_upcoming_meetings"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "customers_firehorse_lead_id_fkey"
            columns: ["firehorse_lead_id"]
            isOneToOne: false
            referencedRelation: "v_high_priority_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string | null
          error: string | null
          from_email: string
          id: string
          metadata: Json | null
          organization_id: string | null
          resend_email_id: string | null
          sent_at: string | null
          status: string
          subject: string
          template_type: string | null
          to_email: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          from_email: string
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_type?: string | null
          to_email: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          from_email?: string
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_type?: string | null
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          enqueued_at: string | null
          error: string | null
          id: string
          metadata: Json | null
          sent_at: string | null
          source: string | null
          status: string
          stream_message_id: string | null
          subject: string
          template_type: string | null
          to_email: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          enqueued_at?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          source?: string | null
          status?: string
          stream_message_id?: string | null
          subject: string
          template_type?: string | null
          to_email: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          enqueued_at?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          source?: string | null
          status?: string
          stream_message_id?: string | null
          subject?: string
          template_type?: string | null
          to_email?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          active: boolean | null
          body_template: string
          created_at: string | null
          id: string
          name: string
          subject_template: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          active?: boolean | null
          body_template: string
          created_at?: string | null
          id?: string
          name: string
          subject_template: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          active?: boolean | null
          body_template?: string
          created_at?: string | null
          id?: string
          name?: string
          subject_template?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      emission_factors: {
        Row: {
          category: string | null
          country: string | null
          created_at: string | null
          data_source: string | null
          id: string
          kg_co2e_per_kg: number
          kg_co2e_per_m3: number | null
          material: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          kg_co2e_per_kg: number
          kg_co2e_per_m3?: number | null
          material: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          kg_co2e_per_kg?: number
          kg_co2e_per_m3?: number | null
          material?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      erp_integrations: {
        Row: {
          config: Json
          created_at: string
          error_message: string | null
          field_mappings: Json
          id: string
          last_sync_at: string | null
          organization_id: string
          provider: string
          status: string
          sync_settings: Json
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          error_message?: string | null
          field_mappings?: Json
          id?: string
          last_sync_at?: string | null
          organization_id: string
          provider: string
          status?: string
          sync_settings?: Json
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          error_message?: string | null
          field_mappings?: Json
          id?: string
          last_sync_at?: string | null
          organization_id?: string
          provider?: string
          status?: string
          sync_settings?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_integrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_sync_operations: {
        Row: {
          completed_at: string | null
          direction: string
          entity_type: string
          error_messages: string[] | null
          id: string
          metadata: Json | null
          organization_id: string
          provider: string
          records_failed: number
          records_processed: number
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          direction: string
          entity_type: string
          error_messages?: string[] | null
          id?: string
          metadata?: Json | null
          organization_id: string
          provider: string
          records_failed?: number
          records_processed?: number
          started_at?: string
          status: string
        }
        Update: {
          completed_at?: string | null
          direction?: string
          entity_type?: string
          error_messages?: string[] | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          provider?: string
          records_failed?: number
          records_processed?: number
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_sync_operations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_webhook_events: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          error: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean
          processed_at: string | null
          provider: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          error?: string | null
          event_type: string
          id: string
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          provider: string
          timestamp: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          provider?: string
          timestamp?: string
        }
        Relationships: []
      }
      esrs_data_points: {
        Row: {
          category: string
          created_at: string
          data_provided: boolean
          data_value: Json | null
          disclosure_id: string
          disclosure_name: string
          esrs_standard: string
          evidence_url: string | null
          id: string
          is_mandatory: boolean
          last_updated_by: string | null
          notes: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          data_provided?: boolean
          data_value?: Json | null
          disclosure_id: string
          disclosure_name: string
          esrs_standard: string
          evidence_url?: string | null
          id?: string
          is_mandatory?: boolean
          last_updated_by?: string | null
          notes?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          data_provided?: boolean
          data_value?: Json | null
          disclosure_id?: string
          disclosure_name?: string
          esrs_standard?: string
          evidence_url?: string | null
          id?: string
          is_mandatory?: boolean
          last_updated_by?: string | null
          notes?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esrs_data_points_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "compliance_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      finnish_holidays: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_public_holiday: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_public_holiday?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_public_holiday?: boolean | null
          name?: string
        }
        Relationships: []
      }
      firehorse_events: {
        Row: {
          agent_confidence: number | null
          agent_cost_cents: number | null
          agent_feedback: string | null
          agent_feedback_timestamp: string | null
          agent_feedback_user_id: string | null
          agent_id: string | null
          agent_metadata: Json | null
          agent_model: string | null
          agent_priority_score: number | null
          agent_processing_time_ms: number | null
          agent_recommendation: string | null
          agent_signal: string | null
          agent_timestamp: string | null
          agent_tokens: number | null
          agent_version: string | null
          approval_required: boolean | null
          approved_at: string | null
          approved_by: string | null
          body: string | null
          channel: string | null
          clicked_at: string | null
          created_at: string | null
          cta: string | null
          event_confidence: number | null
          event_cost_cents: number | null
          event_data: Json | null
          event_model: string | null
          event_processing_time_ms: number | null
          event_source: string | null
          event_tokens: number | null
          event_type: Database["public"]["Enums"]["event_type"]
          event_version: string | null
          id: string
          lead_id: string
          metadata: Json | null
          opened_at: string | null
          rejection_reason: string | null
          replied_at: string | null
          scheduled_at: string | null
          sent_at: string | null
          sequence_type: string | null
          status: string | null
          subject_line: string | null
          subject_line_variant: string | null
          touch_number: number | null
        }
        Insert: {
          agent_confidence?: number | null
          agent_cost_cents?: number | null
          agent_feedback?: string | null
          agent_feedback_timestamp?: string | null
          agent_feedback_user_id?: string | null
          agent_id?: string | null
          agent_metadata?: Json | null
          agent_model?: string | null
          agent_priority_score?: number | null
          agent_processing_time_ms?: number | null
          agent_recommendation?: string | null
          agent_signal?: string | null
          agent_timestamp?: string | null
          agent_tokens?: number | null
          agent_version?: string | null
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          body?: string | null
          channel?: string | null
          clicked_at?: string | null
          created_at?: string | null
          cta?: string | null
          event_confidence?: number | null
          event_cost_cents?: number | null
          event_data?: Json | null
          event_model?: string | null
          event_processing_time_ms?: number | null
          event_source?: string | null
          event_tokens?: number | null
          event_type: Database["public"]["Enums"]["event_type"]
          event_version?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          opened_at?: string | null
          rejection_reason?: string | null
          replied_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          sequence_type?: string | null
          status?: string | null
          subject_line?: string | null
          subject_line_variant?: string | null
          touch_number?: number | null
        }
        Update: {
          agent_confidence?: number | null
          agent_cost_cents?: number | null
          agent_feedback?: string | null
          agent_feedback_timestamp?: string | null
          agent_feedback_user_id?: string | null
          agent_id?: string | null
          agent_metadata?: Json | null
          agent_model?: string | null
          agent_priority_score?: number | null
          agent_processing_time_ms?: number | null
          agent_recommendation?: string | null
          agent_signal?: string | null
          agent_timestamp?: string | null
          agent_tokens?: number | null
          agent_version?: string | null
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          body?: string | null
          channel?: string | null
          clicked_at?: string | null
          created_at?: string | null
          cta?: string | null
          event_confidence?: number | null
          event_cost_cents?: number | null
          event_data?: Json | null
          event_model?: string | null
          event_processing_time_ms?: number | null
          event_source?: string | null
          event_tokens?: number | null
          event_type?: Database["public"]["Enums"]["event_type"]
          event_version?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          opened_at?: string | null
          rejection_reason?: string | null
          replied_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          sequence_type?: string | null
          status?: string | null
          subject_line?: string | null
          subject_line_variant?: string | null
          touch_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_active_proposals"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold2_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold3_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_daily_new_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_linkedin_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_sales_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_upcoming_meetings"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_high_priority_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      firehorse_leads: {
        Row: {
          agent_confidence: number | null
          agent_cost_cents: number | null
          agent_feedback: string | null
          agent_feedback_timestamp: string | null
          agent_feedback_user_id: string | null
          agent_id: string | null
          agent_metadata: Json | null
          agent_model: string | null
          agent_priority_score: number | null
          agent_processing_time_ms: number | null
          agent_recommendation: string | null
          agent_signal: string | null
          agent_timestamp: string | null
          agent_tokens: number | null
          agent_version: string | null
          cold_1_sent_at: string | null
          cold_2_sent_at: string | null
          cold_3_sent_at: string | null
          company: string | null
          confidence_score: number | null
          country: Database["public"]["Enums"]["lead_country"]
          created_at: string | null
          email: string
          employee_count: number | null
          enriched_at: string | null
          enrichment_data: Json | null
          first_name: string | null
          headquarters: string | null
          icp_breakdown: Json | null
          icp_score: number | null
          id: string
          industry: string | null
          last_engagement_at: string | null
          last_enriched_by: string | null
          last_name: string | null
          linkedin_accepted_at: string | null
          linkedin_connection_status:
            | Database["public"]["Enums"]["linkedin_connection_status"]
            | null
          linkedin_note_text: string | null
          linkedin_request_sent_at: string | null
          linkedin_url: string | null
          priority: string | null
          recent_news: Json | null
          revenue_eur: number | null
          revenue_eur_million: number | null
          segment: string | null
          state: Database["public"]["Enums"]["lead_state"]
          tech_stack: Json | null
          title: string | null
          trigger_events: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_confidence?: number | null
          agent_cost_cents?: number | null
          agent_feedback?: string | null
          agent_feedback_timestamp?: string | null
          agent_feedback_user_id?: string | null
          agent_id?: string | null
          agent_metadata?: Json | null
          agent_model?: string | null
          agent_priority_score?: number | null
          agent_processing_time_ms?: number | null
          agent_recommendation?: string | null
          agent_signal?: string | null
          agent_timestamp?: string | null
          agent_tokens?: number | null
          agent_version?: string | null
          cold_1_sent_at?: string | null
          cold_2_sent_at?: string | null
          cold_3_sent_at?: string | null
          company?: string | null
          confidence_score?: number | null
          country: Database["public"]["Enums"]["lead_country"]
          created_at?: string | null
          email: string
          employee_count?: number | null
          enriched_at?: string | null
          enrichment_data?: Json | null
          first_name?: string | null
          headquarters?: string | null
          icp_breakdown?: Json | null
          icp_score?: number | null
          id?: string
          industry?: string | null
          last_engagement_at?: string | null
          last_enriched_by?: string | null
          last_name?: string | null
          linkedin_accepted_at?: string | null
          linkedin_connection_status?:
            | Database["public"]["Enums"]["linkedin_connection_status"]
            | null
          linkedin_note_text?: string | null
          linkedin_request_sent_at?: string | null
          linkedin_url?: string | null
          priority?: string | null
          recent_news?: Json | null
          revenue_eur?: number | null
          revenue_eur_million?: number | null
          segment?: string | null
          state?: Database["public"]["Enums"]["lead_state"]
          tech_stack?: Json | null
          title?: string | null
          trigger_events?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_confidence?: number | null
          agent_cost_cents?: number | null
          agent_feedback?: string | null
          agent_feedback_timestamp?: string | null
          agent_feedback_user_id?: string | null
          agent_id?: string | null
          agent_metadata?: Json | null
          agent_model?: string | null
          agent_priority_score?: number | null
          agent_processing_time_ms?: number | null
          agent_recommendation?: string | null
          agent_signal?: string | null
          agent_timestamp?: string | null
          agent_tokens?: number | null
          agent_version?: string | null
          cold_1_sent_at?: string | null
          cold_2_sent_at?: string | null
          cold_3_sent_at?: string | null
          company?: string | null
          confidence_score?: number | null
          country?: Database["public"]["Enums"]["lead_country"]
          created_at?: string | null
          email?: string
          employee_count?: number | null
          enriched_at?: string | null
          enrichment_data?: Json | null
          first_name?: string | null
          headquarters?: string | null
          icp_breakdown?: Json | null
          icp_score?: number | null
          id?: string
          industry?: string | null
          last_engagement_at?: string | null
          last_enriched_by?: string | null
          last_name?: string | null
          linkedin_accepted_at?: string | null
          linkedin_connection_status?:
            | Database["public"]["Enums"]["linkedin_connection_status"]
            | null
          linkedin_note_text?: string | null
          linkedin_request_sent_at?: string | null
          linkedin_url?: string | null
          priority?: string | null
          recent_news?: Json | null
          revenue_eur?: number | null
          revenue_eur_million?: number | null
          segment?: string | null
          state?: Database["public"]["Enums"]["lead_state"]
          tech_stack?: Json | null
          title?: string | null
          trigger_events?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      firehorse_linkedin_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          lead_id: string
          linkedin_url: string | null
          message_text: string | null
          note_text: string | null
          performed_by: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          lead_id: string
          linkedin_url?: string | null
          message_text?: string | null
          note_text?: string | null
          performed_by?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          lead_id?: string
          linkedin_url?: string | null
          message_text?: string | null
          note_text?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_active_proposals"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold2_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold3_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_daily_new_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_linkedin_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_sales_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_upcoming_meetings"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_linkedin_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_high_priority_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      firehorse_meetings: {
        Row: {
          attendees: Json | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          lead_id: string
          location: string | null
          meeting_type: string | null
          next_steps: string | null
          outcome_notes: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["meeting_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attendees?: Json | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lead_id: string
          location?: string | null
          meeting_type?: string | null
          next_steps?: string | null
          outcome_notes?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["meeting_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attendees?: Json | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lead_id?: string
          location?: string | null
          meeting_type?: string | null
          next_steps?: string | null
          outcome_notes?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["meeting_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_active_proposals"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold2_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold3_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_daily_new_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_linkedin_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_sales_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_upcoming_meetings"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_high_priority_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      firehorse_memory: {
        Row: {
          archived_at: string | null
          body: string
          created_at: string
          id: string
          source: string
          source_proposal_path: string | null
          source_session_id: string | null
          title: string
          topic: string
          version: number
        }
        Insert: {
          archived_at?: string | null
          body: string
          created_at?: string
          id?: string
          source?: string
          source_proposal_path?: string | null
          source_session_id?: string | null
          title: string
          topic: string
          version?: number
        }
        Update: {
          archived_at?: string | null
          body?: string
          created_at?: string
          id?: string
          source?: string
          source_proposal_path?: string | null
          source_session_id?: string | null
          title?: string
          topic?: string
          version?: number
        }
        Relationships: []
      }
      firehorse_proposals: {
        Row: {
          accepted_at: string | null
          amount_eur: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          document_url: string | null
          id: string
          lead_id: string
          notes: string | null
          pilot_duration_months: number | null
          rejected_at: string | null
          rejection_reason: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["proposal_status"] | null
          title: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          accepted_at?: string | null
          amount_eur?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          document_url?: string | null
          id?: string
          lead_id: string
          notes?: string | null
          pilot_duration_months?: number | null
          rejected_at?: string | null
          rejection_reason?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          title: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          accepted_at?: string | null
          amount_eur?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          document_url?: string | null
          id?: string
          lead_id?: string
          notes?: string | null
          pilot_duration_months?: number | null
          rejected_at?: string | null
          rejection_reason?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          title?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_active_proposals"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold2_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold3_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_daily_new_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_linkedin_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_sales_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_upcoming_meetings"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_high_priority_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      firehorse_replies: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          intent: Database["public"]["Enums"]["reply_intent"] | null
          lead_id: string
          reply_text: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          intent?: Database["public"]["Enums"]["reply_intent"] | null
          lead_id: string
          reply_text: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          intent?: Database["public"]["Enums"]["reply_intent"] | null
          lead_id?: string
          reply_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_active_proposals"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold2_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold3_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_daily_new_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_linkedin_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_sales_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_upcoming_meetings"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_replies_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_high_priority_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      firehorse_signals: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_linkedin_url: string | null
          contact_name: string | null
          contact_title: string | null
          correlation_reason: string | null
          correlation_score: number | null
          created_at: string
          dws6_feature_match: string[] | null
          id: string
          keywords_matched: string[] | null
          message_draft: string | null
          message_final: string | null
          message_sent_at: string | null
          response_content: string | null
          response_received_at: string | null
          signal_content: string
          signal_date: string
          signal_metadata: Json | null
          signal_source: Database["public"]["Enums"]["signal_source"]
          signal_type: Database["public"]["Enums"]["signal_type"]
          signal_url: string | null
          status: Database["public"]["Enums"]["signal_status"]
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_linkedin_url?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string
          dws6_feature_match?: string[] | null
          id?: string
          keywords_matched?: string[] | null
          message_draft?: string | null
          message_final?: string | null
          message_sent_at?: string | null
          response_content?: string | null
          response_received_at?: string | null
          signal_content: string
          signal_date: string
          signal_metadata?: Json | null
          signal_source: Database["public"]["Enums"]["signal_source"]
          signal_type: Database["public"]["Enums"]["signal_type"]
          signal_url?: string | null
          status?: Database["public"]["Enums"]["signal_status"]
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_linkedin_url?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string
          dws6_feature_match?: string[] | null
          id?: string
          keywords_matched?: string[] | null
          message_draft?: string | null
          message_final?: string | null
          message_sent_at?: string | null
          response_content?: string | null
          response_received_at?: string | null
          signal_content?: string
          signal_date?: string
          signal_metadata?: Json | null
          signal_source?: Database["public"]["Enums"]["signal_source"]
          signal_type?: Database["public"]["Enums"]["signal_type"]
          signal_url?: string | null
          status?: Database["public"]["Enums"]["signal_status"]
          updated_at?: string
        }
        Relationships: []
      }
      firehorse_tasks: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          lead_id: string
          owner: string
          task_type: Database["public"]["Enums"]["task_type"]
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id: string
          owner: string
          task_type: Database["public"]["Enums"]["task_type"]
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string
          owner?: string
          task_type?: Database["public"]["Enums"]["task_type"]
        }
        Relationships: [
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_active_proposals"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold2_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_cold3_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_daily_new_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_linkedin_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_sales_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "firehorse_upcoming_meetings"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "firehorse_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_high_priority_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      firehorse_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          language: string | null
          name: string
          subject: string
          template_type: Database["public"]["Enums"]["template_type"] | null
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id: string
          language?: string | null
          name: string
          subject: string
          template_type?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          language?: string | null
          name?: string
          subject?: string
          template_type?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      grok_consent: {
        Row: {
          consent_version: string
          consented: boolean
          created_at: string
          id: string
          ip_address: unknown
          org_id: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_version?: string
          consented?: boolean
          created_at?: string
          id?: string
          ip_address?: unknown
          org_id?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_version?: string
          consented?: boolean
          created_at?: string
          id?: string
          ip_address?: unknown
          org_id?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      grok_consent_audit: {
        Row: {
          action: string
          actor_role: string | null
          consent_id: string | null
          consent_version: string
          consented: boolean
          created_at: string
          id: string
          ip_address: unknown
          org_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          actor_role?: string | null
          consent_id?: string | null
          consent_version: string
          consented: boolean
          created_at?: string
          id?: string
          ip_address?: unknown
          org_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          actor_role?: string | null
          consent_id?: string | null
          consent_version?: string
          consented?: boolean
          created_at?: string
          id?: string
          ip_address?: unknown
          org_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grok_consent_audit_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "grok_consent"
            referencedColumns: ["id"]
          },
        ]
      }
      grok_inference_log: {
        Row: {
          completion_tokens: number | null
          consent_id: string | null
          created_at: string
          error_message: string | null
          id: string
          latency_ms: number | null
          model: string
          org_id: string | null
          prompt_tokens: number | null
          status: string
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          completion_tokens?: number | null
          consent_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          model: string
          org_id?: string | null
          prompt_tokens?: number | null
          status: string
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          completion_tokens?: number | null
          consent_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          model?: string
          org_id?: string | null
          prompt_tokens?: number | null
          status?: string
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grok_inference_log_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "grok_consent"
            referencedColumns: ["id"]
          },
        ]
      }
      hil_escalations: {
        Row: {
          agent_name: string
          channel: string
          confidence: number | null
          context: Json | null
          created_at: string
          id: string
          reason: string
          recipient: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          agent_name: string
          channel?: string
          confidence?: number | null
          context?: Json | null
          created_at?: string
          id?: string
          reason: string
          recipient: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          agent_name?: string
          channel?: string
          confidence?: number | null
          context?: Json | null
          created_at?: string
          id?: string
          reason?: string
          recipient?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: []
      }
      inbound_emails: {
        Row: {
          command_line: string | null
          error: string | null
          from_email: string | null
          id: string
          parse_ok: boolean | null
          provider: string
          provider_message_id: string
          raw_payload: Json
          received_at: string | null
          subject: string | null
          thread_token: string | null
        }
        Insert: {
          command_line?: string | null
          error?: string | null
          from_email?: string | null
          id?: string
          parse_ok?: boolean | null
          provider?: string
          provider_message_id: string
          raw_payload: Json
          received_at?: string | null
          subject?: string | null
          thread_token?: string | null
        }
        Update: {
          command_line?: string | null
          error?: string | null
          from_email?: string | null
          id?: string
          parse_ok?: boolean | null
          provider?: string
          provider_message_id?: string
          raw_payload?: Json
          received_at?: string | null
          subject?: string | null
          thread_token?: string | null
        }
        Relationships: []
      }
      kya_mandate_events: {
        Row: {
          amount: number | null
          article12_trace_id: string | null
          ats_permission_level: string | null
          created_at: string
          currency: string | null
          decision_reason: string | null
          event_hash: string
          event_type: string
          firehorse_event_id: string | null
          gate_decision: string
          hic: string
          human_present: boolean | null
          id: string
          kya_score_at_sign: number | null
          kya_violation: boolean
          mandate_type: string
          mandate_vc_id: string
          merchant_category: string | null
          org_id: string | null
          prev_hash: string
          protocol: string
          requires_human_confirmation: boolean
          session_id: string
          subagent_id: string
          tenant_gating_profile_id: string | null
        }
        Insert: {
          amount?: number | null
          article12_trace_id?: string | null
          ats_permission_level?: string | null
          created_at?: string
          currency?: string | null
          decision_reason?: string | null
          event_hash: string
          event_type: string
          firehorse_event_id?: string | null
          gate_decision: string
          hic: string
          human_present?: boolean | null
          id?: string
          kya_score_at_sign?: number | null
          kya_violation?: boolean
          mandate_type: string
          mandate_vc_id: string
          merchant_category?: string | null
          org_id?: string | null
          prev_hash: string
          protocol: string
          requires_human_confirmation?: boolean
          session_id: string
          subagent_id: string
          tenant_gating_profile_id?: string | null
        }
        Update: {
          amount?: number | null
          article12_trace_id?: string | null
          ats_permission_level?: string | null
          created_at?: string
          currency?: string | null
          decision_reason?: string | null
          event_hash?: string
          event_type?: string
          firehorse_event_id?: string | null
          gate_decision?: string
          hic?: string
          human_present?: boolean | null
          id?: string
          kya_score_at_sign?: number | null
          kya_violation?: boolean
          mandate_type?: string
          mandate_vc_id?: string
          merchant_category?: string | null
          org_id?: string | null
          prev_hash?: string
          protocol?: string
          requires_human_confirmation?: boolean
          session_id?: string
          subagent_id?: string
          tenant_gating_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kya_mandate_events_tenant_gating_profile_id_fkey"
            columns: ["tenant_gating_profile_id"]
            isOneToOne: false
            referencedRelation: "kya_tenant_gating_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kya_tenant_gating_profiles: {
        Row: {
          confirm_above: number | null
          created_at: string
          effective_from: string
          hnp_enabled: boolean
          hnp_min_ats: number
          id: string
          industry_default: string | null
          profile_version: string
          signed_by_hic: string
          superseded_at: string | null
          superseded_by: string | null
          tenant_id: string
        }
        Insert: {
          confirm_above?: number | null
          created_at?: string
          effective_from?: string
          hnp_enabled?: boolean
          hnp_min_ats: number
          id?: string
          industry_default?: string | null
          profile_version: string
          signed_by_hic: string
          superseded_at?: string | null
          superseded_by?: string | null
          tenant_id: string
        }
        Update: {
          confirm_above?: number | null
          created_at?: string
          effective_from?: string
          hnp_enabled?: boolean
          hnp_min_ats?: number
          id?: string
          industry_default?: string | null
          profile_version?: string
          signed_by_hic?: string
          superseded_at?: string | null
          superseded_by?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kya_tenant_gating_profiles_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "kya_tenant_gating_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kya_verified_done_attestations: {
        Row: {
          amount: number | null
          article12_trace_id: string | null
          ats_at_execution: number | null
          created_at: string
          credential: Json
          currency: string | null
          hic: string
          id: string
          issuer: string
          kya_verified: boolean
          mandate_type: string
          mandate_vc_id: string
          proof_status: string
          protocol: string
          session_id: string
          subagent_id: string
          valid_from: string
        }
        Insert: {
          amount?: number | null
          article12_trace_id?: string | null
          ats_at_execution?: number | null
          created_at?: string
          credential: Json
          currency?: string | null
          hic: string
          id?: string
          issuer: string
          kya_verified?: boolean
          mandate_type: string
          mandate_vc_id: string
          proof_status?: string
          protocol: string
          session_id: string
          subagent_id: string
          valid_from: string
        }
        Update: {
          amount?: number | null
          article12_trace_id?: string | null
          ats_at_execution?: number | null
          created_at?: string
          credential?: Json
          currency?: string | null
          hic?: string
          id?: string
          issuer?: string
          kya_verified?: boolean
          mandate_type?: string
          mandate_vc_id?: string
          proof_status?: string
          protocol?: string
          session_id?: string
          subagent_id?: string
          valid_from?: string
        }
        Relationships: []
      }
      mcp_migration_queue: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          author_branch: string
          author_tool: string
          created_at: string
          filename: string
          id: string
          migration_number: number
          notes: string | null
          sql: string
          status: string
          supabase_applied: boolean | null
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          author_branch: string
          author_tool: string
          created_at?: string
          filename: string
          id?: string
          migration_number: number
          notes?: string | null
          sql: string
          status?: string
          supabase_applied?: boolean | null
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          author_branch?: string
          author_tool?: string
          created_at?: string
          filename?: string
          id?: string
          migration_number?: number
          notes?: string | null
          sql?: string
          status?: string
          supabase_applied?: boolean | null
        }
        Relationships: []
      }
      mcp_sessions: {
        Row: {
          branch: string
          checkpoint: Json | null
          closed_at: string | null
          created_at: string
          id: string
          summary: string | null
          tool: string
        }
        Insert: {
          branch: string
          checkpoint?: Json | null
          closed_at?: string | null
          created_at?: string
          id?: string
          summary?: string | null
          tool: string
        }
        Update: {
          branch?: string
          checkpoint?: Json | null
          closed_at?: string | null
          created_at?: string
          id?: string
          summary?: string | null
          tool?: string
        }
        Relationships: []
      }
      memory_audit_log: {
        Row: {
          agent_ats: number | null
          agent_id: string
          created_at: string
          customer_id: string | null
          id: string
          memory_id: string | null
          metadata: Json | null
          old_memory_id: string | null
          operation: string
          org_id: string
          reason: string | null
        }
        Insert: {
          agent_ats?: number | null
          agent_id: string
          created_at?: string
          customer_id?: string | null
          id?: string
          memory_id?: string | null
          metadata?: Json | null
          old_memory_id?: string | null
          operation: string
          org_id: string
          reason?: string | null
        }
        Update: {
          agent_ats?: number | null
          agent_id?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          memory_id?: string | null
          metadata?: Json | null
          old_memory_id?: string | null
          operation?: string
          org_id?: string
          reason?: string | null
        }
        Relationships: []
      }
      memory_audit_log_archive: {
        Row: {
          agent_ats: number | null
          agent_id: string
          created_at: string
          customer_id: string | null
          id: string
          memory_id: string | null
          metadata: Json | null
          old_memory_id: string | null
          operation: string
          org_id: string
          reason: string | null
        }
        Insert: {
          agent_ats?: number | null
          agent_id: string
          created_at?: string
          customer_id?: string | null
          id?: string
          memory_id?: string | null
          metadata?: Json | null
          old_memory_id?: string | null
          operation: string
          org_id: string
          reason?: string | null
        }
        Update: {
          agent_ats?: number | null
          agent_id?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          memory_id?: string | null
          metadata?: Json | null
          old_memory_id?: string | null
          operation?: string
          org_id?: string
          reason?: string | null
        }
        Relationships: []
      }
      mfa_backup_codes: {
        Row: {
          code_hash: string
          created_at: string | null
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string | null
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string | null
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_backup_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          agent_completions: boolean
          carbon_thresholds: boolean
          compliance_deadlines: boolean
          created_at: string
          email_alerts: boolean
          report_ready: boolean
          updated_at: string
          user_id: string
          weekly_digest: boolean
        }
        Insert: {
          agent_completions?: boolean
          carbon_thresholds?: boolean
          compliance_deadlines?: boolean
          created_at?: string
          email_alerts?: boolean
          report_ready?: boolean
          updated_at?: string
          user_id: string
          weekly_digest?: boolean
        }
        Update: {
          agent_completions?: boolean
          carbon_thresholds?: boolean
          compliance_deadlines?: boolean
          created_at?: string
          email_alerts?: boolean
          report_ready?: boolean
          updated_at?: string
          user_id?: string
          weekly_digest?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          metadata: Json
          read: boolean
          read_at: string | null
          severity: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          read?: boolean
          read_at?: string | null
          severity?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          read?: boolean
          read_at?: string | null
          severity?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ontology_enterprises: {
        Row: {
          created_at: string
          csrd_reporting: boolean | null
          employees: number | null
          eu_countries: string[]
          hq_country: string | null
          id: string
          industry_id: number
          name: string
          notes: string | null
          regulatory_exposure: string[]
          revenue_eur_m: number | null
          source: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          csrd_reporting?: boolean | null
          employees?: number | null
          eu_countries?: string[]
          hq_country?: string | null
          id?: string
          industry_id: number
          name: string
          notes?: string | null
          regulatory_exposure?: string[]
          revenue_eur_m?: number | null
          source?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          csrd_reporting?: boolean | null
          employees?: number | null
          eu_countries?: string[]
          hq_country?: string | null
          id?: string
          industry_id?: number
          name?: string
          notes?: string | null
          regulatory_exposure?: string[]
          revenue_eur_m?: number | null
          source?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ontology_enterprises_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "ontology_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      ontology_industries: {
        Row: {
          created_at: string
          id: number
          name: string
          seeded_count: number
          slug: string
          target_count: number
        }
        Insert: {
          created_at?: string
          id: number
          name: string
          seeded_count?: number
          slug: string
          target_count?: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          seeded_count?: number
          slug?: string
          target_count?: number
        }
        Relationships: []
      }
      opencode_sessions: {
        Row: {
          attempts: number | null
          baseline_commit: string | null
          branch: string | null
          created_at: string | null
          failure_code: string | null
          failure_detail: Json | null
          handoff_path: string | null
          id: string
          idempotency_key: string | null
          last_run: string | null
          legacy: boolean | null
          max_attempts: number | null
          reconciled_at: string | null
          source: string
          state: string
          status: string
          stop_reason: string | null
          title: string
          validation: Json | null
          worktree_path: string | null
          worktree_resumed: boolean | null
          worktree_state: string | null
        }
        Insert: {
          attempts?: number | null
          baseline_commit?: string | null
          branch?: string | null
          created_at?: string | null
          failure_code?: string | null
          failure_detail?: Json | null
          handoff_path?: string | null
          id: string
          idempotency_key?: string | null
          last_run?: string | null
          legacy?: boolean | null
          max_attempts?: number | null
          reconciled_at?: string | null
          source?: string
          state: string
          status?: string
          stop_reason?: string | null
          title: string
          validation?: Json | null
          worktree_path?: string | null
          worktree_resumed?: boolean | null
          worktree_state?: string | null
        }
        Update: {
          attempts?: number | null
          baseline_commit?: string | null
          branch?: string | null
          created_at?: string | null
          failure_code?: string | null
          failure_detail?: Json | null
          handoff_path?: string | null
          id?: string
          idempotency_key?: string | null
          last_run?: string | null
          legacy?: boolean | null
          max_attempts?: number | null
          reconciled_at?: string | null
          source?: string
          state?: string
          status?: string
          stop_reason?: string | null
          title?: string
          validation?: Json | null
          worktree_path?: string | null
          worktree_resumed?: boolean | null
          worktree_state?: string | null
        }
        Relationships: []
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          permissions: Json | null
          role: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_email: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          plan_expires_at: string | null
          plan_tier: string | null
          settings: Json | null
          slug: string
          status: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          plan_expires_at?: string | null
          plan_tier?: string | null
          settings?: Json | null
          slug: string
          status?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          plan_expires_at?: string | null
          plan_tier?: string | null
          settings?: Json | null
          slug?: string
          status?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_activities: {
        Row: {
          activity_type: string
          channel: string
          created_at: string
          created_by: string
          description: string
          id: string
          metadata: Json | null
          next_followup_at: string | null
          org_id: string | null
          outcome: Database["public"]["Enums"]["activity_outcome"] | null
          person_id: string
          pipeline: Database["public"]["Enums"]["outreach_pipeline"]
          raw_payload: Json | null
          source: Database["public"]["Enums"]["outreach_source"]
          thread_id: string
        }
        Insert: {
          activity_type: string
          channel: string
          created_at?: string
          created_by?: string
          description: string
          id?: string
          metadata?: Json | null
          next_followup_at?: string | null
          org_id?: string | null
          outcome?: Database["public"]["Enums"]["activity_outcome"] | null
          person_id: string
          pipeline: Database["public"]["Enums"]["outreach_pipeline"]
          raw_payload?: Json | null
          source?: Database["public"]["Enums"]["outreach_source"]
          thread_id: string
        }
        Update: {
          activity_type?: string
          channel?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          metadata?: Json | null
          next_followup_at?: string | null
          org_id?: string | null
          outcome?: Database["public"]["Enums"]["activity_outcome"] | null
          person_id?: string
          pipeline?: Database["public"]["Enums"]["outreach_pipeline"]
          raw_payload?: Json | null
          source?: Database["public"]["Enums"]["outreach_source"]
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_activities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_activities_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_activities_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "outreach_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_activities_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "v_outreach_due_today"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_activities_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "v_outreach_enriched"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_daily_tasks: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          context: string | null
          created_at: string
          created_by: string
          id: string
          org_id: string | null
          person_id: string | null
          pipeline: Database["public"]["Enums"]["outreach_pipeline"]
          task_date: string
          task_description: string
          thread_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          context?: string | null
          created_at?: string
          created_by?: string
          id?: string
          org_id?: string | null
          person_id?: string | null
          pipeline: Database["public"]["Enums"]["outreach_pipeline"]
          task_date?: string
          task_description: string
          thread_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          context?: string | null
          created_at?: string
          created_by?: string
          id?: string
          org_id?: string | null
          person_id?: string | null
          pipeline?: Database["public"]["Enums"]["outreach_pipeline"]
          task_date?: string
          task_description?: string
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_daily_tasks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_daily_tasks_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_daily_tasks_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "outreach_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_daily_tasks_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "v_outreach_due_today"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_daily_tasks_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "v_outreach_enriched"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_orgs: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          domain: string
          id: string
          industry: string | null
          linkedin_url: string | null
          location: string | null
          name: string
          prospect_status: string
          size: string | null
          source: Database["public"]["Enums"]["outreach_source"]
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          domain: string
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          name: string
          prospect_status?: string
          size?: string | null
          source?: Database["public"]["Enums"]["outreach_source"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          domain?: string
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          prospect_status?: string
          size?: string | null
          source?: Database["public"]["Enums"]["outreach_source"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      outreach_threads: {
        Row: {
          boardy_notes: string | null
          check_size: string | null
          created_at: string
          created_by: string
          customer_segment: string | null
          id: string
          investor_type: string | null
          last_contacted_at: string | null
          last_outbound_at: string | null
          last_response_at: string | null
          meetings_count: number | null
          next_action: string | null
          next_action_date: string | null
          next_action_type: string | null
          nudge_count: number | null
          org_id: string | null
          our_angle: string | null
          partnership_type: string | null
          person_id: string
          pipeline: Database["public"]["Enums"]["outreach_pipeline"]
          priority: Database["public"]["Enums"]["outreach_priority"]
          source: Database["public"]["Enums"]["outreach_source"]
          status: Database["public"]["Enums"]["outreach_status"]
          their_angle: string | null
          thread_token: string
          updated_at: string
          waiting_since: string | null
        }
        Insert: {
          boardy_notes?: string | null
          check_size?: string | null
          created_at?: string
          created_by?: string
          customer_segment?: string | null
          id?: string
          investor_type?: string | null
          last_contacted_at?: string | null
          last_outbound_at?: string | null
          last_response_at?: string | null
          meetings_count?: number | null
          next_action?: string | null
          next_action_date?: string | null
          next_action_type?: string | null
          nudge_count?: number | null
          org_id?: string | null
          our_angle?: string | null
          partnership_type?: string | null
          person_id: string
          pipeline: Database["public"]["Enums"]["outreach_pipeline"]
          priority?: Database["public"]["Enums"]["outreach_priority"]
          source?: Database["public"]["Enums"]["outreach_source"]
          status?: Database["public"]["Enums"]["outreach_status"]
          their_angle?: string | null
          thread_token?: string
          updated_at?: string
          waiting_since?: string | null
        }
        Update: {
          boardy_notes?: string | null
          check_size?: string | null
          created_at?: string
          created_by?: string
          customer_segment?: string | null
          id?: string
          investor_type?: string | null
          last_contacted_at?: string | null
          last_outbound_at?: string | null
          last_response_at?: string | null
          meetings_count?: number | null
          next_action?: string | null
          next_action_date?: string | null
          next_action_type?: string | null
          nudge_count?: number | null
          org_id?: string | null
          our_angle?: string | null
          partnership_type?: string | null
          person_id?: string
          pipeline?: Database["public"]["Enums"]["outreach_pipeline"]
          priority?: Database["public"]["Enums"]["outreach_priority"]
          source?: Database["public"]["Enums"]["outreach_source"]
          status?: Database["public"]["Enums"]["outreach_status"]
          their_angle?: string | null
          thread_token?: string
          updated_at?: string
          waiting_since?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_threads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_threads_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      paid_endpoint_log: {
        Row: {
          calc_version: string | null
          confidence: number | null
          created_at: string
          endpoint: string
          fault_attr: string | null
          id: string
          input_hash: string
          key_id: string | null
          missing_evidence: string[] | null
          org_id: string | null
          price_eur: number
          request_id: string
          uses_defaults: boolean | null
          verdict: string | null
        }
        Insert: {
          calc_version?: string | null
          confidence?: number | null
          created_at?: string
          endpoint: string
          fault_attr?: string | null
          id?: string
          input_hash: string
          key_id?: string | null
          missing_evidence?: string[] | null
          org_id?: string | null
          price_eur?: number
          request_id: string
          uses_defaults?: boolean | null
          verdict?: string | null
        }
        Update: {
          calc_version?: string | null
          confidence?: number | null
          created_at?: string
          endpoint?: string
          fault_attr?: string | null
          id?: string
          input_hash?: string
          key_id?: string | null
          missing_evidence?: string[] | null
          org_id?: string | null
          price_eur?: number
          request_id?: string
          uses_defaults?: boolean | null
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paid_endpoint_log_key_id_fkey"
            columns: ["key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          event_type: string
          id: string
          provider: string
          provider_event_id: string | null
          raw_payload: Json | null
          subscription_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_type: string
          id?: string
          provider: string
          provider_event_id?: string | null
          raw_payload?: Json | null
          subscription_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_type?: string
          id?: string
          provider?: string
          provider_event_id?: string | null
          raw_payload?: Json | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscription_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions_expiring_soon"
            referencedColumns: ["id"]
          },
        ]
      }
      person_emails: {
        Row: {
          created_at: string
          created_by: string
          email: string
          id: string
          is_primary: boolean | null
          person_id: string
          source: Database["public"]["Enums"]["outreach_source"]
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          email: string
          id?: string
          is_primary?: boolean | null
          person_id: string
          source?: Database["public"]["Enums"]["outreach_source"]
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          created_by?: string
          email?: string
          id?: string
          is_primary?: boolean | null
          person_id?: string
          source?: Database["public"]["Enums"]["outreach_source"]
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "person_emails_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      persons: {
        Row: {
          created_at: string
          created_by: string
          first_name: string
          id: string
          last_name: string | null
          linkedin_url: string
          location: string | null
          org_id: string | null
          phone: string | null
          source: Database["public"]["Enums"]["outreach_source"]
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          first_name: string
          id?: string
          last_name?: string | null
          linkedin_url: string
          location?: string | null
          org_id?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["outreach_source"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          first_name?: string
          id?: string
          last_name?: string | null
          linkedin_url?: string
          location?: string | null
          org_id?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["outreach_source"]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "persons_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      playbook_downloads: {
        Row: {
          downloaded_at: string
          id: string
          industry_slug: string
          lead_id: string
          pdf_version: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          industry_slug: string
          lead_id: string
          pdf_version: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          industry_slug?: string
          lead_id?: string
          pdf_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "playbook_downloads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "playbook_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      playbook_leads: {
        Row: {
          attempts_remaining: number
          code_expires_at: string | null
          code_hash: string | null
          code_salt: string | null
          consent_marketing: boolean
          consent_text: string
          email: string
          id: string
          industry_slug: string
          ip: unknown
          is_waitlist: boolean
          language: string
          requested_at: string
          ua: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          verified_at: string | null
        }
        Insert: {
          attempts_remaining?: number
          code_expires_at?: string | null
          code_hash?: string | null
          code_salt?: string | null
          consent_marketing?: boolean
          consent_text: string
          email: string
          id?: string
          industry_slug: string
          ip?: unknown
          is_waitlist?: boolean
          language?: string
          requested_at?: string
          ua?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          verified_at?: string | null
        }
        Update: {
          attempts_remaining?: number
          code_expires_at?: string | null
          code_hash?: string | null
          code_salt?: string | null
          consent_marketing?: boolean
          consent_text?: string
          email?: string
          id?: string
          industry_slug?: string
          ip?: unknown
          is_waitlist?: boolean
          language?: string
          requested_at?: string
          ua?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      report_schedules: {
        Row: {
          company_name: string
          country: string
          created_at: string
          enabled: boolean
          format: Database["public"]["Enums"]["report_format"]
          frequency: Database["public"]["Enums"]["report_frequency"]
          id: string
          industry: string
          next_run_at: string
          recipient_email: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          country?: string
          created_at?: string
          enabled?: boolean
          format?: Database["public"]["Enums"]["report_format"]
          frequency: Database["public"]["Enums"]["report_frequency"]
          id?: string
          industry: string
          next_run_at: string
          recipient_email: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          country?: string
          created_at?: string
          enabled?: boolean
          format?: Database["public"]["Enums"]["report_format"]
          frequency?: Database["public"]["Enums"]["report_frequency"]
          id?: string
          industry?: string
          next_run_at?: string
          recipient_email?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue_recognition: {
        Row: {
          active_customers: number | null
          arr: number
          churn_rate: number | null
          churned_customers: number | null
          churned_mrr: number | null
          contraction_mrr: number | null
          created_at: string | null
          expansion_mrr: number | null
          id: string
          month: string
          mrr: number
          net_mrr_growth_rate: number | null
          new_customers: number | null
          new_mrr: number | null
          updated_at: string | null
        }
        Insert: {
          active_customers?: number | null
          arr?: number
          churn_rate?: number | null
          churned_customers?: number | null
          churned_mrr?: number | null
          contraction_mrr?: number | null
          created_at?: string | null
          expansion_mrr?: number | null
          id?: string
          month: string
          mrr?: number
          net_mrr_growth_rate?: number | null
          new_customers?: number | null
          new_mrr?: number | null
          updated_at?: string | null
        }
        Update: {
          active_customers?: number | null
          arr?: number
          churn_rate?: number | null
          churned_customers?: number | null
          churned_mrr?: number | null
          contraction_mrr?: number | null
          created_at?: string | null
          expansion_mrr?: number | null
          id?: string
          month?: string
          mrr?: number
          net_mrr_growth_rate?: number | null
          new_customers?: number | null
          new_mrr?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      runway_tracking: {
        Row: {
          cash_balance: number
          created_at: string | null
          id: string
          month: string
          monthly_expenses: number | null
          monthly_revenue: number | null
          net_burn: number | null
          notes: string | null
          runway_months: number | null
          updated_at: string | null
        }
        Insert: {
          cash_balance: number
          created_at?: string | null
          id?: string
          month: string
          monthly_expenses?: number | null
          monthly_revenue?: number | null
          net_burn?: number | null
          notes?: string | null
          runway_months?: number | null
          updated_at?: string | null
        }
        Update: {
          cash_balance?: number
          created_at?: string | null
          id?: string
          month?: string
          monthly_expenses?: number | null
          monthly_revenue?: number | null
          net_burn?: number | null
          notes?: string | null
          runway_months?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_checkpoints: {
        Row: {
          agent_name: string
          created_at: string | null
          expires_at: string | null
          id: string
          org_id: string
          session_id: string
          state: Json
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          org_id: string
          session_id: string
          state: Json
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          org_id?: string
          session_id?: string
          state?: Json
        }
        Relationships: []
      }
      situation_room_reports: {
        Row: {
          compliance_rag: string | null
          country: string | null
          created_at: string | null
          fit55_score: number | null
          id: string
          org_id: string | null
          payload: Json
          pipeline_workflow_id: string | null
          project_id: string
          report_type: string
          status: string | null
          title: string | null
          total_kg_co2e: number | null
          updated_at: string | null
        }
        Insert: {
          compliance_rag?: string | null
          country?: string | null
          created_at?: string | null
          fit55_score?: number | null
          id?: string
          org_id?: string | null
          payload?: Json
          pipeline_workflow_id?: string | null
          project_id: string
          report_type?: string
          status?: string | null
          title?: string | null
          total_kg_co2e?: number | null
          updated_at?: string | null
        }
        Update: {
          compliance_rag?: string | null
          country?: string | null
          created_at?: string | null
          fit55_score?: number | null
          id?: string
          org_id?: string | null
          payload?: Json
          pipeline_workflow_id?: string | null
          project_id?: string
          report_type?: string
          status?: string | null
          title?: string | null
          total_kg_co2e?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "situation_room_reports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_factory_campaigns: {
        Row: {
          booking_service_id: string | null
          catalog: Json
          channels: string[]
          created_at: string
          daily_cap: number
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          booking_service_id?: string | null
          catalog?: Json
          channels?: string[]
          created_at?: string
          daily_cap?: number
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          booking_service_id?: string | null
          catalog?: Json
          channels?: string[]
          created_at?: string
          daily_cap?: number
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      smart_factory_daily_send: {
        Row: {
          bucket_utc: string
          sent_count: number
          updated_at: string
        }
        Insert: {
          bucket_utc: string
          sent_count?: number
          updated_at?: string
        }
        Update: {
          bucket_utc?: string
          sent_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      smart_factory_messages: {
        Row: {
          body: string | null
          campaign_id: string
          channel: string
          created_at: string
          error: string | null
          id: string
          product_id: string | null
          prospect_id: string
          provider_message_id: string | null
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          body?: string | null
          campaign_id: string
          channel: string
          created_at?: string
          error?: string | null
          id?: string
          product_id?: string | null
          prospect_id: string
          provider_message_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          body?: string | null
          campaign_id?: string
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          product_id?: string | null
          prospect_id?: string
          provider_message_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_factory_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "smart_factory_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smart_factory_messages_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "smart_factory_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_factory_prospects: {
        Row: {
          campaign_id: string
          contact_name: string | null
          country_code: string | null
          created_at: string
          dedup_key: string
          domain: string | null
          email: string | null
          facebook_url: string | null
          fit_score: number
          id: string
          industry: string | null
          last_channel: string | null
          linkedin_url: string | null
          matched_products: Json
          org_name: string
          phone: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          contact_name?: string | null
          country_code?: string | null
          created_at?: string
          dedup_key: string
          domain?: string | null
          email?: string | null
          facebook_url?: string | null
          fit_score?: number
          id?: string
          industry?: string | null
          last_channel?: string | null
          linkedin_url?: string | null
          matched_products?: Json
          org_name: string
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          contact_name?: string | null
          country_code?: string | null
          created_at?: string
          dedup_key?: string
          domain?: string | null
          email?: string | null
          facebook_url?: string | null
          fit_score?: number
          id?: string
          industry?: string | null
          last_channel?: string | null
          linkedin_url?: string | null
          matched_products?: Json
          org_name?: string
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_factory_prospects_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "smart_factory_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          agent_calls_per_month: number
          created_at: string | null
          edge_devices: number
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          paypal_plan_id_annual: string | null
          paypal_plan_id_monthly: string | null
          price_annual_eur: number | null
          price_monthly_eur: number
          support_type: string | null
          tier: string
          updated_at: string | null
        }
        Insert: {
          agent_calls_per_month?: number
          created_at?: string | null
          edge_devices?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          paypal_plan_id_annual?: string | null
          paypal_plan_id_monthly?: string | null
          price_annual_eur?: number | null
          price_monthly_eur?: number
          support_type?: string | null
          tier: string
          updated_at?: string | null
        }
        Update: {
          agent_calls_per_month?: number
          created_at?: string | null
          edge_devices?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          paypal_plan_id_annual?: string | null
          paypal_plan_id_monthly?: string | null
          price_annual_eur?: number | null
          price_monthly_eur?: number
          support_type?: string | null
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["subscription_billing_cycle"]
          cancellation_reason: string | null
          cancelled_at: string | null
          contract_id: string | null
          created_at: string | null
          currency: string | null
          customer_id: string
          end_date: string | null
          id: string
          is_active: boolean | null
          monthly_amount: number
          next_billing_date: string | null
          payment_provider: string | null
          product_name: string
          provider_customer_id: string | null
          provider_subscription_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["subscription_billing_cycle"]
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_amount: number
          next_billing_date?: string | null
          payment_provider?: string | null
          product_name: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["subscription_billing_cycle"]
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_amount?: number
          next_billing_date?: string | null
          payment_provider?: string | null
          product_name?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_pending_signature"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "current_mrr_by_customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      ted_leads: {
        Row: {
          buyer_country: string | null
          buyer_name: string | null
          cpv: string | null
          created_at: string | null
          deadline_date: string | null
          dm_language: string | null
          dm_personalization: string | null
          erp_qualifier: string | null
          estimated_value: number | null
          followup_date: string | null
          id: string
          linkedin_contact: string | null
          linkedin_profile_url: string | null
          notes: string | null
          notice_type: string | null
          outreach_date: string | null
          outreach_status: string | null
          place_of_performance: string | null
          publication_date: string | null
          publication_number: string
          ted_url: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_country?: string | null
          buyer_name?: string | null
          cpv?: string | null
          created_at?: string | null
          deadline_date?: string | null
          dm_language?: string | null
          dm_personalization?: string | null
          erp_qualifier?: string | null
          estimated_value?: number | null
          followup_date?: string | null
          id?: string
          linkedin_contact?: string | null
          linkedin_profile_url?: string | null
          notes?: string | null
          notice_type?: string | null
          outreach_date?: string | null
          outreach_status?: string | null
          place_of_performance?: string | null
          publication_date?: string | null
          publication_number: string
          ted_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_country?: string | null
          buyer_name?: string | null
          cpv?: string | null
          created_at?: string | null
          deadline_date?: string | null
          dm_language?: string | null
          dm_personalization?: string | null
          erp_qualifier?: string | null
          estimated_value?: number | null
          followup_date?: string | null
          id?: string
          linkedin_contact?: string | null
          linkedin_profile_url?: string | null
          notes?: string | null
          notice_type?: string | null
          outreach_date?: string | null
          outreach_status?: string | null
          place_of_performance?: string | null
          publication_date?: string | null
          publication_number?: string
          ted_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      token_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          organization_id: string | null
          status: string
          threshold_value: number
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          organization_id?: string | null
          status?: string
          threshold_value: number
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          organization_id?: string | null
          status?: string
          threshold_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      token_budgets: {
        Row: {
          daily_limit_tokens: number
          hard_cap: boolean
          id: string
          monthly_limit_eur: number
          monthly_limit_tokens: number
          notify_thresholds: number[]
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          daily_limit_tokens: number
          hard_cap?: boolean
          id?: string
          monthly_limit_eur: number
          monthly_limit_tokens: number
          notify_thresholds?: number[]
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          daily_limit_tokens?: number
          hard_cap?: boolean
          id?: string
          monthly_limit_eur?: number
          monthly_limit_tokens?: number
          notify_thresholds?: number[]
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_budgets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      token_usage_events: {
        Row: {
          cached_tokens: number
          completion_tokens: number
          cost_eur: number
          created_at: string
          dedupe_key: string
          event_id: string | null
          id: string
          model: string
          organization_id: string | null
          product: string
          prompt_tokens: number
          provider: string
          session_id: string
          task_id: string
          user_id: string
        }
        Insert: {
          cached_tokens?: number
          completion_tokens: number
          cost_eur: number
          created_at?: string
          dedupe_key: string
          event_id?: string | null
          id?: string
          model: string
          organization_id?: string | null
          product: string
          prompt_tokens: number
          provider: string
          session_id: string
          task_id: string
          user_id: string
        }
        Update: {
          cached_tokens?: number
          completion_tokens?: number
          cost_eur?: number
          created_at?: string
          dedupe_key?: string
          event_id?: string | null
          id?: string
          model?: string
          organization_id?: string | null
          product?: string
          prompt_tokens?: number
          provider?: string
          session_id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_telemetry: {
        Row: {
          agent_name: string
          chain_length: number | null
          chain_position: number | null
          created_at: string | null
          duration_ms: number
          error_message: string | null
          gen_ai_operation_name: string | null
          gen_ai_request_max_tokens: number | null
          gen_ai_request_model: string | null
          gen_ai_request_temperature: number | null
          gen_ai_request_top_p: number | null
          gen_ai_response_finish_reasons: string[] | null
          gen_ai_response_id: string | null
          gen_ai_response_model: string | null
          gen_ai_system: string | null
          gen_ai_usage_input_tokens: number | null
          gen_ai_usage_output_tokens: number | null
          id: string
          is_retry: boolean | null
          iteration_index: number | null
          org_id: string
          outcome: string
          retry_count: number | null
          session_id: string
          span_id: string | null
          tool_name: string
          trace_id: string | null
        }
        Insert: {
          agent_name: string
          chain_length?: number | null
          chain_position?: number | null
          created_at?: string | null
          duration_ms?: number
          error_message?: string | null
          gen_ai_operation_name?: string | null
          gen_ai_request_max_tokens?: number | null
          gen_ai_request_model?: string | null
          gen_ai_request_temperature?: number | null
          gen_ai_request_top_p?: number | null
          gen_ai_response_finish_reasons?: string[] | null
          gen_ai_response_id?: string | null
          gen_ai_response_model?: string | null
          gen_ai_system?: string | null
          gen_ai_usage_input_tokens?: number | null
          gen_ai_usage_output_tokens?: number | null
          id?: string
          is_retry?: boolean | null
          iteration_index?: number | null
          org_id: string
          outcome: string
          retry_count?: number | null
          session_id: string
          span_id?: string | null
          tool_name: string
          trace_id?: string | null
        }
        Update: {
          agent_name?: string
          chain_length?: number | null
          chain_position?: number | null
          created_at?: string | null
          duration_ms?: number
          error_message?: string | null
          gen_ai_operation_name?: string | null
          gen_ai_request_max_tokens?: number | null
          gen_ai_request_model?: string | null
          gen_ai_request_temperature?: number | null
          gen_ai_request_top_p?: number | null
          gen_ai_response_finish_reasons?: string[] | null
          gen_ai_response_id?: string | null
          gen_ai_response_model?: string | null
          gen_ai_system?: string | null
          gen_ai_usage_input_tokens?: number | null
          gen_ai_usage_output_tokens?: number | null
          id?: string
          is_retry?: boolean | null
          iteration_index?: number | null
          org_id?: string
          outcome?: string
          retry_count?: number | null
          session_id?: string
          span_id?: string | null
          tool_name?: string
          trace_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          contract_id: string | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          description: string
          id: string
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          category?: string | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description: string
          id?: string
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          category?: string | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description?: string
          id?: string
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts_pending_signature"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "current_mrr_by_customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_counters: {
        Row: {
          api_calls: number
          assistant_msgs: number
          id: string
          period_start: string
          report_exports: number
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_calls?: number
          assistant_msgs?: number
          id?: string
          period_start: string
          report_exports?: number
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_calls?: number
          assistant_msgs?: number
          id?: string
          period_start?: string
          report_exports?: number
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          created_at: string
          endpoint: string
          event_type: Database["public"]["Enums"]["usage_event_type"]
          id: string
          tokens: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint?: string
          event_type: Database["public"]["Enums"]["usage_event_type"]
          id?: string
          tokens?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          event_type?: Database["public"]["Enums"]["usage_event_type"]
          id?: string
          tokens?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_login_at: string | null
          last_name: string | null
          locale: string | null
          mfa_enabled: boolean | null
          phone: string | null
          status: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          mfa_enabled?: boolean | null
          phone?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          mfa_enabled?: boolean | null
          phone?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown
          is_current: boolean | null
          last_active_at: string | null
          location: Json | null
          refresh_token_hash: string | null
          revoked_at: string | null
          session_token_hash: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown
          is_current?: boolean | null
          last_active_at?: string | null
          location?: Json | null
          refresh_token_hash?: string | null
          revoked_at?: string | null
          session_token_hash: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_current?: boolean | null
          last_active_at?: string | null
          location?: Json | null
          refresh_token_hash?: string | null
          revoked_at?: string | null
          session_token_hash?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          locale: string
          notifications: Json
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          locale?: string
          notifications?: Json
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          locale?: string
          notifications?: Json
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      web_leads: {
        Row: {
          ack_sent_at: string | null
          company: string | null
          consent: boolean
          created_at: string
          email: string
          id: string
          industry: string | null
          locale: string | null
          message: string | null
          metadata: Json
          name: string | null
          page_path: string | null
          site: string | null
          source: string
          status: string
        }
        Insert: {
          ack_sent_at?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          locale?: string | null
          message?: string | null
          metadata?: Json
          name?: string | null
          page_path?: string | null
          site?: string | null
          source: string
          status?: string
        }
        Update: {
          ack_sent_at?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          locale?: string | null
          message?: string | null
          metadata?: Json
          name?: string | null
          page_path?: string | null
          site?: string | null
          source?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      contracts_pending_signature: {
        Row: {
          contract_number: string | null
          customer_name: string | null
          days_pending: number | null
          id: string | null
          primary_contact_email: string | null
          sent_date: string | null
          status: Database["public"]["Enums"]["contract_status"] | null
          title: string | null
          total_value: number | null
        }
        Relationships: []
      }
      current_mrr_by_customer: {
        Row: {
          active_subscriptions: number | null
          contract_start_date: string | null
          current_arr: number | null
          current_mrr: number | null
          id: string | null
          name: string | null
          status: Database["public"]["Enums"]["customer_status"] | null
          subscription_mrr: number | null
        }
        Relationships: []
      }
      firehorse_active_proposals: {
        Row: {
          amount_eur: number | null
          company: string | null
          country: Database["public"]["Enums"]["lead_country"] | null
          email: string | null
          first_name: string | null
          last_name: string | null
          lead_id: string | null
          lead_title: string | null
          pilot_duration_months: number | null
          proposal_id: string | null
          proposal_title: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["proposal_status"] | null
          valid_until: string | null
        }
        Relationships: []
      }
      firehorse_cold2_candidates: {
        Row: {
          cold_1_sent_at: string | null
          company: string | null
          country: Database["public"]["Enums"]["lead_country"] | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          state: Database["public"]["Enums"]["lead_state"] | null
        }
        Insert: {
          cold_1_sent_at?: string | null
          company?: string | null
          country?: Database["public"]["Enums"]["lead_country"] | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          state?: Database["public"]["Enums"]["lead_state"] | null
        }
        Update: {
          cold_1_sent_at?: string | null
          company?: string | null
          country?: Database["public"]["Enums"]["lead_country"] | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          state?: Database["public"]["Enums"]["lead_state"] | null
        }
        Relationships: []
      }
      firehorse_cold3_candidates: {
        Row: {
          cold_2_sent_at: string | null
          company: string | null
          country: Database["public"]["Enums"]["lead_country"] | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          state: Database["public"]["Enums"]["lead_state"] | null
        }
        Insert: {
          cold_2_sent_at?: string | null
          company?: string | null
          country?: Database["public"]["Enums"]["lead_country"] | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          state?: Database["public"]["Enums"]["lead_state"] | null
        }
        Update: {
          cold_2_sent_at?: string | null
          company?: string | null
          country?: Database["public"]["Enums"]["lead_country"] | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          state?: Database["public"]["Enums"]["lead_state"] | null
        }
        Relationships: []
      }
      firehorse_daily_new_leads: {
        Row: {
          company: string | null
          country: Database["public"]["Enums"]["lead_country"] | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          segment: string | null
        }
        Relationships: []
      }
      firehorse_linkedin_pending: {
        Row: {
          company: string | null
          country: Database["public"]["Enums"]["lead_country"] | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          linkedin_url: string | null
          state: Database["public"]["Enums"]["lead_state"] | null
          title: string | null
        }
        Relationships: []
      }
      firehorse_memory_current: {
        Row: {
          archived_at: string | null
          body: string | null
          created_at: string | null
          id: string | null
          source: string | null
          source_proposal_path: string | null
          source_session_id: string | null
          title: string | null
          topic: string | null
          version: number | null
        }
        Relationships: []
      }
      firehorse_sales_pipeline: {
        Row: {
          company: string | null
          country: Database["public"]["Enums"]["lead_country"] | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_meeting_at: string | null
          last_name: string | null
          last_proposal_sent_at: string | null
          lead_state: Database["public"]["Enums"]["lead_state"] | null
          linkedin_connection_status:
            | Database["public"]["Enums"]["linkedin_connection_status"]
            | null
          meetings_count: number | null
          proposals_count: number | null
          revenue_eur_million: number | null
        }
        Relationships: []
      }
      firehorse_signals_daily_summary: {
        Row: {
          correlation_score: number | null
          date: string | null
          signal_count: number | null
          signal_source: Database["public"]["Enums"]["signal_source"] | null
          unique_companies: number | null
        }
        Relationships: []
      }
      firehorse_signals_high: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_linkedin_url: string | null
          contact_name: string | null
          contact_title: string | null
          correlation_reason: string | null
          correlation_score: number | null
          created_at: string | null
          dws6_feature_match: string[] | null
          id: string | null
          keywords_matched: string[] | null
          message_draft: string | null
          message_final: string | null
          message_sent_at: string | null
          response_content: string | null
          response_received_at: string | null
          signal_content: string | null
          signal_date: string | null
          signal_metadata: Json | null
          signal_source: Database["public"]["Enums"]["signal_source"] | null
          signal_type: Database["public"]["Enums"]["signal_type"] | null
          signal_url: string | null
          status: Database["public"]["Enums"]["signal_status"] | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email?: string | null
          contact_linkedin_url?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string | null
          dws6_feature_match?: string[] | null
          id?: string | null
          keywords_matched?: string[] | null
          message_draft?: string | null
          message_final?: string | null
          message_sent_at?: string | null
          response_content?: string | null
          response_received_at?: string | null
          signal_content?: string | null
          signal_date?: string | null
          signal_metadata?: Json | null
          signal_source?: Database["public"]["Enums"]["signal_source"] | null
          signal_type?: Database["public"]["Enums"]["signal_type"] | null
          signal_url?: string | null
          status?: Database["public"]["Enums"]["signal_status"] | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: string | null
          contact_linkedin_url?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string | null
          dws6_feature_match?: string[] | null
          id?: string | null
          keywords_matched?: string[] | null
          message_draft?: string | null
          message_final?: string | null
          message_sent_at?: string | null
          response_content?: string | null
          response_received_at?: string | null
          signal_content?: string | null
          signal_date?: string | null
          signal_metadata?: Json | null
          signal_source?: Database["public"]["Enums"]["signal_source"] | null
          signal_type?: Database["public"]["Enums"]["signal_type"] | null
          signal_url?: string | null
          status?: Database["public"]["Enums"]["signal_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      firehorse_signals_metrics: {
        Row: {
          correlation_score: number | null
          demo_count: number | null
          response_count: number | null
          response_rate_pct: number | null
          sent_count: number | null
          total_signals: number | null
          week: string | null
        }
        Relationships: []
      }
      firehorse_signals_pending_approval: {
        Row: {
          company_name: string | null
          contact_name: string | null
          contact_title: string | null
          correlation_reason: string | null
          correlation_score: number | null
          created_at: string | null
          dws6_feature_match: string[] | null
          id: string | null
          keywords_matched: string[] | null
          message_draft: string | null
          signal_content: string | null
          signal_date: string | null
          signal_url: string | null
        }
        Insert: {
          company_name?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string | null
          dws6_feature_match?: string[] | null
          id?: string | null
          keywords_matched?: string[] | null
          message_draft?: string | null
          signal_content?: string | null
          signal_date?: string | null
          signal_url?: string | null
        }
        Update: {
          company_name?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string | null
          dws6_feature_match?: string[] | null
          id?: string | null
          keywords_matched?: string[] | null
          message_draft?: string | null
          signal_content?: string | null
          signal_date?: string | null
          signal_url?: string | null
        }
        Relationships: []
      }
      firehorse_signals_ultra: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_linkedin_url: string | null
          contact_name: string | null
          contact_title: string | null
          correlation_reason: string | null
          correlation_score: number | null
          created_at: string | null
          dws6_feature_match: string[] | null
          id: string | null
          keywords_matched: string[] | null
          message_draft: string | null
          message_final: string | null
          message_sent_at: string | null
          response_content: string | null
          response_received_at: string | null
          signal_content: string | null
          signal_date: string | null
          signal_metadata: Json | null
          signal_source: Database["public"]["Enums"]["signal_source"] | null
          signal_type: Database["public"]["Enums"]["signal_type"] | null
          signal_url: string | null
          status: Database["public"]["Enums"]["signal_status"] | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email?: string | null
          contact_linkedin_url?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string | null
          dws6_feature_match?: string[] | null
          id?: string | null
          keywords_matched?: string[] | null
          message_draft?: string | null
          message_final?: string | null
          message_sent_at?: string | null
          response_content?: string | null
          response_received_at?: string | null
          signal_content?: string | null
          signal_date?: string | null
          signal_metadata?: Json | null
          signal_source?: Database["public"]["Enums"]["signal_source"] | null
          signal_type?: Database["public"]["Enums"]["signal_type"] | null
          signal_url?: string | null
          status?: Database["public"]["Enums"]["signal_status"] | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: string | null
          contact_linkedin_url?: string | null
          contact_name?: string | null
          contact_title?: string | null
          correlation_reason?: string | null
          correlation_score?: number | null
          created_at?: string | null
          dws6_feature_match?: string[] | null
          id?: string | null
          keywords_matched?: string[] | null
          message_draft?: string | null
          message_final?: string | null
          message_sent_at?: string | null
          response_content?: string | null
          response_received_at?: string | null
          signal_content?: string | null
          signal_date?: string | null
          signal_metadata?: Json | null
          signal_source?: Database["public"]["Enums"]["signal_source"] | null
          signal_type?: Database["public"]["Enums"]["signal_type"] | null
          signal_url?: string | null
          status?: Database["public"]["Enums"]["signal_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      firehorse_upcoming_meetings: {
        Row: {
          company: string | null
          duration_minutes: number | null
          email: string | null
          first_name: string | null
          last_name: string | null
          lead_id: string | null
          lead_title: string | null
          meeting_id: string | null
          meeting_title: string | null
          meeting_type: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["meeting_status"] | null
        }
        Relationships: []
      }
      monthly_metrics_summary: {
        Row: {
          active_customers: number | null
          arr: number | null
          cash_balance: number | null
          churn_rate: number | null
          churned_mrr: number | null
          expansion_mrr: number | null
          month: string | null
          mrr: number | null
          net_burn: number | null
          new_mrr: number | null
          runway_months: number | null
        }
        Relationships: []
      }
      monthly_payment_summary: {
        Row: {
          currency: string | null
          failed_payments: number | null
          month: string | null
          provider: string | null
          successful_payments: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      recent_payment_events: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          event_type: string | null
          id: string | null
          product_name: string | null
          provider: string | null
        }
        Relationships: []
      }
      subscription_details: {
        Row: {
          billing_cycle:
            | Database["public"]["Enums"]["subscription_billing_cycle"]
            | null
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_status: Database["public"]["Enums"]["customer_status"] | null
          end_date: string | null
          id: string | null
          is_active: boolean | null
          monthly_amount: number | null
          next_billing_date: string | null
          payment_provider: string | null
          product_name: string | null
          provider_subscription_id: string | null
          start_date: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "current_mrr_by_customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions_expiring_soon: {
        Row: {
          customer_name: string | null
          days_until_expiry: number | null
          end_date: string | null
          id: string | null
          monthly_amount: number | null
          primary_contact_email: string | null
          product_name: string | null
        }
        Relationships: []
      }
      v_agent_performance_leaderboard: {
        Row: {
          agent_id: string | null
          avg_meeting_booked_rate: number | null
          avg_open_rate: number | null
          avg_reply_rate: number | null
          last_active_date: string | null
          total_cost_eur: number | null
          total_emails_sent: number | null
          total_leads_processed: number | null
          total_meetings_booked: number | null
          total_spam_complaints: number | null
        }
        Relationships: []
      }
      v_booked_slots: {
        Row: {
          service_id: string | null
          slot_end: string | null
          slot_start: string | null
        }
        Insert: {
          service_id?: string | null
          slot_end?: never
          slot_start?: string | null
        }
        Update: {
          service_id?: string | null
          slot_end?: never
          slot_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "booking_services"
            referencedColumns: ["id"]
          },
        ]
      }
      v_construction_leads_deadlines: {
        Row: {
          buyer_name: string | null
          buyer_url: string | null
          contract_type: string | null
          country_code: string | null
          country_name: string | null
          cpv_code: string | null
          cpv_description: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          deadline_date: string | null
          description: string | null
          document_number: string | null
          estimated_value: number | null
          id: string | null
          notes: string | null
          notice_type: string | null
          nuts_code: string | null
          org_id: string | null
          place_of_performance: string | null
          procedure_type: string | null
          publication_date: string | null
          raw_data: Json | null
          relevance_score: number | null
          source: string | null
          status: string | null
          ted_notice_id: string | null
          ted_url: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_name?: string | null
          buyer_url?: string | null
          contract_type?: string | null
          country_code?: string | null
          country_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          document_number?: string | null
          estimated_value?: number | null
          id?: string | null
          notes?: string | null
          notice_type?: string | null
          nuts_code?: string | null
          org_id?: string | null
          place_of_performance?: string | null
          procedure_type?: string | null
          publication_date?: string | null
          raw_data?: Json | null
          relevance_score?: number | null
          source?: string | null
          status?: string | null
          ted_notice_id?: string | null
          ted_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_name?: string | null
          buyer_url?: string | null
          contract_type?: string | null
          country_code?: string | null
          country_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          document_number?: string | null
          estimated_value?: number | null
          id?: string | null
          notes?: string | null
          notice_type?: string | null
          nuts_code?: string | null
          org_id?: string | null
          place_of_performance?: string | null
          procedure_type?: string | null
          publication_date?: string | null
          raw_data?: Json | null
          relevance_score?: number | null
          source?: string | null
          status?: string | null
          ted_notice_id?: string | null
          ted_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "construction_leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      v_construction_leads_new: {
        Row: {
          buyer_name: string | null
          buyer_url: string | null
          contract_type: string | null
          country_code: string | null
          country_name: string | null
          cpv_code: string | null
          cpv_description: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          deadline_date: string | null
          description: string | null
          document_number: string | null
          estimated_value: number | null
          id: string | null
          notes: string | null
          notice_type: string | null
          nuts_code: string | null
          org_id: string | null
          place_of_performance: string | null
          procedure_type: string | null
          publication_date: string | null
          raw_data: Json | null
          relevance_score: number | null
          source: string | null
          status: string | null
          ted_notice_id: string | null
          ted_url: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_name?: string | null
          buyer_url?: string | null
          contract_type?: string | null
          country_code?: string | null
          country_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          document_number?: string | null
          estimated_value?: number | null
          id?: string | null
          notes?: string | null
          notice_type?: string | null
          nuts_code?: string | null
          org_id?: string | null
          place_of_performance?: string | null
          procedure_type?: string | null
          publication_date?: string | null
          raw_data?: Json | null
          relevance_score?: number | null
          source?: string | null
          status?: string | null
          ted_notice_id?: string | null
          ted_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_name?: string | null
          buyer_url?: string | null
          contract_type?: string | null
          country_code?: string | null
          country_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          deadline_date?: string | null
          description?: string | null
          document_number?: string | null
          estimated_value?: number | null
          id?: string | null
          notes?: string | null
          notice_type?: string | null
          nuts_code?: string | null
          org_id?: string | null
          place_of_performance?: string | null
          procedure_type?: string | null
          publication_date?: string | null
          raw_data?: Json | null
          relevance_score?: number | null
          source?: string | null
          status?: string | null
          ted_notice_id?: string | null
          ted_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "construction_leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      v_construction_leads_summary: {
        Row: {
          contacted_count: number | null
          deadlines_this_week: number | null
          new_count: number | null
          outreach_count: number | null
          qualified_count: number | null
          reviewed_count: number | null
          total: number | null
        }
        Relationships: []
      }
      v_email_queue_stats: {
        Row: {
          count: number | null
          newest_created: string | null
          newest_sent: string | null
          oldest_created: string | null
          oldest_sent: string | null
          status: string | null
        }
        Relationships: []
      }
      v_high_priority_leads: {
        Row: {
          company: string | null
          confidence_score: number | null
          created_at: string | null
          email: string | null
          emails_opened: number | null
          emails_sent: number | null
          enriched_at: string | null
          first_name: string | null
          icp_score: number | null
          id: string | null
          last_activity_at: string | null
          last_name: string | null
          priority: string | null
          replies: number | null
          segment: string | null
          state: Database["public"]["Enums"]["lead_state"] | null
          title: string | null
          trigger_events: Json | null
        }
        Relationships: []
      }
      v_outreach_due_today: {
        Row: {
          activity_count: number | null
          boardy_notes: string | null
          check_size: string | null
          created_at: string | null
          created_by: string | null
          customer_segment: string | null
          first_name: string | null
          id: string | null
          investor_type: string | null
          last_contacted_at: string | null
          last_name: string | null
          last_outbound_at: string | null
          linkedin_url: string | null
          meetings_count: number | null
          next_action: string | null
          next_action_date: string | null
          next_action_type: string | null
          nudge_count: number | null
          org_domain: string | null
          org_id: string | null
          org_location: string | null
          org_name: string | null
          org_size: string | null
          our_angle: string | null
          partnership_type: string | null
          person_id: string | null
          person_location: string | null
          person_phone: string | null
          person_title: string | null
          pipeline: Database["public"]["Enums"]["outreach_pipeline"] | null
          primary_email: string | null
          priority: Database["public"]["Enums"]["outreach_priority"] | null
          source: Database["public"]["Enums"]["outreach_source"] | null
          status: Database["public"]["Enums"]["outreach_status"] | null
          their_angle: string | null
          thread_token: string | null
          waiting_since: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_threads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_threads_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      v_outreach_enriched: {
        Row: {
          boardy_notes: string | null
          check_size: string | null
          created_at: string | null
          created_by: string | null
          customer_segment: string | null
          first_name: string | null
          id: string | null
          investor_type: string | null
          last_contacted_at: string | null
          last_name: string | null
          last_outbound_at: string | null
          linkedin_url: string | null
          meetings_count: number | null
          next_action: string | null
          next_action_date: string | null
          next_action_type: string | null
          nudge_count: number | null
          org_domain: string | null
          org_id: string | null
          org_location: string | null
          org_name: string | null
          org_size: string | null
          our_angle: string | null
          partnership_type: string | null
          person_id: string | null
          person_location: string | null
          person_phone: string | null
          person_title: string | null
          pipeline: Database["public"]["Enums"]["outreach_pipeline"] | null
          primary_email: string | null
          priority: Database["public"]["Enums"]["outreach_priority"] | null
          source: Database["public"]["Enums"]["outreach_source"] | null
          status: Database["public"]["Enums"]["outreach_status"] | null
          their_angle: string | null
          thread_token: string | null
          waiting_since: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_threads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "outreach_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_threads_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      v_outreach_pipeline_summary: {
        Row: {
          active_count: number | null
          converted_count: number | null
          due_today: number | null
          meetings_count: number | null
          new_count: number | null
          pipeline: Database["public"]["Enums"]["outreach_pipeline"] | null
          total: number | null
        }
        Relationships: []
      }
      v_pending_approvals: {
        Row: {
          action_type: string | null
          agent_id: string | null
          approval_id: string | null
          body: string | null
          company: string | null
          created_at: string | null
          cta: string | null
          email: string | null
          expires_at: string | null
          first_name: string | null
          icp_score: number | null
          last_name: string | null
          subject_line: string | null
          time_until_expiry: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_monthly_metrics: {
        Args: { target_month: string }
        Returns: undefined
      }
      consolidate_memories: {
        Args: { p_org_id?: string; p_similarity_threshold?: number }
        Returns: {
          consolidated_count: number
          kept_count: number
          merged_ids: string[]
        }[]
      }
      decay_stale_memories: {
        Args: {
          p_decay_threshold?: number
          p_dry_run?: boolean
          p_half_life_days?: number
          p_org_id?: string
        }
        Returns: {
          below_threshold: boolean
          days_since_access: number
          memory_id: string
          new_confidence: number
          old_confidence: number
          org_id: string
        }[]
      }
      emit_agent_signal: {
        Args: {
          p_agent_id: string
          p_context_id?: string
          p_metadata?: Json
          p_milestone: string
          p_signal_type: string
        }
        Returns: string
      }
      expire_pending_approvals: { Args: never; Returns: undefined }
      find_duplicate_memories: {
        Args: {
          p_auto_threshold?: number
          p_customer_id: string
          p_limit?: number
          p_org_id: string
          p_review_threshold?: number
        }
        Returns: {
          confidence_a: number
          confidence_b: number
          content_a: string
          content_b: string
          cosine_similarity: number
          keep_id: string
          memory_a_id: string
          memory_b_id: string
          needs_review: boolean
          supersede_id: string
        }[]
      }
      find_duplicate_org_memories: {
        Args: {
          p_auto_threshold?: number
          p_limit?: number
          p_org_id: string
          p_review_threshold?: number
        }
        Returns: {
          confidence_a: number
          confidence_b: number
          content_a: string
          content_b: string
          cosine_similarity: number
          keep_id: string
          memory_a_id: string
          memory_b_id: string
          needs_review: boolean
          supersede_id: string
        }[]
      }
      forget_memory: {
        Args: {
          forget_reason?: string
          p_agent_id?: string
          p_memory_id: string
          p_org_id?: string
        }
        Returns: boolean
      }
      generate_thread_token: { Args: { len?: number }; Returns: string }
      get_country_context: { Args: { country_code: string }; Returns: string }
      get_or_create_usage_for_date:
        | { Args: { p_org_id?: string; p_user_id: string }; Returns: string }
        | {
            Args: { usage_date: string }
            Returns: {
              cost_usd: number
              created_at: string | null
              date: string
              id: string
              input_tokens: number
              output_tokens: number
              requests: number
              updated_at: string | null
            }
            SetofOptions: {
              from: "*"
              to: "climate_assistant_usage"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      get_signals_by_company: {
        Args: { company_name_param: string }
        Returns: {
          correlation_score: number
          id: string
          message_draft: string
          signal_date: string
          signal_type: Database["public"]["Enums"]["signal_type"]
          status: Database["public"]["Enums"]["signal_status"]
        }[]
      }
      get_top_companies_by_signals: {
        Args: { limit_param?: number }
        Returns: {
          company_name: string
          high_count: number
          latest_signal: string
          signal_count: number
          ultra_count: number
        }[]
      }
      get_user_organizations: {
        Args: { p_user_id: string }
        Returns: {
          organization_id: string
          organization_name: string
          organization_slug: string
          plan_tier: string
          user_role: string
        }[]
      }
      increment_climate_usage:
        | {
            Args: {
              p_cost_cents?: number
              p_org_id?: string
              p_requests?: number
              p_tokens?: number
              p_user_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              cost_delta: number
              input_tokens_delta: number
              output_tokens_delta: number
              usage_date: string
            }
            Returns: {
              cost_usd: number
              created_at: string | null
              date: string
              id: string
              input_tokens: number
              output_tokens: number
              requests: number
              updated_at: string | null
            }
            SetofOptions: {
              from: "*"
              to: "climate_assistant_usage"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      increment_usage_counter: {
        Args: {
          p_event_type: Database["public"]["Enums"]["usage_event_type"]
          p_tier?: string
          p_user_id: string
        }
        Returns: {
          api_calls: number
          assistant_msgs: number
          report_exports: number
        }[]
      }
      is_backoffice_admin: { Args: never; Returns: boolean }
      log_auth_event: {
        Args: {
          p_action: string
          p_details?: Json
          p_success?: boolean
          p_user_id: string
        }
        Returns: string
      }
      log_memory_audit: {
        Args: {
          p_agent_ats?: number
          p_agent_id: string
          p_customer_id?: string
          p_memory_id?: string
          p_metadata?: Json
          p_operation: string
          p_org_id?: string
          p_reason?: string
        }
        Returns: string
      }
      resolve_term: {
        Args: {
          p_cloud_profile?: string
          p_concept_id: string
          p_industry?: string
          p_legal_profile?: string
          p_locale?: string
          p_lwm_version?: string
          p_platform_version?: string
          p_product_edition?: string
          p_tenant_id?: string
        }
        Returns: {
          concept_id: string
          definition_override: string
          policy_level: Database["public"]["Enums"]["policy_level_enum"]
          preferred_term: string
          scope_ref: string
          scope_type: Database["public"]["Enums"]["scope_type_enum"]
        }[]
      }
      smart_factory_release_send: {
        Args: never
        Returns: {
          new_count: number
          success: boolean
        }[]
      }
      smart_factory_reserve_send: {
        Args: { p_cap?: number }
        Returns: {
          new_count: number
          success: boolean
        }[]
      }
      supersede_memory: {
        Args: {
          p_agent_ats?: number
          p_agent_id?: string
          p_customer_id?: string
          p_new_confidence?: number
          p_new_content: string
          p_new_metadata?: Json
          p_new_source?: string
          p_old_memory_id: string
          p_org_id?: string
          p_reason?: string
        }
        Returns: {
          confidence_delta: number
          kya_decision: string
          new_memory_id: string
          requires_review: boolean
        }[]
      }
      update_agent_metrics: {
        Args: { p_agent_id: string; p_date?: string }
        Returns: undefined
      }
      update_subscription_from_payment: {
        Args: {
          p_next_billing_date?: string
          p_provider: string
          p_provider_subscription_id: string
          p_status: boolean
          p_subscription_id: string
        }
        Returns: undefined
      }
      user_has_org_role: {
        Args: { p_org_id: string; p_roles: string[]; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_outcome:
        | "positive"
        | "neutral"
        | "negative"
        | "no_response"
        | "bounced"
        | "manual_update"
        | "manual_update_failed"
      contract_status:
        | "draft"
        | "sent"
        | "signed"
        | "active"
        | "completed"
        | "cancelled"
      customer_status: "trial" | "active" | "paused" | "churned" | "expansion"
      event_type:
        | "EmailSent"
        | "EmailOpened"
        | "LinkClicked"
        | "Replied"
        | "MeetingBooked"
        | "StateChanged"
        | "TaskCreated"
        | "LeadEnriched"
        | "IcpScored"
        | "SequenceTriggered"
        | "LinkedInConnection"
        | "LinkedInInMail"
        | "SpamComplaint"
        | "Unsubscribed"
        | "AgentError"
      lead_country: "FI" | "SE" | "NO" | "DK" | "DE"
      lead_state:
        | "New"
        | "Cold_1_Sent"
        | "Cold_1_Opened"
        | "Cold_1_Clicked"
        | "Cold_2_Sent"
        | "Cold_3_Sent"
        | "Engaged"
        | "Meeting_Booked"
        | "Disqualified"
        | "Parked"
      linkedin_connection_status:
        | "not_sent"
        | "request_sent"
        | "accepted"
        | "declined"
        | "withdrawn"
      meeting_status: "scheduled" | "completed" | "cancelled" | "no_show"
      outreach_pipeline: "investor" | "customer" | "partner"
      outreach_priority: "high" | "medium" | "low"
      outreach_source:
        | "boardy"
        | "linkedin"
        | "conference"
        | "referral"
        | "cold"
        | "inbound"
        | "manual"
      outreach_status:
        | "new"
        | "researched"
        | "intro_requested"
        | "intro_made"
        | "contacted"
        | "responded"
        | "meeting_booked"
        | "in_negotiation"
        | "converted"
        | "passed"
        | "parked"
      policy_level_enum: "preferred" | "allowed" | "forbidden" | "required"
      proposal_status:
        | "draft"
        | "sent"
        | "under_review"
        | "negotiation"
        | "accepted"
        | "rejected"
        | "expired"
      reply_intent:
        | "interested"
        | "demo"
        | "meeting"
        | "later"
        | "Q3"
        | "H2"
        | "wrong_person"
        | "not_relevant"
        | "unknown"
      report_format: "json" | "csv"
      report_frequency: "monthly" | "quarterly" | "annually"
      scope_type_enum:
        | "global"
        | "platform_release"
        | "edition"
        | "lwm"
        | "industry"
        | "customer"
      signal_source: "linkedin" | "x" | "web" | "rss" | "manual"
      signal_status:
        | "detected"
        | "analyzed"
        | "queued"
        | "approved"
        | "sent"
        | "responded"
        | "demo_booked"
        | "ignored"
        | "rejected"
      signal_type:
        | "job_change"
        | "company_update"
        | "press_release"
        | "blog_post"
        | "social_post"
        | "funding"
        | "project_announcement"
        | "other"
      subscription_billing_cycle: "monthly" | "quarterly" | "annual"
      task_type: "ManualReply" | "FollowUp" | "Review"
      template_type: "email" | "linkedin_dm"
      transaction_type:
        | "cash_in"
        | "cash_out"
        | "revenue"
        | "expense"
        | "investment"
        | "loan"
      usage_event_type: "api_call" | "assistant_message" | "report_export"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_outcome: [
        "positive",
        "neutral",
        "negative",
        "no_response",
        "bounced",
        "manual_update",
        "manual_update_failed",
      ],
      contract_status: [
        "draft",
        "sent",
        "signed",
        "active",
        "completed",
        "cancelled",
      ],
      customer_status: ["trial", "active", "paused", "churned", "expansion"],
      event_type: [
        "EmailSent",
        "EmailOpened",
        "LinkClicked",
        "Replied",
        "MeetingBooked",
        "StateChanged",
        "TaskCreated",
        "LeadEnriched",
        "IcpScored",
        "SequenceTriggered",
        "LinkedInConnection",
        "LinkedInInMail",
        "SpamComplaint",
        "Unsubscribed",
        "AgentError",
      ],
      lead_country: ["FI", "SE", "NO", "DK", "DE"],
      lead_state: [
        "New",
        "Cold_1_Sent",
        "Cold_1_Opened",
        "Cold_1_Clicked",
        "Cold_2_Sent",
        "Cold_3_Sent",
        "Engaged",
        "Meeting_Booked",
        "Disqualified",
        "Parked",
      ],
      linkedin_connection_status: [
        "not_sent",
        "request_sent",
        "accepted",
        "declined",
        "withdrawn",
      ],
      meeting_status: ["scheduled", "completed", "cancelled", "no_show"],
      outreach_pipeline: ["investor", "customer", "partner"],
      outreach_priority: ["high", "medium", "low"],
      outreach_source: [
        "boardy",
        "linkedin",
        "conference",
        "referral",
        "cold",
        "inbound",
        "manual",
      ],
      outreach_status: [
        "new",
        "researched",
        "intro_requested",
        "intro_made",
        "contacted",
        "responded",
        "meeting_booked",
        "in_negotiation",
        "converted",
        "passed",
        "parked",
      ],
      policy_level_enum: ["preferred", "allowed", "forbidden", "required"],
      proposal_status: [
        "draft",
        "sent",
        "under_review",
        "negotiation",
        "accepted",
        "rejected",
        "expired",
      ],
      reply_intent: [
        "interested",
        "demo",
        "meeting",
        "later",
        "Q3",
        "H2",
        "wrong_person",
        "not_relevant",
        "unknown",
      ],
      report_format: ["json", "csv"],
      report_frequency: ["monthly", "quarterly", "annually"],
      scope_type_enum: [
        "global",
        "platform_release",
        "edition",
        "lwm",
        "industry",
        "customer",
      ],
      signal_source: ["linkedin", "x", "web", "rss", "manual"],
      signal_status: [
        "detected",
        "analyzed",
        "queued",
        "approved",
        "sent",
        "responded",
        "demo_booked",
        "ignored",
        "rejected",
      ],
      signal_type: [
        "job_change",
        "company_update",
        "press_release",
        "blog_post",
        "social_post",
        "funding",
        "project_announcement",
        "other",
      ],
      subscription_billing_cycle: ["monthly", "quarterly", "annual"],
      task_type: ["ManualReply", "FollowUp", "Review"],
      template_type: ["email", "linkedin_dm"],
      transaction_type: [
        "cash_in",
        "cash_out",
        "revenue",
        "expense",
        "investment",
        "loan",
      ],
      usage_event_type: ["api_call", "assistant_message", "report_export"],
    },
  },
} as const

