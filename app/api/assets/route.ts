import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse, Asset } from '@/lib/types'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams

        const filters = {
            search: searchParams.get('search') || undefined,
            department: searchParams.get('department') || undefined,
            location: searchParams.get('location') || undefined,
            status: searchParams.get('status') || undefined,
            checked: searchParams.get('checked') === 'true' ? true :
                searchParams.get('checked') === 'false' ? false : undefined,
            cycleId: searchParams.get('cycleId') || undefined,
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '50')
        }

        const { data, error, count } = await db.getAssets(filters)

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        return NextResponse.json<ApiResponse<Asset[]>>({
            data,
            count: count || 0
        })
    } catch (error) {
        console.error('GET /api/assets error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { asset_id, ...updates } = body

        if (!asset_id) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Asset ID is required' }
            }, { status: 400 })
        }

        const { data, error } = await db.supabase
            .from('assets')
            .update(updates)
            .eq('asset_id', asset_id)
            .select()
            .single()

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        return NextResponse.json<ApiResponse<Asset>>({
            data
        })
    } catch (error) {
        console.error('PUT /api/assets error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}