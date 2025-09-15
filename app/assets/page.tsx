'use client'

import { useState, useEffect } from 'react'
import { AssetTable } from '@/components/AssetTable'
import { FilterBar } from '@/components/FilterBar'
import toast from 'react-hot-toast'

export default function AssetsPage() {
    const [assets, setAssets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        location: '',
        status: '',
        checked: ''
    })
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0
    })
    const [cycle, setCycle] = useState<any>(null)

    useEffect(() => {
        loadActiveCycle()
    }, [])

    useEffect(() => {
        loadAssets()
    }, [filters, pagination.page])

    const loadActiveCycle = async () => {
        try {
            const res = await fetch('/api/cycles?active=true')
            const data = await res.json()
            if (data.data) {
                setCycle(data.data)
            }
        } catch (error) {
            console.error('Error loading cycle:', error)
        }
    }

    const loadAssets = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            if (filters.search) params.append('search', filters.search)
            if (filters.department) params.append('department', filters.department)
            if (filters.location) params.append('location', filters.location)
            if (filters.status) params.append('status', filters.status)
            if (filters.checked) params.append('checked', filters.checked)
            if (cycle?.cycle_id) params.append('cycleId', cycle.cycle_id)

            params.append('page', pagination.page.toString())
            params.append('limit', pagination.limit.toString())

            const res = await fetch(`/api/assets?${params}`)
            const data = await res.json()

            if (data.data) {
                setAssets(data.data)
                setPagination(prev => ({ ...prev, total: data.count || 0 }))
            }
        } catch (error) {
            toast.error('Lỗi tải danh sách tài sản')
            console.error('Error loading assets:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters)
        setPagination(prev => ({ ...prev, page: 1 }))
    }

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }))
    }

    const totalPages = Math.ceil(pagination.total / pagination.limit)

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Danh Sách Tài Sản</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Quản lý và theo dõi tình trạng kiểm kê tài sản
                </p>
            </div>

            {/* Filter Bar */}
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <p className="text-sm text-gray-500">Tổng tài sản</p>
                    <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-gray-500">Đã kiểm kê</p>
                    <p className="text-2xl font-bold text-emerald-600">
                        {assets.filter(a => a.is_checked).length}
                    </p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-gray-500">Chưa kiểm kê</p>
                    <p className="text-2xl font-bold text-orange-600">
                        {assets.filter(a => !a.is_checked).length}
                    </p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-gray-500">Tiến độ</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {pagination.total > 0
                            ? Math.round((assets.filter(a => a.is_checked).length / pagination.total) * 100)
                            : 0}%
                    </p>
                </div>
            </div>

            {/* Assets Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    <AssetTable assets={assets} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Hiển thị {((pagination.page - 1) * pagination.limit) + 1} -{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số{' '}
                                {pagination.total} tài sản
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    Trước
                                </button>

                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    const pageNum = i + 1
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 rounded ${pagination.page === pageNum
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}

                                {totalPages > 5 && <span className="px-2">...</span>}

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === totalPages}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}