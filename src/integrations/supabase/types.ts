export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aircraft: {
        Row: {
          aircraft_type: Database["public"]["Enums"]["aircraft_type"]
          battery_capacity: number | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          manufacturer: string | null
          max_altitude: number | null
          max_flight_time: number | null
          max_range: number | null
          model: string | null
          name: string
          notes: string | null
          org_id: string | null
          registration: string | null
          serial_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aircraft_type?: Database["public"]["Enums"]["aircraft_type"]
          battery_capacity?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          manufacturer?: string | null
          max_altitude?: number | null
          max_flight_time?: number | null
          max_range?: number | null
          model?: string | null
          name: string
          notes?: string | null
          org_id?: string | null
          registration?: string | null
          serial_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aircraft_type?: Database["public"]["Enums"]["aircraft_type"]
          battery_capacity?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          manufacturer?: string | null
          max_altitude?: number | null
          max_flight_time?: number | null
          max_range?: number | null
          model?: string | null
          name?: string
          notes?: string | null
          org_id?: string | null
          registration?: string | null
          serial_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          aircraft_id: string | null
          alert_type: string | null
          created_at: string
          data: Json | null
          flight_session_id: string | null
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          message: string
          org_id: string | null
          severity: Database["public"]["Enums"]["alert_severity"] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aircraft_id?: string | null
          alert_type?: string | null
          created_at?: string
          data?: Json | null
          flight_session_id?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message: string
          org_id?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aircraft_id?: string | null
          alert_type?: string | null
          created_at?: string
          data?: Json | null
          flight_session_id?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string
          org_id?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_flight_session_id_fkey"
            columns: ["flight_session_id"]
            isOneToOne: false
            referencedRelation: "flight_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_sessions: {
        Row: {
          aircraft_id: string | null
          analysis_results: Json | null
          analysis_status: string | null
          battery_consumed_percent: number | null
          created_at: string
          distance_km: number | null
          duration_seconds: number | null
          flight_date: string | null
          flight_path: Json | null
          flight_upload_id: string | null
          id: string
          max_altitude_m: number | null
          max_speed_ms: number | null
          name: string
          notes: string | null
          org_id: string | null
          risk_score: number | null
          telemetry_summary: Json | null
          updated_at: string
          user_id: string
          weather_conditions: Json | null
        }
        Insert: {
          aircraft_id?: string | null
          analysis_results?: Json | null
          analysis_status?: string | null
          battery_consumed_percent?: number | null
          created_at?: string
          distance_km?: number | null
          duration_seconds?: number | null
          flight_date?: string | null
          flight_path?: Json | null
          flight_upload_id?: string | null
          id?: string
          max_altitude_m?: number | null
          max_speed_ms?: number | null
          name: string
          notes?: string | null
          org_id?: string | null
          risk_score?: number | null
          telemetry_summary?: Json | null
          updated_at?: string
          user_id: string
          weather_conditions?: Json | null
        }
        Update: {
          aircraft_id?: string | null
          analysis_results?: Json | null
          analysis_status?: string | null
          battery_consumed_percent?: number | null
          created_at?: string
          distance_km?: number | null
          duration_seconds?: number | null
          flight_date?: string | null
          flight_path?: Json | null
          flight_upload_id?: string | null
          id?: string
          max_altitude_m?: number | null
          max_speed_ms?: number | null
          name?: string
          notes?: string | null
          org_id?: string | null
          risk_score?: number | null
          telemetry_summary?: Json | null
          updated_at?: string
          user_id?: string
          weather_conditions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_sessions_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_sessions_flight_upload_id_fkey"
            columns: ["flight_upload_id"]
            isOneToOne: false
            referencedRelation: "flight_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_sessions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_uploads: {
        Row: {
          aircraft_type: string | null
          analysis_id: string | null
          created_at: string
          file_name: string
          flight_date: string | null
          id: string
          org_id: string | null
          original_name: string
          status: Database["public"]["Enums"]["flight_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          aircraft_type?: string | null
          analysis_id?: string | null
          created_at?: string
          file_name: string
          flight_date?: string | null
          id?: string
          org_id?: string | null
          original_name: string
          status?: Database["public"]["Enums"]["flight_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          aircraft_type?: string | null
          analysis_id?: string | null
          created_at?: string
          file_name?: string
          flight_date?: string | null
          id?: string
          org_id?: string | null
          original_name?: string
          status?: Database["public"]["Enums"]["flight_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_uploads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          aircraft_id: string
          attachments: Json | null
          completed_date: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          maintenance_type: string
          next_maintenance_hours: number | null
          notes: string | null
          org_id: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["maintenance_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aircraft_id: string
          attachments?: Json | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          maintenance_type: string
          next_maintenance_hours?: number | null
          notes?: string | null
          org_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aircraft_id?: string
          attachments?: Json | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          maintenance_type?: string
          next_maintenance_hours?: number | null
          notes?: string | null
          org_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          id: string
          joined_at: string
          org_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          org_id: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          org_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          org_id: string | null
          setting_key: string
          setting_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id?: string | null
          setting_key: string
          setting_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          default_aircraft: string | null
          full_name: string | null
          id: string
          org_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          default_aircraft?: string | null
          full_name?: string | null
          id?: string
          org_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          default_aircraft?: string | null
          full_name?: string | null
          id?: string
          org_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      aircraft_type:
        | "fixed_wing"
        | "multirotor"
        | "vtol"
        | "helicopter"
        | "other"
      alert_severity: "low" | "medium" | "high" | "critical"
      flight_status: "pending" | "analyzing" | "complete" | "failed"
      maintenance_status: "scheduled" | "in_progress" | "completed" | "overdue"
      user_role: "owner" | "admin" | "pilot" | "viewer"
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
  public: {
    Enums: {
      aircraft_type: [
        "fixed_wing",
        "multirotor",
        "vtol",
        "helicopter",
        "other",
      ],
      alert_severity: ["low", "medium", "high", "critical"],
      flight_status: ["pending", "analyzing", "complete", "failed"],
      maintenance_status: ["scheduled", "in_progress", "completed", "overdue"],
      user_role: ["owner", "admin", "pilot", "viewer"],
    },
  },
} as const
