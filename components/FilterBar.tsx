import { useState, useEffect } from 'react'
import { debounce } from '@/lib/utils'

interface FilterBarProps {
    filters: {
        search: string
        department: string
        location: string
        status: string
        checked: string
    }
    onFilterChange: (filters: any) => void
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
    const [localFilters, setLocalFilters] = useState(filters)

    // Debounce search input
    const debouncedSearch = debounce((value: string) => {
        onFilterChange({ ...localFilters, search: value })
    }, 500)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setLocalFilters(prev => ({ ...prev, search: value }))
        debouncedSearch(value)
    }

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value }
        setLocalFilters(newFilters)
        onFilterChange(newFilters)
    }

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            department: '',
            location: '',
            status: '',
            checked: ''
        }
        setLocalFilters(clearedFilters)
        onFilterChange(clearedFilters)
    }

    const hasActiveFilters = Object.values(localFilters).some(v => v !== '')

    return (
        <div className="card mb-6">
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <input
                                type="text"
                                value={localFilters.search}
                                onChange={handleSearchChange}
                                placeholder="Tìm theo mã, tên, model, serial..."
                                className="input-field pl-10"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <select
                            value={localFilters.department}
                            onChange={(e) => handleFilterChange('department', e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tất cả bộ phận</option>
                            <option value="IT">IT</option>
                            <option value="Admin">Admin</option>
                            <option value="Accounting">Accounting</option>
                            <option value="HR">HR</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <select
                            value={localFilters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tất cả vị trí</option>
                            <option value="Tầng 1">Tầng 1</option>
                            <option value="Tầng 2">Tầng 2</option>
                            <option value="Tầng 3">Tầng 3</option>
                            <option value="Kho">Kho</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <select
                            value={localFilters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Disposed">Disposed</option>
                        </select>
                    </div>

                    {/* Checked Status */}
                    <div>
                        <select
                            value={localFilters.checked}
                            onChange={(e) => handleFilterChange('checked', e.target.value)}
                            className="input-field"
                        >
                            <option value="">Tất cả</option>
                            <option value="true">Đã kiểm kê</option>
                            <option value="false">Chưa kiểm kê</option>
                        </select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Đang áp dụng bộ lọc
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}