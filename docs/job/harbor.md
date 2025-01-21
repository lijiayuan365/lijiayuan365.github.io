# Harbor 安装与使用

Harbor 是由 VMware 中国团队开发的企业级 Docker Registry 项目，用于存储和分发 Docker 镜像。它具有以下主要特性：

- 安全性：支持基于角色的访问控制、漏洞扫描
- 可靠性：支持镜像复制和高可用部署
- 易用性：提供友好的 Web 界面
- 扩展性：支持多种存储后端和身份认证方式

## 1. 安装准备

### 1.1 下载和解压
```bash
# 下载离线安装包
wget https://github.com/goharbor/harbor/releases/download/v2.10.0/harbor-offline-installer-v2.10.0.tgz

# 解压安装包
tar -xvf harbor-offline-installer-v2.10.0.tgz
cd harbor
```

### 1.2 配置文件设置
```bash
# 复制配置模板
cp harbor.yml.tmpl harbor.yml

# 修改基础配置
vim harbor.yml

# 主要配置项：
hostname: <your-domain-or-ip>    # 域名或IP地址
http:
  port: <port-number>           # HTTP 端口号
```

## 2. 安装配置

### 2.1 HTTP 模式（简单内网使用）
1. 注释掉 harbor.yml 中的 https 相关配置
2. 修改 Docker 配置以允许 HTTP 访问：

```bash
# 编辑 Docker 配置文件
# 普通模式
sudo vim /etc/docker/daemon.json
# rootless 模式
vim ~/.config/docker/daemon.json

# 添加以下配置
{
  "insecure-registries": ["your-harbor-address"]
}

# 重启 Docker 服务
# 普通模式
sudo systemctl restart docker
# rootless 模式
systemctl --user restart docker
```

### 2.2 HTTPS 模式（对外生产环境使用）
1. 配置证书路径：
```bash
# 在 harbor.yml 中设置证书路径
certificate: /your-path/ssl_cert/domain.com.crt
private_key: /your-path/ssl_cert/domain.com.key

# 配置 Docker 证书
sudo cp domain.com.crt /etc/docker/certs.d/domain.com/ca.crt
```

## 3. 安装和使用

### 3.1 执行安装
```bash
sudo ./install.sh
```

### 3.2 登录使用

```bash
# 登录 Harbor
docker login <harbor-address> -u <username> -p <password>

# 默认管理员账号
用户名: admin
密码: Harbor12345 (可在 harbor.yml 中修改)
```

### 3.3 访问 Web 管理界面

1. 在浏览器中访问 Harbor：
   - HTTP 模式：`http://<your-domain-or-ip>:<port>`
   - HTTPS 模式：`https://<your-domain-or-ip>:<port>`

2. 使用管理员账号登录：
   - 用户名：admin
   - 初始密码：Harbor12345

3. 登录后可以进行以下操作：
   - 创建/管理项目（镜像仓库）
   - 管理用户和权限
   - 查看系统日志
   - 配置复制规则
   - 执行漏洞扫描

## 4. 注意事项

1. 首次使用需要在 Web 界面创建项目（仓库）
2. 确保 Docker 配置正确（HTTP/HTTPS）
3. 如需详细配置说明，请参考[官方文档](https://github.com/goharbor/website/blob/release-2.1.0/docs/install-config/configure-yml-file.md)