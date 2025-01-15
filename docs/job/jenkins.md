# Jenkins 安装与配置指南

## 一、Docker 安装方式

### 1. 环境准备
- Docker 和 Docker Compose
- 用于配置文件和数据的工作目录

### 2. 部署配置

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
      - /usr/bin/docker:/usr/bin/docker             # Docker 命令映射
      - ~/.ssh:/root/.ssh                           # SSH密钥目录映射
    environment:
      - TZ=Asia/Shanghai
    restart: always
```

### 3. 启动步骤

1. 启动服务：
```bash
docker-compose up -d
```

2. 获取初始密码：
```bash
docker exec my_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

3. 访问配置：
- 访问 `http://localhost:8080`
- 输入初始密码
- 选择 "Install suggested plugins"
- 如果插件安装失败，可以点击"Continue"继续，后续再单独安装所需插件

### 4. 插件配置

如遇下载慢，可配置国内源：
1. 进入 `Manage Jenkins` > `Manage Plugins` > `Advanced`
2. 更新源地址：
```
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```

## 二、常见问题处理

### 1. Git 仓库访问配置

首次克隆可能需要确认 SSH 指纹：

```bash
# 进入容器
docker exec -it my_jenkins bash

# 验证 Git 连接
git ls-remote -h -- git@your-repository.git HEAD

# 出现提示时输入 yes 确认
```

### 2. Docker 权限问题

如遇到 Docker socket 权限报错，执行以下步骤：

1. 修改宿主机权限：
```bash
sudo chown root:root /var/run/docker.sock
sudo chmod 666 /var/run/docker.sock
```

2. 重启服务：
```bash
sudo systemctl restart docker
docker-compose down
docker-compose up -d
```

> **安全提示**：生产环境建议使用 `660` 权限，并将用户加入 `docker` 组，而不是使用 `666` 权限。
