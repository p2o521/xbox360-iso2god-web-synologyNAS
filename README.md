# ISO2GOD Web - Xbox 360 ISO 转 GOD 工具

专为群晖 NAS 设计的 Xbox 360 ISO 转 GOD 格式转换工具，提供 Web 界面操作。

## 功能特点

- 📁 **树形目录浏览** - 点击浏览，无需手动输入路径
- 🔍 **递归扫描** - 一键扫描目录下所有 ISO 文件
- ⚡ **批量转换** - 逐个转换 ISO 文件为 GOD 格式
- 🐳 **Docker 部署** - 一键安装，跨平台兼容

## 快速安装

### 方法一：克隆仓库（推荐）

```bash
# SSH 连接到群晖
ssh admin@你的NAS地址

# 克隆项目
cd /volume1/docker
git clone https://github.com/你的用户名/iso2god-web.git
cd iso2god-web

# 构建并启动
docker-compose up -d --build
```

### 方法二：手动下载

```bash
# 创建目录
mkdir -p /volume1/docker/iso2god-web/tools
cd /volume1/docker/iso2god-web

# 下载必要文件（从 GitHub Releases 下载）
# 1. docker-compose.yml
# 2. Dockerfile
# 3. package.json
# 4. 源码目录 src/

# 下载 iso2god 工具
curl -L -o tools/iso2god "https://github.com/iliazeus/iso2god-rs/releases/download/v1.8.1/iso2god-x86_64-linux"
chmod +x tools/iso2god

# 构建并启动
docker-compose up -d --build
```

### 访问 Web 界面

打开浏览器访问：`http://你的NAS地址:8080`

## 配置说明

### 修改挂载路径

编辑 `docker-compose.yml`，修改 volumes 部分：

```yaml
volumes:
  # 格式: - /你的NAS路径:/data/显示名称
  - /volume1/games:/data/volume1
  - /volume2/games:/data/volume2
```

### 修改端口

如果 8080 端口被占用，修改 `docker-compose.yml`：

```yaml
ports:
  - "9000:3000"  # 改为其他端口
```

## 使用方法

1. **浏览目录** - 点击左侧文件夹树形结构，导航到 ISO 文件所在目录
2. **扫描 ISO** - 点击"递归扫描 ISO"按钮，自动查找当前目录下所有 ISO 文件
3. **转换文件** - 点击 ISO 文件右侧的"转换"按钮开始转换
4. **查看结果** - 转换完成后，GOD 文件会生成在 ISO 同目录下

## 转换后的文件

GOD 格式文件结构：
```
游戏名/
└── TitleID/
    └── 00007000/
        └── Hash.data/
            ├── Data0000
            ├── Data0001
            └── ...
```

将整个游戏目录复制到 Xbox 360 硬盘的 `Content/0000000000000000/` 目录下即可游玩。

## 常见问题

### Q: 转换速度慢？
A: ISO 转换需要较长时间，特别是大文件（7GB+ 可能需要 5-10 分钟）。请耐心等待。

### Q: 网页打不开？
A: 
1. 检查容器是否正常运行：`docker ps`
2. 检查端口是否被占用：`netstat -tlnp | grep 8080`
3. 查看容器日志：`docker logs iso2god-web-iso2god-web-1`

### Q: 提示"目录不存在"？
A: 检查 docker-compose.yml 中的挂载路径是否正确，确保路径存在且有权限访问。

### Q: 转换失败？
A: 
1. 确认 ISO 文件完整且未损坏
2. 查看容器日志获取详细错误信息
3. 确认输出目录有足够的磁盘空间

## 技术栈

- Next.js 14
- React 18
- Tailwind CSS
- [iso2god-rs](https://github.com/iliazeus/iso2god-rs) (Rust)

## 许可证

MIT License

## 致谢

- [iso2god-rs](https://github.com/iliazeus/iso2god-rs) - 核心转换工具
