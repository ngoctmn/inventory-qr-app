import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Template EXACTLY matching Google Sheet columns (English names)
        const template = [
            {
                'Code': 'TS001',
                'NameVi': 'Máy tính để bàn Dell',
                'NameEn': 'Dell Desktop Computer',
                'Type': 'IT Equipment',
                'Model': 'Optiplex 7090',
                'Serial': 'DL2024001',
                'TechCode': 'TECH-001',
                'StartDate': '2024-01-15',
                'UsagePeriod': 60,
                'EndDate': '2029-01-15',
                'Customer': 'Nội bộ',
                'Supplier': 'Dell Vietnam',
                'Source': 'Mua mới',
                'Department': 'IT',
                'Location': 'Tầng 2 - Phòng 201',
                'Status': 'Active',
                'InitialValue': 15000000,
                'CurrentValue': 12000000,
                'Notes': 'Máy cấu hình cao cho developer'
            },
            {
                'Code': 'TS002',
                'NameVi': 'Bàn làm việc',
                'NameEn': 'Office Desk',
                'Type': 'Furniture',
                'Model': 'IKEA-BEKANT',
                'Serial': '',
                'TechCode': '',
                'StartDate': '2023-06-01',
                'UsagePeriod': 120,
                'EndDate': '2033-06-01',
                'Customer': 'Nội bộ',
                'Supplier': 'IKEA',
                'Source': 'Mua mới',
                'Department': 'Admin',
                'Location': 'Tầng 3 - Phòng 301',
                'Status': 'Active',
                'InitialValue': 5000000,
                'CurrentValue': 4000000,
                'Notes': 'Bàn điều chỉnh độ cao'
            },
            {
                'Code': 'TS003',
                'NameVi': 'Máy in laser',
                'NameEn': 'Laser Printer',
                'Type': 'IT Equipment',
                'Model': 'HP LaserJet Pro M404n',
                'Serial': 'HP2024003',
                'TechCode': 'TECH-003',
                'StartDate': '2024-03-01',
                'UsagePeriod': 48,
                'EndDate': '2028-03-01',
                'Customer': 'Nội bộ',
                'Supplier': 'HP Vietnam',
                'Source': 'Mua mới',
                'Department': 'Accounting',
                'Location': 'Tầng 2 - Phòng 205',
                'Status': 'Active',
                'InitialValue': 8000000,
                'CurrentValue': 7000000,
                'Notes': 'Máy in chung cho phòng kế toán'
            }
        ]

        // Column descriptions
        const columnDescriptions = {
            'Code': 'Mã tài sản - Unique asset code (required)',
            'NameVi': 'Tên tiếng Việt',
            'NameEn': 'Tên tiếng Anh',
            'Type': 'Loại tài sản (IT Equipment, Furniture, etc.)',
            'Model': 'Model của thiết bị',
            'Serial': 'Số serial',
            'TechCode': 'Mã kỹ thuật',
            'StartDate': 'Ngày bắt đầu sử dụng (YYYY-MM-DD)',
            'UsagePeriod': 'Thời gian sử dụng (tháng)',
            'EndDate': 'Ngày kết thúc',
            'Customer': 'Khách hàng',
            'Supplier': 'Nhà cung cấp',
            'Source': 'Nguồn gốc',
            'Department': 'Bộ phận',
            'Location': 'Vị trí',
            'Status': 'Trạng thái (Active/Inactive)',
            'InitialValue': 'Giá trị ban đầu',
            'CurrentValue': 'Giá trị hiện tại',
            'Notes': 'Ghi chú'
        }

        return NextResponse.json({
            template,
            columnDescriptions,
            instructions: 'Use this template to upload assets. "Code" column is required and must be unique.'
        })
    } catch (error) {
        console.error('GET /api/template error:', error)
        return NextResponse.json({
            error: { message: 'Internal server error' }
        }, { status: 500 })
    }
}