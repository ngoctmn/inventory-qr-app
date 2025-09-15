import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      // Return empty array if table doesn't exist
      console.error('Activity logs error:', error)
      return NextResponse.json({
        data: []
      })
    }

    return NextResponse.json({
      data: data || []
    })
  } catch (error) {
    console.error('GET /api/activities error:', error)
    return NextResponse.json({
      data: []
    })
  }
}