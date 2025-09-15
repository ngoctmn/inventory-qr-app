'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'

const Scanner = dynamic(() => import('@/components/Scanner'), { ssr: false })

export default function ScanPage() {
    const [scanning, setScanning] = useState(false)
    const [assetData, setAssetData] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [cycle, setCycle] = useState<any>(null)
    const [formData, setFormData] = useState({
        actualLocation: '',
        condition: 'Good',
        notes: '',
        inspector: ''
    })

    useEffect(() => {
        loadActiveCycle()
        // Get inspector name from localStorage
        const savedInspector = localStorage.getItem('inspector_name')
        if (savedInspector) {
            setFormData(prev => ({ ...prev, inspector: savedInspector }))
        }
    }, [])

    const loadActiveCycle = async () => {
        try {
            const res = await fetch('/api/cycles?active=true')
            const data = await res.json()
            if (data.data) {
                setCycle(data.data)
            } else {
                toast.error('Chưa có kỳ kiểm kê nào đang hoạt động')
            }
        } catch (error) {
            toast.error('Lỗi tải thông tin kỳ kiểm kê')
        }
    }

    const handleScanResult = async (result: string) => {
        if (!cycle) {
            toast.error('Vui lòng tạo kỳ kiểm kê trước')
            return
        }

        // Extract asset ID from QR code
        const assetId = result.trim()

        // Fetch asset details
        try {
            const res = await fetch(`/api/assets?search=${assetId}&limit=1`)
            const data = await res.json()

            if (data.data && data.data.length > 0) {
                setAssetData(data.data[0])
                setFormData(prev => ({
                    ...prev,
                    actualLocation: data.data[0].location || ''
                }))
                setShowModal(true)
            } else {
                toast.error(`Không tìm thấy tài sản: ${assetId}`)
            }
        } catch (error) {
            toast.error('Lỗi tải thông tin tài sản')
        }
    }

    const handleConfirmScan = async () => {
        if (!formData.inspector) {
            toast.error('Vui lòng nhập tên người kiểm kê')
            return
        }

        // Save inspector name
        localStorage.setItem('inspector_name', formData.inspector)

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId: assetData.asset_id,
                    cycleId: cycle.cycle_id,
                    inspector: formData.inspector,
                    location: assetData.location,
                    actualLocation: formData.actualLocation,
                    condition: formData.condition,
                    notes: formData.notes
                })
            })

            const data = await res.json()

            if (res.status === 409) {
                toast.error('Tài sản này đã được kiểm kê trong kỳ này')
            } else if (data.data) {
                toast.success(`Đã kiểm kê: ${assetData.name_vi || assetData.asset_id}`)
            } else {
                toast.error(data.error?.message || 'Lỗi xác nhận kiểm kê')
            }

            setShowModal(false)
            setAssetData(null)
            // Continue scanning
            setTimeout(() => setScanning(true), 500)
        } catch (error) {
            toast.error('Lỗi kết nối server')
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Quét Mã QR</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Quét mã QR trên tem tài sản để kiểm kê
                </p>
            </div>

            {cycle ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Scanner Section */}
                    <div className="card">
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Người kiểm kê
                                </label>
                                <input
                                    type="text"
                                    value={formData.inspector}
                                    onChange={(e) => setFormData(prev => ({ ...prev, actualLocation: e.target.value }))}
                                    className="input-field"
                                    placeholder="Nhập vị trí hiện tại..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tình trạng
                                </label>
                                <select
                                    value={formData.condition}
                                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                                    className="input-field"
                                >
                                    <option value="Good">Tốt</option>
                                    <option value="Fair">Bình thường</option>
                                    <option value="Poor">Kém</option>
                                    <option value="Damaged">Hư hỏng</option>
                                    <option value="Lost">Mất</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    className="input-field"
                                    rows={3}
                                    placeholder="Ghi chú thêm (nếu có)..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setAssetData(null)
                                    setTimeout(() => setScanning(true), 500)
                                }}
                                className="btn-secondary"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmScan}
                                className="btn-primary"
                            >
                                Xác nhận kiểm kê
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}={ (e) => setFormData(prev => ({ ...prev, inspector: e.target.value })) }
placeholder = "Nhập tên người kiểm kê..."
className = "input-field"
    />
              </div >

    {!scanning ? (
        <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <button
                onClick={() => setScanning(true)}
                disabled={!formData.inspector}
                className="btn-primary"
            >
                Bắt đầu quét
            </button>
            {!formData.inspector && (
                <p className="mt-2 text-sm text-red-600">
                    Vui lòng nhập tên người kiểm kê trước
                </p>
            )}
        </div>
    ) : (
        <div>
            <Scanner
                onScanSuccess={handleScanResult}
                onScanError={(error) => console.error(error)}
            />
            <button
                onClick={() => setScanning(false)}
                className="mt-4 w-full btn-secondary"
            >
                Dừng quét
            </button>
        </div>
    )}
            </div >
          </div >

    {/* Instructions */ }
    < div className = "card" >
        <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Hướng dẫn quét</h2>

            <div className="space-y-4">
                <div className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                        1
                    </span>
                    <p className="ml-3 text-sm text-gray-600">
                        Nhập tên người kiểm kê (chỉ cần nhập 1 lần)
                    </p>
                </div>

                <div className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                        2
                    </span>
                    <p className="ml-3 text-sm text-gray-600">
                        Nhấn "Bắt đầu quét" và cho phép quyền sử dụng camera
                    </p>
                </div>

                <div className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                        3
                    </span>
                    <p className="ml-3 text-sm text-gray-600">
                        Hướng camera vào mã QR trên tem tài sản
                    </p>
                </div>

                <div className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                        4
                    </span>
                    <p className="ml-3 text-sm text-gray-600">
                        Xác nhận thông tin và tình trạng tài sản
                    </p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Mẹo:</strong> Giữ camera cách mã QR khoảng 15-20cm và đảm bảo đủ ánh sáng
                </p>
            </div>
        </div>
          </ >
        </div >
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
                Vui lòng tạo kỳ kiểm kê mới để bắt đầu quét
            </p>
            <a href="/" className="btn-primary">
                Về Dashboard
            </a>
        </div>
    </div>
)}

{/* Asset Info Modal */ }
{
    showModal && assetData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Xác nhận kiểm kê tài sản
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Mã tài sản</p>
                        <p className="font-semibold">{assetData.asset_id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tên tài sản</p>
                        <p className="font-semibold">{assetData.name_vi || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Model</p>
                        <p className="font-semibold">{assetData.model || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Serial</p>
                        <p className="font-semibold">{assetData.serial || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Bộ phận</p>
                        <p className="font-semibold">{assetData.department || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Vị trí gốc</p>
                        <p className="font-semibold">{assetData.location || '-'}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vị trí thực tế
                        </label>
                        <input
                            type="text"
                            value={formData.actualLocation}
                            onChange