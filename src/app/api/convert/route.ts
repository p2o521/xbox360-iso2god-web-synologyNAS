import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const { filePath, outputPath } = body
    
    if (!filePath || !filePath.startsWith('/data')) {
      return NextResponse.json({ error: '无效的文件路径' }, { status: 400 })
    }
    if (!outputPath || !outputPath.startsWith('/data')) {
      return NextResponse.json({ error: '无效的输出路径' }, { status: 400 })
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'ISO 文件不存在' }, { status: 404 })
    }

    const iso2godPath = '/app/tools/iso2god'
    if (!fs.existsSync(iso2godPath)) {
      return NextResponse.json({ error: 'iso2god 工具未安装' }, { status: 500 })
    }

    const isoName = path.basename(filePath, '.iso')
    const godOutputPath = path.join(outputPath, isoName)

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
    }

    const command = `${iso2godPath} "${filePath}" "${godOutputPath}"`
    console.log(`执行转换: ${command}`)
    
    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 600000 })
      console.log('转换输出:', stdout)
      if (stderr) console.log('转换错误:', stderr)

      if (fs.existsSync(godOutputPath)) {
        return NextResponse.json({ success: true, output: godOutputPath, message: '转换成功', log: stdout + stderr })
      } else {
        return NextResponse.json({ error: '转换完成但未生成输出目录', log: stdout + stderr }, { status: 500 })
      }
    } catch (execError: unknown) {
      const err = execError as { message?: string; stdout?: string; stderr?: string }
      return NextResponse.json({ error: '转换失败: ' + (err.message || String(execError)), log: (err.stdout || '') + (err.stderr || '') }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: '处理失败: ' + String(error) }, { status: 500 })
  }
}
