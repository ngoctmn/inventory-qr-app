import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const mode = searchParams.get('mode') || 'all' // all, checked, unchecked
        const cycleId = searchParams.get('cycleId')

        if (!cycleId) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Cycle ID is required' }
            }, { status: 400 })
        }

        // Get cycle info
        const { data: cycle } = await db.supabase
            .from('inventory_cycles')
            .select('*')
            .eq('cycle_id', cycleId)
            .single()

        if (!cycle) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Cycle not found' }
            }, { status: 404 })
        }

        // Build query based on mode
        let query = db.supabase
            .from('v_asset_inventory_status')
            .select('*')

        if (mode === 'checked') {
            query = query.eq('is_checked', true).eq('cycle_id', cycleId)
        } else if (mode === 'unchecked') {
            query = query.or(`is_checked.eq.false,cycle_id.is.null`)
        }

        const { data: assets, error } = await query.order('asset_id')

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        // Format data for Excel export
        const exportData = assets?.map(asset => ({
            'Mã tài sản': asset.asset_id,
            'Tên tiếng Việt': asset.name_vi || '',
            'Tên tiếng Anh': asset.name_en || '',
            'Loại': asset.type || '',
            'Model': asset.model || '',
            'Serial': asset.serial || '',
            'Mã kỹ thuật': asset.tech_code || '',
            'Ngày bắt đầu': asset.start_date || '',
            'Thời gian SD': asset.usage_period || '',
            'Ngày kết thúc': asset.end_date || '',
            'Khách hàng': asset.customer || '',
            'Nhà cung cấp': asset.supplier || '',
            'Nguồn': asset.source || '',
            'Bộ phận': asset.department || '',
            'Vị trí': asset.location || '',
            'Vị trí thực tế': asset.actual_location || '',
            'Trạng thái': asset.status || '',
            'Tình trạng kiểm kê': asset.checked_condition || '',
            'Đã kiểm kê': asset.is_checked ? 'Có' : 'Chưa',
            'Người kiểm': asset.inspector || '',
            'Thời gian kiểm': asset.scan_time || '',
            'Giá trị ban đầu': asset.initial_value || '',
            'Giá trị hiện tại': asset.current_value || '',
            'Ghi chú': asset.notes || ''
        }))

        return NextResponse.json<ApiResponse<any>>({
            data: {
                cycle: {
                    name: cycle.name,
                    start_at: cycle.start_at,
                    total_assets: cycle.total_assets,
                    checked_assets: cycle.checked_assets
                },
                assets: exportData,
                mode,
                exportDate: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('GET /api/export error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}