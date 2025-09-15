import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { mapExcelColumns } from '@/lib/utils'
import type { ApiResponse, Asset } from '@/lib/types'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { assets: rawAssets, cycleId } = body

        if (!rawAssets || !Array.isArray(rawAssets)) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Invalid assets data' }
            }, { status: 400 })
        }

        // Map Excel columns to database columns
        const mappedAssets = mapExcelColumns(rawAssets)

        // Validate required fields
        const validAssets = mappedAssets.filter(asset => asset.asset_id)

        if (validAssets.length === 0) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'No valid assets found. Please check the asset_id column.' }
            }, { status: 400 })
        }

        // Process dates and numbers
        const processedAssets = validAssets.map(asset => ({
            ...asset,
            start_date: asset.start_date ? new Date(asset.start_date).toISOString().split('T')[0] : null,
            end_date: asset.end_date ? new Date(asset.end_date).toISOString().split('T')[0] : null,
            usage_period: asset.usage_period ? parseInt(asset.usage_period) : null,
            initial_value: asset.initial_value ? parseFloat(asset.initial_value) : null,
            current_value: asset.current_value ? parseFloat(asset.current_value) : null,
            updated_at: new Date().toISOString()
        }))

        // Upsert assets
        const { data, error } = await db.upsertAssets(processedAssets)

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        // Update cycle total assets if cycleId provided
        if (cycleId) {
            const { count } = await db.supabase
                .from('assets')
                .select('*', { count: 'exact', head: true })

            await db.supabase
                .from('inventory_cycles')
                .update({
                    total_assets: count || 0,
                    updated_at: new Date().toISOString()
                })
                .eq('cycle_id', cycleId)
        }

        return NextResponse.json<ApiResponse<{ count: number, assets: Asset[] }>>({
            data: {
                count: data?.length || 0,
                assets: data || []
            }
        })
    } catch (error) {
        console.error('POST /api/upload-assets error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Failed to upload assets', details: error }
        }, { status: 500 })
    }
}