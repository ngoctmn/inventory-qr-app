import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'x-application-name': 'inventory-qr-app'
        }
    }
})

// Helper functions
export const db = {
    // Assets
    async getAssets(filters?: {
        search?: string
        department?: string
        location?: string
        status?: string
        checked?: boolean
        cycleId?: string
        page?: number
        limit?: number
    }) {
        let query = supabase
            .from('v_asset_inventory_status')
            .select('*', { count: 'exact' })

        if (filters?.search) {
            query = query.or(`asset_id.ilike.%${filters.search}%,name_vi.ilike.%${filters.search}%,name_en.ilike.%${filters.search}%,model.ilike.%${filters.search}%,serial.ilike.%${filters.search}%`)
        }

        if (filters?.department) {
            query = query.eq('department', filters.department)
        }

        if (filters?.location) {
            query = query.eq('location', filters.location)
        }

        if (filters?.status) {
            query = query.eq('status', filters.status)
        }

        if (filters?.checked !== undefined) {
            query = query.eq('is_checked', filters.checked)
        }

        if (filters?.cycleId) {
            query = query.eq('cycle_id', filters.cycleId)
        }

        const page = filters?.page || 1
        const limit = filters?.limit || 50
        const from = (page - 1) * limit
        const to = from + limit - 1

        query = query.range(from, to).order('asset_id', { ascending: true })

        return await query
    },

    // Cycles
    async getActiveCycle() {
        const { data, error } = await supabase
            .from('inventory_cycles')
            .select('*')
            .eq('is_active', true)
            .single()

        return { data, error }
    },

    async createCycle(name: string, description?: string) {
        // Deactivate all cycles first
        await supabase
            .from('inventory_cycles')
            .update({ is_active: false })
            .eq('is_active', true)

        // Create new active cycle
        const { data, error } = await supabase
            .from('inventory_cycles')
            .insert({
                name,
                description,
                is_active: true,
                start_at: new Date().toISOString(),
                total_assets: 0,
                checked_assets: 0
            })
            .select()
            .single()

        // Update total assets count
        if (data) {
            const { count } = await supabase
                .from('assets')
                .select('*', { count: 'exact', head: true })

            await supabase
                .from('inventory_cycles')
                .update({ total_assets: count || 0 })
                .eq('cycle_id', data.cycle_id)
        }

        return { data, error }
    },

    // Inventory Logs
    async createInventoryLog(log: {
        asset_id: string
        cycle_id: string
        inspector: string
        scan_location?: string
        actual_location?: string
        condition?: string
        notes?: string
    }) {
        // Check for duplicate first
        const { data: existing } = await supabase
            .from('inventory_logs')
            .select('id')
            .eq('asset_id', log.asset_id)
            .eq('cycle_id', log.cycle_id)
            .single()

        if (existing) {
            return { data: null, error: { message: 'Duplicate scan', isDuplicate: true } }
        }

        const { data, error } = await supabase
            .from('inventory_logs')
            .insert(log)
            .select()
            .single()

        // Log activity
        if (data) {
            await supabase
                .from('activity_logs')
                .insert({
                    action: 'scan',
                    entity_type: 'asset',
                    entity_id: log.asset_id,
                    user_name: log.inspector,
                    details: { cycle_id: log.cycle_id, location: log.actual_location }
                })
        }

        return { data, error }
    },

    // Activity Logs
    async getRecentActivities(limit = 10) {
        const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)

        return { data, error }
    },

    // Stats
    async getCycleStats(cycleId: string) {
        const { data: cycle } = await supabase
            .from('inventory_cycles')
            .select('*')
            .eq('cycle_id', cycleId)
            .single()

        const { data: deptStats } = await supabase
            .from('v_department_stats')
            .select('*')
            .eq('cycle_id', cycleId)

        return { cycle, deptStats }
    },

    // Bulk operations
    async upsertAssets(assets: any[]) {
        const { data, error } = await supabase
            .from('assets')
            .upsert(assets, {
                onConflict: 'asset_id',
                ignoreDuplicates: false
            })
            .select()

        // Log activity
        if (data) {
            await supabase
                .from('activity_logs')
                .insert({
                    action: 'upload',
                    entity_type: 'assets',
                    entity_id: `${data.length} assets`,
                    details: { count: data.length }
                })
        }

        return { data, error }
    }
}