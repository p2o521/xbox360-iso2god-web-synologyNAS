import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ISO2GOD - Xbox 360 ISO 转换工具',
  description: '将 Xbox 360 ISO 格式游戏转换为 GOD 格式'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}
