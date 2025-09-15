import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
    title: 'Inventory QR System',
    description: 'Hệ thống kiểm kê tài sản bằng mã QR',
    manifest: '/manifest.json',
    applicationName: 'Inventory QR',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Inventory QR'
    },
    formatDetection: {
        telephone: false
    },
    openGraph: {
        type: 'website',
        siteName: 'Inventory QR System',
        title: 'Inventory QR System',
        description: 'Hệ thống kiểm kê tài sản bằng mã QR'
    }
}

export const viewport: Viewport = {
    themeColor: '#10b981',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi" className="h-full">
            <body className={`${inter.className} h-full bg-gray-50`}>
                <div className="min-h-full">
                    <nav className="bg-emerald-600 shadow-lg">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <a href="/" className="flex items-center">
                                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="ml-2 text-xl font-bold text-white">Inventory QR</span>
                                    </a>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        <a href="/" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                            Dashboard
                                        </a>
                                        <a href="/assets" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                            Danh sách
                                        </a>
                                        <a href="/scan" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                            Quét QR
                                        </a>
                                        <a href="/upload" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                            Upload
                                        </a>
                                        <a href="/qr" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                            Tạo QR
                                        </a>
                                        <a href="/export" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                                            Export
                                        </a>
                                    </div>
                                </div>
                                <div className="md:hidden">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-emerald-700 focus:outline-none"
                                        onClick={() => {
                                            const menu = document.getElementById('mobile-menu')
                                            menu?.classList.toggle('hidden')
                                        }}
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:hidden" id="mobile-menu">
                            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                <a href="/" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-emerald-700">
                                    Dashboard
                                </a>
                                <a href="/assets" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-emerald-700">
                                    Danh sách
                                </a>
                                <a href="/scan" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-emerald-700">
                                    Quét QR
                                </a>
                                <a href="/upload" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-emerald-700">
                                    Upload
                                </a>
                                <a href="/qr" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-emerald-700">
                                    Tạo QR
                                </a>
                                <a href="/export" className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-emerald-700">
                                    Export
                                </a>
                            </div>
                        </div>
                    </nav>

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            style: {
                                background: '#10b981',
                            },
                        },
                        error: {
                            style: {
                                background: '#ef4444',
                            },
                        },
                    }}
                />
            </body>
        </html>
    )
}