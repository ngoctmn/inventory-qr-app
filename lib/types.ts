export interface Asset {
    id?: string
    asset_id: string
    name_vi?: string
    name_en?: string
    type?: string
    model?: string
    serial?: string
    tech_code?: string
    start_date?: string
    usage_period?: number
    end_date?: string
    customer?: string
    supplier?: string
    source?: string
    department?: string
    location?: string
    status?: string
    initial_value?: number
    current_value?: number
    notes?: string
    created_at?: string
    updated_at?: string
    // From view
    is_checked?: boolean
    cycle_id?: string
    scan_time?: string
    inspector?: string
    actual_location?: string
    checked_condition?: string
}

export interface InventoryCycle {
    cycle_id: string
    name: string
    description?: string
    start_at: string
    end_at?: string
    is_active: boolean
    total_assets: number
    checked_assets: number
    created_by?: string
    created_at: string
    updated_at: string
}

export interface InventoryLog {
    id: string
    asset_id: string
    cycle_id: string
    inspector: string
    scan_time: string
    scan_location?: string
    actual_location?: string
    condition?: string
    notes?: string
    photo_url?: string
    is_duplicate: boolean
    month_key: string
    created_at: string
}

export interface ActivityLog {
    id: string
    action: string
    entity_type?: string
    entity_id?: string
    user_name?: string
    details?: any
    created_at: string
}

export interface DepartmentStats {
    department: string
    cycle_id: string
    cycle_name: string
    total_assets: number
    checked_assets: number
    progress_percent: number
}

export interface Database {
    public: {
        Tables: {
            assets: {
                Row: Asset
                Insert: Omit<Asset, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Asset, 'id'>>
            }
            inventory_cycles: {
                Row: InventoryCycle
                Insert: Omit<InventoryCycle, 'cycle_id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<InventoryCycle, 'cycle_id'>>
            }
            inventory_logs: {
                Row: InventoryLog
                Insert: Omit<InventoryLog, 'id' | 'created_at' | 'month_key'>
                Update: Partial<Omit<InventoryLog, 'id'>>
            }
            activity_logs: {
                Row: ActivityLog
                Insert: Omit<ActivityLog, 'id' | 'created_at'>
                Update: Partial<Omit<ActivityLog, 'id'>>
            }
        }
        Views: {
            v_asset_inventory_status: {
                Row: Asset
            }
            v_department_stats: {
                Row: DepartmentStats
            }
        }
    }
}

export interface ApiResponse<T> {
    data?: T
    error?: {
        message: string
        details?: any
    }
    count?: number
}