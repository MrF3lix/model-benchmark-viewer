export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      area: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      evaluation: {
        Row: {
          area: string | null
          dataset: string | null
          description: string | null
          id: string
          task: string | null
        }
        Insert: {
          area?: string | null
          dataset?: string | null
          description?: string | null
          id: string
          task?: string | null
        }
        Update: {
          area?: string | null
          dataset?: string | null
          description?: string | null
          id?: string
          task?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_task_area_fkey"
            columns: ["task", "area"]
            isOneToOne: false
            referencedRelation: "task"
            referencedColumns: ["id", "area"]
          },
        ]
      }
      result: {
        Row: {
          best_metric: string | null
          best_rank: number | null
          evaluated_on: string | null
          evaluation: string | null
          id: string
          methodology: string | null
          metrics: Json | null
          paper: string | null
          uses_additional_data: boolean | null
        }
        Insert: {
          best_metric?: string | null
          best_rank?: number | null
          evaluated_on?: string | null
          evaluation?: string | null
          id?: string
          methodology?: string | null
          metrics?: Json | null
          paper?: string | null
          uses_additional_data?: boolean | null
        }
        Update: {
          best_metric?: string | null
          best_rank?: number | null
          evaluated_on?: string | null
          evaluation?: string | null
          id?: string
          methodology?: string | null
          metrics?: Json | null
          paper?: string | null
          uses_additional_data?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "result_evaluation_fkey"
            columns: ["evaluation"]
            isOneToOne: false
            referencedRelation: "evaluation"
            referencedColumns: ["id"]
          },
        ]
      }
      task: {
        Row: {
          area: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          area: string
          description?: string | null
          id: string
          name: string
        }
        Update: {
          area?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_area_fkey"
            columns: ["area"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      evaluation_count: {
        Row: {
          dataset: string | null
          description: string | null
          id: string | null
          task: string | null
          total: number | null
          year_2020: number | null
          year_2021: number | null
          year_2022: number | null
          year_2023: number | null
          year_2024: number | null
        }
        Relationships: []
      }
      methodology: {
        Row: {
          area: string[] | null
          evaluation_dates: string[] | null
          id: string | null
          methodology: string | null
          paper: string | null
        }
        Relationships: []
      }
      task_count: {
        Row: {
          area: string | null
          description: string | null
          id: string | null
          name: string | null
          total: number | null
          year_2020: number | null
          year_2021: number | null
          year_2022: number | null
          year_2023: number | null
          year_2024: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_area_fkey"
            columns: ["area"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      crosstab: {
        Args: {
          "": string
        }
        Returns: Record<string, unknown>[]
      }
      crosstab2: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_2"][]
      }
      crosstab3: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_3"][]
      }
      crosstab4: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_4"][]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      tablefunc_crosstab_2: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
      }
      tablefunc_crosstab_3: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
      }
      tablefunc_crosstab_4: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
        category_4: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
