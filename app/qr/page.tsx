'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import toast from 'react-hot-toast'

export default function QRPage() {
    const [assets, setAssets] = useState<any[]>([])
    const [selectedAssets, setSelectedAssets] = useState<string[]>([])
    const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        search: '',
        department: ''
    })

    useEffect(() => {
        loadAssets()
    }, [filters])

    const loadAssets = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.search) params.append('search', filters.search)
            if (filters.department) params.append('department', filters.department)
            params.append('limit', '100')

            const res = await fetch(`/api/assets?${params}`)
            const data = await res.json()

            if (data.data) {
                setAssets(data.data)
            }
        } catch (error) {
            toast.error('Lỗi tải danh sách tài sản')
        } finally {
            setLoading(false)
        }
    }

    const generateQRCodes = async () => {
        if (selectedAssets.length === 0) {
            toast.error('Vui lòng chọn tài sản để tạo mã QR')
            return
        }

        const codes: { [key: string]: string } = {}

        for (const assetId of selectedAssets) {
            try {
                const qrDataUrl = await QRCode.toDataURL(assetId, {
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                })
                codes[assetId] = qrDataUrl
            } catch (error) {
                console.error(`Error generating QR for ${assetId}:`, error)
            }
        }

        setQrCodes(codes)
        toast.success(`Đã tạo ${Object.keys(codes).length} mã QR`)
    }

    const handleSelectAll = () => {
        if (selectedAssets.length === assets.length) {
            setSelectedAssets([])
        } else {
            setSelectedAssets(assets.map(a => a.asset_id))
        }
    }

    const handleSelectAsset = (assetId: string) => {
        if (selectedAssets.includes(assetId)) {
            setSelectedAssets(selectedAssets.filter(id => id !== assetId))
        } else {
            setSelectedAssets([...selectedAssets, assetId])
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tạo Mã QR</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Tạo và in tem QR cho tài sản
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Asset Selection */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold">Chọn tài sản</h2>
                        </div>

                        <div className="p-4">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                placeholder="Tìm tài sản..."
                                className="input-field mb-4"
                            />

                            <div className="mb-4 flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedAssets.length === assets.length && assets.length > 0}
                                        onChange={handleSelectAll}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium">Chọn tất cả</span>
                                </label>
                                <span className="text-sm text-gray-500">
                                    Đã chọn: {selectedAssets.length}
                                </span>
                            </div>

                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner mx-auto"></div>
                                    </div>
                                ) : (
                                    assets.map(asset => (
                                        <label
                                            key={asset.asset_id}
                                            className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedAssets.includes(asset.asset_id)}
                                                onChange={() => handleSelectAsset(asset.asset_id)}
                                                className="mt-1 mr-3"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {asset.asset_id}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {asset.name_vi || asset.name_en || 'Không có tên'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {asset.department} - {asset.location}
                                                </p>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>

                            <button
                                onClick={generateQRCodes}
                                disabled={selectedAssets.length === 0}
                                className="mt-4 w-full btn-primary"
                            >
                                Tạo mã QR ({selectedAssets.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* QR Preview */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Xem trước tem QR</h2>
                            {Object.keys(qrCodes).length > 0 && (
                                <button
                                    onClick={handlePrint}
                                    className="btn-primary"
                                >
                                    <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    In tem
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {Object.keys(qrCodes).length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    <p className="text-gray-500">
                                        Chọn tài sản và nhấn "Tạo mã QR" để xem trước
                                    </p>
                                </div>
                            ) : (
                                <div id="printable-area" className="grid grid-cols-3 gap-4">
                                    {Object.entries(qrCodes).map(([assetId, qrDataUrl]) => {
                                        const asset = assets.find(a => a.asset_id === assetId)
                                        return (
                                            <div
                                                key={assetId}
                                                className="border border-gray-300 rounded-lg p-3 page-break-inside-avoid"
                                            >
                                                <img
                                                    src={qrDataUrl}
                                                    alt={`QR ${assetId}`}
                                                    className="w-full h-auto mb-2"
                                                />
                                                <div className="text-center space-y-1">
                                                    <p className="text-sm font-bold">{assetId}</p>
                                                    {asset && (
                                                        <>
                                                            <p className="text-xs text-gray-700">
                                                                {asset.name_vi || asset.name_en || '-'}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                Model: {asset.model || '-'}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                Serial: {asset.serial || '-'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {asset.department || '-'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {asset.location || '-'}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @media print {
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}</style>
        </div>
    )
}