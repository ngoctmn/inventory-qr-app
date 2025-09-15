'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

export default function ExportPage() {
    const [cycle, setCycle] = useState<any>(null)
    const [exporting, setExporting] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        checked: 0,
        unchecked: 0
    })

    useEffect(() => {
        loadActiveCycle()
    }, [])

    const loadActiveCycle = async () => {
        try {
            const res = await fetch('/api/cycles?active=true')
            const data = await res.json()

            if (data.data) {
                setCycle(data.data)
                setStats({
                    total: data.data.total_assets || 0,
                    checked: data.data.checked_assets || 0,
                    unchecked: (data.data.total_assets || 0) - (data.data.checked_assets || 0)
                })
            }
        } catch (error) {
            toast.error('Lỗi tải thông tin kỳ kiểm kê')
        }
    }

    const handleExport = async (mode: 'all' | 'checked' | 'unchecked') => {
        if (!cycle) {
            toast.error('Chưa có kỳ kiểm kê nào đang hoạt động')
            return
        }

        setExporting(true)

        try {
            const res = await fetch(`/api/export?mode=${mode}&cycleId=${cycle.cycle_id}`)
            const data = await res.json()

            if (data.data && data.data.assets) {
                // Create workbook
                const ws = XLSX.utils.json_to_sheet(data.data.assets)
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, ws, 'Inventory')

                // Generate filename
                const date = new Date().toISOString().split('T')[0]
                const filename = `inventory_${mode}_${cycle.cycle_id}_${date}.xlsx`

                // Download file
                XLSX.writeFile(wb, filename)

                toast.success(`Đã export ${data.data.assets.length} tài sản`)
            } else {
                toast.error('Không có dữ liệu để export')
            }
        } catch (error) {
            toast.error('Lỗi export dữ liệu')
            console.error(error)
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Export Dữ Liệu</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Xuất dữ liệu kiểm kê ra file Excel
                </p>
            </div>

            {cycle ? (
                <>
                    {/* Cycle Info */}
                    <div className="card mb-8">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Thông tin kỳ kiểm kê</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Tên kỳ</p>
                                    <p className="text-lg font-semibold">{cycle.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                                    <p className="text-lg font-semibold">{formatDate(cycle.start_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tiến độ</p>
                                    <p className="text-lg font-semibold">
                                        {stats.checked} / {stats.total}
                                        ({stats.total > 0 ? Math.round((stats.checked / stats.total) * 100) : 0}%)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Export All */}
                        <div className="card">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1m4 0h10m-10 0a1 1 0 011-1h8a1 1 0 011 1m-9 0h10M5 10a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Tất cả tài sản</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Export toàn bộ danh sách tài sản kèm trạng thái kiểm kê
                                </p>
                                <div className="text-2xl font-bold text-blue-600 mb-4">
                                    {stats.total} tài sản
                                </div>
                                <button
                                    onClick={() => handleExport('all')}
                                    disabled={exporting}
                                    className="w-full btn-primary"
                                >
                                    {exporting ? 'Đang export...' : 'Export tất cả'}
                                </button>
                            </div>
                        </div>

                        {/* Export Checked */}
                        <div className="card">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Đã kiểm kê</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Export danh sách tài sản đã được kiểm kê trong kỳ
                                </p>
                                <div className="text-2xl font-bold text-emerald-600 mb-4">
                                    {stats.checked} tài sản
                                </div>
                                <button
                                    onClick={() => handleExport('checked')}
                                    disabled={exporting || stats.checked === 0}
                                    className="w-full btn-primary"
                                >
                                    {exporting ? 'Đang export...' : 'Export đã kiểm'}
                                </button>
                            </div>
                        </div>

                        {/* Export Unchecked */}
                        <div className="card">
                            <div className="p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mb-4">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Chưa kiểm kê</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Export danh sách tài sản chưa được kiểm kê
                                </p>
                                <div className="text-2xl font-bold text-orange-600 mb-4">
                                    {stats.unchecked} tài sản
                                </div>
                                <button
                                    onClick={() => handleExport('unchecked')}
                                    disabled={exporting || stats.unchecked === 0}
                                    className="w-full btn-primary"
                                >
                                    {exporting ? 'Đang export...' : 'Export chưa kiểm'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 card">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Hướng dẫn</h3>
                            <div className="prose prose-sm text-gray-600">
                                <ul className="space-y-2">
                                    <li>File export sẽ được tải về máy với định dạng Excel (.xlsx)</li>
                                    <li>Tên file chứa thông tin kỳ kiểm kê và ngày export</li>
                                    <li>Dữ liệu bao gồm thông tin chi tiết tài sản và trạng thái kiểm kê</li>
                                    <li>Có thể mở file bằng Excel, Google Sheets hoặc LibreOffice</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card">
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Chưa có kỳ kiểm kê
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Vui lòng tạo kỳ kiểm kê mới để export dữ liệu
                        </p>
                        <a href="/" className="btn-primary">
                            Về Dashboard
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}