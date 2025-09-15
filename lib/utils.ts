// Excel column mappings - MATCHING GOOGLE SHEET EXACTLY
export const EXCEL_COLUMNS: { [key: string]: string } = {
    // English column names (from Google Sheet)
    'Code': 'asset_id',
    'NameVi': 'name_vi',
    'NameEn': 'name_en',
    'Type': 'type',
    'Model': 'model',
    'Serial': 'serial',
    'TechCode': 'tech_code',
    'StartDate': 'start_date',
    'UsagePeriod': 'usage_period',
    'EndDate': 'end_date',
    'Customer': 'customer',
    'Supplier': 'supplier',
    'Source': 'source',
    'Department': 'department',
    'Location': 'location',
    'Status': 'status',
    'InitialValue': 'initial_value',
    'CurrentValue': 'current_value',
    'Notes': 'notes',
    
    // Vietnamese column names (backup)
    'Mã tài sản': 'asset_id',
    'Tên tiếng Việt': 'name_vi',
    'Tên tiếng Anh': 'name_en',
    'Loại': 'type',
    'Số Serial': 'serial',
    'Mã kỹ thuật': 'tech_code',
    'Ngày bắt đầu': 'start_date',
    'Thời gian SD': 'usage_period',
    'Ngày kết thúc': 'end_date',
    'Khách hàng': 'customer',
    'Nhà cung cấp': 'supplier',
    'Nguồn': 'source',
    'Bộ phận': 'department',
    'Vị trí': 'location',
    'Trạng thái': 'status',
    'Giá trị ban đầu': 'initial_value',
    'Giá trị hiện tại': 'current_value',
    'Ghi chú': 'notes'
}

export function mapExcelColumns(excelData: any[]): any[] {
    return excelData.map(row => {
        const mappedRow: any = {}
        Object.keys(row).forEach(key => {
            const mappedKey = EXCEL_COLUMNS[key] || key.toLowerCase().replace(/\s+/g, '_')
            if (row[key] !== null && row[key] !== undefined && row[key] !== '') {
                mappedRow[mappedKey] = row[key]
            }
        })
        return mappedRow
    })
}

export function formatDate(date: string | Date): string {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('vi-VN')
}

export function formatCurrency(value: number): string {
    if (!value) return '0'
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value)
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}