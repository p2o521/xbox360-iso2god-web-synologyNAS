# ISO2GOD Web - Xbox 360 ISO 转 GOD 工具

专为群晖 NAS 设计的 Xbox 360 ISO 转 GOD 格式转换工具，提供 Web 界面操作。

## 功能特点

- 📁 **树形目录浏览** - 点击浏览，无需手动输入路径
- 🔍 **递归扫描** - 一键扫描目录下所有 ISO 文件
- ⚡ **批量转换** - 逐个转换 ISO 文件为 GOD 格式
- 🐳 **Docker 部署** - 一键安装，跨平台兼容

## 界面预览

[ISO2GOD Web 界面](https://github.com/user-attachments/assets/4bca0fa3-c949-4623-b538-a075c59df45d)


## 快速安装

### 方法一：克隆仓库（推荐）

```bash
# SSH 连接到群晖
ssh admin@你的NAS地址

# 克隆项目
cd /volume1/docker

git clone https://github.com/p2o521/xbox360-iso2god-web-synologyNAS.git

cd xbox360-iso2god-web-synologyNAS

# 构建并启动
docker-compose up -d --build



方法二：手动下载
点击仓库页面的 Code → Download ZIP
解压到群晖 /volume1/docker/iso2god-web/ 目录
执行构建命令：
cd /volume1/docker/iso2god-web
docker-compose up -d --build
访问 Web 界面
打开浏览器访问：http://你的NAS地址:8080
配置说明
修改挂载路径
编辑 docker-compose.yml，修改 volumes 部分：
volumes:
  # 格式: - /你的NAS路径:/data/显示名称（:/data/这几个字不要动）
  - /volume1/games:/data/volume1
  - /volume2/games:/data/volume2
  - /volume3/下载:/data/volume3
修改端口
如果 8080 端口被占用：
ports:
  - "9000:3000"  # 改为其他端口，从8080改为9000
使用方法
1. 浏览目录
点击左侧文件夹树形结构，导航到 ISO 文件所在目录。
2. 扫描 ISO 文件
点击 "递归扫描 ISO" 按钮，自动查找当前目录下所有 ISO 文件（最多显示 200 个）。
3. 转换文件
点击 ISO 文件右侧的 "转换" 按钮开始转换。
4. 查看结果
转换完成后，GOD 文件会生成在 ISO 同目录下，文件夹名称与 ISO 文件名相同。
转换后的文件
GOD 格式文件结构：
游戏名/
└── TitleID/           (如 434D0809)
    └── 00007000/
        └── Hash.data/
            ├── Data0000
            ├── Data0001
            ├── Data0002
            └── ...
如何使用 GOD 文件
将整个游戏目录复制到 Xbox 360 硬盘的以下路径：
Content/0000000000000000/
即可在 Xbox 360 上游玩。
常见问题
Q: 转换速度慢？
A: ISO 转换需要较长时间，特别是大文件：
7GB ISO 大约需要 5-10 分钟
请耐心等待，不要关闭页面
Q: 网页打不开？
A: 按以下步骤排查：
# 1. 检查容器是否运行
docker ps | grep iso2god

# 2. 检查端口是否被占用
netstat -tlnp | grep 8080

# 3. 查看容器日志
docker logs iso2god-web-iso2god-web-1

# 4. 重启容器
docker-compose restart
Q: 提示 "目录不存在"？
A: 检查 docker-compose.yml 中的挂载路径是否正确：
# 确认路径存在
ls -la /volume1/games

# 确认有访问权限
ls -la /volume1/docker/iso2god-web
Q: 转换失败？
A: 可能原因：
ISO 文件损坏 - 重新下载 ISO 文件
磁盘空间不足 - GOD 文件约为 ISO 的 50%，确保有足够空间
权限问题 - 检查目录权限
# 查看容器日志获取详细错误
docker logs iso2god-web-iso2god-web-1
Q: 如何查看转换进度？
A: 当前版本不支持实时进度显示，请耐心等待。转换完成后会显示成功提示。
Q: 支持批量转换吗？
A: 当前版本需要逐个点击转换。后续版本会添加批量转换功能。
更新
cd /volume1/docker/xbox360-iso2god-web-synologyNAS
git pull
docker-compose down
docker-compose up -d --build
卸载
cd /volume1/docker/xbox360-iso2god-web-synologyNAS
docker-compose down
docker rmi iso2god-web:latest
cd ..
rm -rf xbox360-iso2god-web-synologyNAS
技术栈
技术	       版本	        说明
Next.js   	  14.2.3	React 框架
React	        18.3.1	UI 库
Tailwind CSS	3.4.3	 CSS 框架
TypeScript	  5.4.5	 类型支持
iso2god-rs	  1.8.1	 核心转换工具
致谢
iso2god-rs - Rust 实现的 ISO 转 GOD 核心工具
贡献
欢迎提交 Issue 和 Pull Request！
许可证
MIT License

Star History
如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！
免责声明：本项目仅供学习交流使用，请勿用于非法用途。使用本工具转换的游戏文件请确保你拥有合法的所有权。
