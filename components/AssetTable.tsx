interface AssetTableProps {
    assets: any[]
}

export function AssetTable({ assets }: AssetTableProps) {
    if (!assets || assets.length === 0) {
        return (
            <div className="card p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500">Không có dữ liệu tài sản</p>
            </div>
        )
    }

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kiểm kê
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã TS
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên tài sản
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Model
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Serial
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bộ phận
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vị trí
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assets.map((asset) => (
                            <tr
                                key={asset.asset_id}
                                className={asset.is_checked ? 'bg-emerald-50' : ''}
                            >
                                <td className="px-3 py-3 whitespace-nowrap">
                                    {asset.is_checked ? (
                                        <span className="inline-flex items-center">
                                            <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <span className="font-medium text-gray-900">{asset.asset_id}</span>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {asset.name_vi || '-'}
                                        </div>
                                        {asset.name_en && (
                                            <div className="text-xs text-gray-500">{asset.name_en}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {asset.model || '-'}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {asset.serial || '-'}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {asset.department || '-'}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm text-gray-900">
                                            {asset.location || '-'}
                                        </div>
                                        {asset.actual_location && asset.actual_location !== asset.location && (
                                            <div className="text-xs text-orange-600">
                                                Thực tế: {asset.actual_location}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                    ${asset.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    ${asset.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : ''}
                    ${asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${asset.status === 'Disposed' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                                        {asset.status || 'N/A'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}