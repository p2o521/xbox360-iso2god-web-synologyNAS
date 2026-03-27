import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const dirPath = body.path || '/data'
    
    if (!dirPath.startsWith('/data')) {
      return NextResponse.json({ error: '只能访问 /data 目录' }, { status: 403 })
    }

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ error: '目录不存在' }, { status: 404 })
    }

    const items = fs.readdirSync(dirPath)
    const folders: Array<{ name: string; path: string; hasChildren: boolean }> = []
    const files: Array<{ name: string; path: string; size: string }> = []

    for (const item of items) {
      if (item.startsWith('.') || item === '@eaDir') continue
      
      const itemPath = path.join(dirPath, item)
      try {
        const stat = fs.statSync(itemPath)
        
        if (stat.isDirectory()) {
          const subItems = fs.readdirSync(itemPath).filter(i => !i.startsWith('.') && i !== '@eaDir')
          folders.push({ name: item, path: itemPath, hasChildren: subItems.length > 0 })
        } else if (stat.isFile() && item.toLowerCase().endsWith('.iso')) {
          files.push({ name: item, path: itemPath, size: formatSize(stat.size) })
        }
      } catch (e) {}
    }

    folders.sort((a, b) => a.name.localeCompare(b.name))
    files.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ path: dirPath, folders, files })
  } catch (error) {
    return NextResponse.json({ error: '读取目录失败: ' + String(error) }, { status: 500 })
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}
