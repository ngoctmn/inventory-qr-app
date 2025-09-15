import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse, InventoryLog } from '@/lib/types'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            assetId,
            cycleId,
            inspector,
            location,
            actualLocation,
            condition,
            notes
        } = body

        // Validate required fields
        if (!assetId || !cycleId || !inspector) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Missing required fields: assetId, cycleId, inspector' }
            }, { status: 400 })
        }

        // Check if asset exists
        const { data: asset, error: assetError } = await db.supabase
            .from('assets')
            .select('asset_id, name_vi, department, location')
            .eq('asset_id', assetId)
            .single()

        if (assetError || !asset) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: `Asset not found: ${assetId}` }
            }, { status: 404 })
        }

        // Create inventory log
        const { data, error } = await db.createInventoryLog({
            asset_id: assetId,
            cycle_id: cycleId,
            inspector,
            scan_location: location,
            actual_location: actualLocation || asset.location,
            condition: condition || 'Good',
            notes
        })

        // Check for duplicate
        if (error?.isDuplicate) {
            return NextResponse.json<ApiResponse<{ isDuplicate: boolean, asset: any }>>({
                data: {
                    isDuplicate: true,
                    asset
                },
                error: { message: 'This asset has already been scanned in this cycle' }
            }, { status: 409 }) // 409 Conflict
        }

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        // Update asset location if changed
        if (actualLocation && actualLocation !== asset.location) {
            await db.supabase
                .from('assets')
                .update({
                    location: actualLocation,
                    updated_at: new Date().toISOString()
                })
                .eq('asset_id', assetId)
        }

        return NextResponse.json<ApiResponse<{ log: InventoryLog, asset: any, isDuplicate: boolean }>>({
            data: {
                log: data,
                asset,
                isDuplicate: false
            }
        })
    } catch (error) {
        console.error('POST /api/scan error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const cycleId = searchParams.get('cycleId')
        const assetId = searchParams.get('assetId')

        if (!cycleId) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Cycle ID is required' }
            }, { status: 400 })
        }

        let query = db.supabase
            .from('inventory_logs')
            .select(`
        *,
        assets:asset_id (
          asset_id,
          name_vi,
          name_en,
          department,
          location
        )
      `)
            .eq('cycle_id', cycleId)
            .order('scan_time', { ascending: false })

        if (assetId) {
            query = query.eq('asset_id', assetId)
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        return NextResponse.json<ApiResponse<InventoryLog[]>>({
            data
        })
    } catch (error) {
        console.error('GET /api/scan error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}