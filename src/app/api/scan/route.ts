import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const scanPath = body.path || '/data'
    
    if (!scanPath.startsWith('/data')) {
      return NextResponse.json({ error: '只能扫描 /data 目录' }, { status: 403 })
    }

    const { stdout } = await execAsync(`find "${scanPath}" -type f -iname "*.iso" 2>/dev/null | head -200`)

    const files = stdout.trim().split('\n').filter(f => f).map(filePath => {
      const name = filePath.split('/').pop() || ''
      return { name, path: filePath, size: '' }
    })

    return NextResponse.json({ path: scanPath, count: files.length, files })
  } catch (error) {
    return NextResponse.json({ error: '扫描失败: ' + String(error) }, { status: 500 })
  }
}
