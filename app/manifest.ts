import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Inventory QR System',
        short_name: 'Inventory QR',
        description: 'Hệ thống kiểm kê tài sản bằng mã QR',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
            }
        ],
        categories: ['business', 'productivity'],
        shortcuts: [
            {
                name: 'Quét QR',
                short_name: 'Scan',
                description: 'Quét mã QR tài sản',
                url: '/scan',
                icons: [{ src: '/icon-96.png', sizes: '96x96' }]
            },
            {
                name: 'Danh sách',
                short_name: 'Assets',
                description: 'Xem danh sách tài sản',
                url: '/assets',
                icons: [{ src: '/icon-96.png', sizes: '96x96' }]
            }
        ]
    }
}