'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface FolderItem { name: string; path: string; hasChildren: boolean }
interface FileItem { name: string; path: string; size: string }
interface TreeNode { name: string; path: string; hasChildren: boolean; expanded: boolean; children?: TreeNode[]; isLoading?: boolean }

export default function Home() {
  const [currentPath, setCurrentPath] = useState('/data')
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [treeRoot, setTreeRoot] = useState<TreeNode>({
    name: '根目录', path: '/data', hasChildren: true, expanded: false
  })

  const loadDirectory = async (path: string) => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/browse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      })
      const data = await res.json()
      if (data.folders) {
        setFolders(data.folders)
        setFiles(data.files)
        setCurrentPath(path)
      } else {
        setMessage(data.error || '加载失败')
      }
    } catch (err) {
      setMessage('加载失败: ' + String(err))
    }
    setLoading(false)
  }

  const toggleTreeNode = async (node: TreeNode, setNode: (n: TreeNode) => void) => {
    if (node.expanded) {
      setNode({ ...node, expanded: false })
    } else {
      setNode({ ...node, expanded: true, isLoading: true })
      try {
        const res = await fetch('/api/browse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: node.path })
        })
        const data = await res.json()
        if (data.folders) {
          const children: TreeNode[] = data.folders.map((f: FolderItem) => ({
            name: f.name, path: f.path, hasChildren: f.hasChildren, expanded: false
          }))
          setNode({ ...node, expanded: true, children, isLoading: false })
        } else {
          setNode({ ...node, expanded: true, children: [], isLoading: false })
        }
      } catch (err) {
        setNode({ ...node, expanded: true, isLoading: false })
      }
    }
  }

  const renderTreeNode = (node: TreeNode, setNode: (n: TreeNode) => void, depth: number = 0) => {
    return (
      <div key={node.path}>
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-gray-700 rounded ${currentPath === node.path ? 'bg-blue-900' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.hasChildren ? (
            <button onClick={() => toggleTreeNode(node, setNode)} className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white">
              {node.isLoading ? '⋯' : (node.expanded ? '▼' : '▶')}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <span onClick={() => loadDirectory(node.path)} className="flex items-center gap-2 flex-1">
            <span className="text-yellow-400">📁</span>
            <span className="text-sm">{node.name}</span>
          </span>
        </div>
        {node.expanded && node.children && node.children.length > 0 && (
          <div>
            {node.children.map((child, index) => {
              const updateChild = (newChild: TreeNode) => {
                const newChildren = [...(node.children || [])]
                newChildren[index] = newChild
                setNode({ ...node, children: newChildren })
              }
              return renderTreeNode(child, updateChild, depth + 1)
            })}
          </div>
        )}
      </div>
    )
  }

  const scanRecursive = async () => {
    setLoading(true)
    setMessage('正在扫描...')
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath })
      })
      const data = await res.json()
      if (data.files) {
        setFiles(data.files)
        setMessage(`找到 ${data.files.length} 个 ISO 文件`)
      } else {
        setMessage(data.error || '扫描失败')
      }
    } catch (err) {
      setMessage('扫描失败: ' + String(err))
    }
    setLoading(false)
  }

  const convertFile = async (filePath: string) => {
    setLoading(true)
    setMessage('正在转换: ' + filePath.split('/').pop())
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, outputPath: currentPath })
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✓ 转换成功: ' + data.output)
      } else {
        setMessage('✗ ' + (data.error || '转换失败'))
      }
    } catch (err) {
      setMessage('✗ 转换失败: ' + String(err))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDirectory('/data')
    toggleTreeNode(treeRoot, setTreeRoot)
  }, [])

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold">Xbox 360 ISO 转 GOD</h1>
        <p className="text-sm text-gray-400 mt-1">点击左侧文件夹浏览，选择 ISO 文件进行转换</p>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 bg-gray-850 border-r border-gray-700 overflow-y-auto">
          <div className="p-3 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-gray-400">文件夹浏览</h2>
          </div>
          <div className="py-2">{renderTreeNode(treeRoot, setTreeRoot)}</div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">当前目录:</span>
              <span className="text-sm font-mono bg-gray-700 px-3 py-1 rounded">{currentPath}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => loadDirectory(currentPath)} disabled={loading} variant="outline" size="sm">刷新</Button>
              <Button onClick={scanRecursive} disabled={loading} size="sm">{loading ? '扫描中...' : '递归扫描 ISO'}</Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {message && <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-700 text-center">{message}</div>}

            {folders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">文件夹 ({folders.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {folders.map((folder) => (
                    <button key={folder.path} onClick={() => loadDirectory(folder.path)} className="flex items-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-left">
                      <span className="text-yellow-400">📁</span>
                      <span className="text-sm truncate">{folder.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">ISO 文件 ({files.length})</h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.path} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-blue-400 text-xl">💿</span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-400 truncate">{file.path}</p>
                        </div>
                      </div>
                      <Button onClick={() => convertFile(file.path)} disabled={loading} size="sm">转换</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {folders.length === 0 && files.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-4">📂</p>
                <p>当前目录为空</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
