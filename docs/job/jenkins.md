# Jenkins 安装与配置指南

## Docker 安装方式

Jenkins 支持多种安装方式，本文介绍使用 Docker Compose 的快速部署方案。

### 1. 环境准备

- 确保已安装 Docker 和 Docker Compose
- 准备一个工作目录用于存放配置文件和数据

### 2. 配置 Docker Compose

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  jenkins:
    container_name: my_jenkins
    image: jenkins/jenkins:lts
    privileged: true
    user: root
    ports:
      - "8080:8080"      # Web 管理界面
      - "50000:50000"    # Agent 通信端口
    volumes:
      - ./jenkins_home:/var/jenkins_home            # 数据持久化
      - /var/run/docker.sock:/var/run/docker.sock   # Docker socket 映射
      - /usr/bin/docker:/usr/bin/docker            # Docker 命令映射
    environment:
      - TZ=Asia/Shanghai # 设置时区
    restart: always
```

### 3. 部署步骤

1. 启动服务：
```bash
docker-compose up -d
```

2. 获取初始管理员密码：
```bash
docker exec my_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

3. 访问 Jenkins：
   - 打开浏览器访问 `http://localhost:8080`
   - 输入上一步获取的管理员密码

### 4. 初始化配置

1. **插件安装**
   - 建议选择"Install suggested plugins"（安装推荐插件）
   - 如果插件安装失败，可以点击"Continue"继续，后续再单独安装所需插件

2. **配置插件源**
   如果插件下载速度慢，可以配置国内源：
   1. 进入 `Manage Jenkins` > `Manage Plugins` > `Advanced`
   2. 将 Update Site 修改为：
   ```
   https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
   ```

### 注意事项
- 确保工作目录具有适当的权限
- 如果遇到插件安装失败，可以多次重试或使用国内源
- 建议定期备份 Jenkins 数据目录

