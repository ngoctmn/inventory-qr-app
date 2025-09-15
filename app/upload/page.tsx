'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<any[]>([])
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
            toast.error('Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV')
            return
        }

        setFile(selectedFile)

        try {
            const data = await selectedFile.arrayBuffer()
            const workbook = XLSX.read(data)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            setPreview(jsonData.slice(0, 5)) // Preview first 5 rows
            toast.success(`Đã đọc ${jsonData.length} dòng dữ liệu`)
        } catch (error) {
            toast.error('Lỗi đọc file Excel')
            console.error(error)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            toast.error('Vui lòng chọn file')
            return
        }

        setUploading(true)

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            // Get active cycle
            const cycleRes = await fetch('/api/cycles?active=true')
            const cycleData = await cycleRes.json()

            const res = await fetch('/api/upload-assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assets: jsonData,
                    cycleId: cycleData.data?.cycle_id
                })
            })

            const result = await res.json()

            if (result.data) {
                toast.success(`Đã upload ${result.data.count} tài sản thành công`)
                setFile(null)
                setPreview([])
                if (fileInputRef.current) fileInputRef.current.value = ''
            } else {
                toast.error(result.error?.message || 'Lỗi upload dữ liệu')
            }
        } catch (error) {
            toast.error('Lỗi xử lý file')
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const downloadTemplate = async () => {
        try {
            const res = await fetch('/api/template')
            const data = await res.json()

            // Create workbook from template
            const ws = XLSX.utils.json_to_sheet(data.template)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'Template')

            // Download file
            XLSX.writeFile(wb, 'inventory_template.xlsx')
            toast.success('Đã tải template')
        } catch (error) {
            toast.error('Lỗi tải template')
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Upload Danh Sách Tài Sản</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Upload file Excel chứa danh sách tài sản cần kiểm kê
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="card">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Chọn File Excel</h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />

                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                                Chọn file
                            </label>

                            {file && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">
                                        Đã chọn: <span className="font-medium">{file.name}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Kích thước: {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="flex-1 btn-primary"
                            >
                                {uploading ? 'Đang upload...' : 'Upload'}
                            </button>

                            <button
                                onClick={downloadTemplate}
                                className="btn-secondary"
                            >
                                <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Tải Template
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="card">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Hướng dẫn</h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                                    1
                                </span>
                                <p className="ml-3 text-sm text-gray-600">
                                    Tải file template Excel mẫu bằng nút "Tải Template"
                                </p>
                            </div>

                            <div className="flex items-start">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                                    2
                                </span>
                                <p className="ml-3 text-sm text-gray-600">
                                    Điền thông tin tài sản vào file theo cấu trúc mẫu
                                </p>
                            </div>

                            <div className="flex items-start">
                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium">
                                    3
                                </span>
                                <p className="ml-3 text-sm text-gray-600">
                                    Chọn file đã điền và nhấn "Upload" để tải lên hệ thống
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Lưu ý:</strong> Cột "Mã tài sản" là bắt buộc và phải duy nhất cho mỗi tài sản
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            {preview.length > 0 && (
                <div className="mt-8 card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Xem trước dữ liệu</h3>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Object.keys(preview[0]).map((key) => (
                                        <th
                                            key={key}
                                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {preview.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value: any, i) => (
                                            <td key={i} className="px-3 py-2 text-sm text-gray-900">
                                                {value || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="mt-2 text-sm text-gray-500">
                            Hiển thị 5 dòng đầu tiên...
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}