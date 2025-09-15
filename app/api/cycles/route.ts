import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse, InventoryCycle } from '@/lib/types'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const active = searchParams.get('active')

        if (active === 'true') {
            const { data, error } = await db.getActiveCycle()

            if (error && error.code !== 'PGRST116') { // Not found error
                return NextResponse.json<ApiResponse<null>>({
                    error: { message: error.message }
                }, { status: 400 })
            }

            return NextResponse.json<ApiResponse<InventoryCycle>>({
                data
            })
        }

        // Get all cycles
        const { data, error } = await db.supabase
            .from('inventory_cycles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        return NextResponse.json<ApiResponse<InventoryCycle[]>>({
            data
        })
    } catch (error) {
        console.error('GET /api/cycles error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, description } = body

        if (!name) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Cycle name is required' }
            }, { status: 400 })
        }

        const { data, error } = await db.createCycle(name, description)

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        return NextResponse.json<ApiResponse<InventoryCycle>>({
            data
        })
    } catch (error) {
        console.error('POST /api/cycles error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { cycleId, ...updates } = body

        if (!cycleId) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Cycle ID is required' }
            }, { status: 400 })
        }

        // If activating a cycle, deactivate others first
        if (updates.is_active === true) {
            await db.supabase
                .from('inventory_cycles')
                .update({ is_active: false })
                .eq('is_active', true)
        }

        const { data, error } = await db.supabase
            .from('inventory_cycles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('cycle_id', cycleId)
            .select()
            .single()

        if (error) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: error.message }
            }, { status: 400 })
        }

        return NextResponse.json<ApiResponse<InventoryCycle>>({
            data
        })
    } catch (error) {
        console.error('PUT /api/cycles error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}

// Stats endpoint
export async function GET_STATS(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const cycleId = searchParams.get('cycleId')

        if (!cycleId) {
            return NextResponse.json<ApiResponse<null>>({
                error: { message: 'Cycle ID is required' }
            }, { status: 400 })
        }

        const { cycle, deptStats } = await db.getCycleStats(cycleId)

        return NextResponse.json<ApiResponse<any>>({
            data: { cycle, departmentStats: deptStats }
        })
    } catch (error) {
        console.error('GET /api/cycles/stats error:', error)
        return NextResponse.json<ApiResponse<null>>({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}