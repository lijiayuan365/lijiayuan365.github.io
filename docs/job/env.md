# 环境配置

这边需要使用 windows， 相对于 windows 环境来说，还是 wsl2 配置开发环境更方便，也能够更接近生产环境，终端和开发工具的支持都比较好，配置一个比较好。

## 安装 wsl2

直接终端跑 `wsl.exe --install` 即可。后面会自动下载和安装启动的，默认装的Ubuntu，后面就是设置账户密码那些，设置完毕后终端就会多出一个Ubuntu的入口。了解更多看[文档](https://learn.microsoft.com/en-us/windows/wsl/install)

配置 .wslconfig 文件， 这个文件可以配置wsl2的内存，交换空间，内核命令行等， 可以参考[文档](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)

```conf
[experimental]
networkingMode=mirrored # 网络模式
dnsTunneling=true # dns隧道
firewall=true # 防火墙
autoProxy=true # 自动代理
hostAddressLoopback=true # 主机地址回环
[wsl2]
memory=8GB # 内存
swap=30GB # 交换空间
autoMemoryReclaim=dropcache # 自动内存回收
kernelCommandLine = cgroup_no_v1=all systemd.unified_cgroup_hierarchy=1 # 内核命令行, 这个是cgroup v2的配置
```

## 安装 zsh
在 Windows Subsystem for Linux (WSL) 2 中使用 Zsh (Z shell) 是一个常见的选择，因为 Zsh 提供了比默认的 Bash shell 更多的功能和更友好的用户界面。以下是在 WSL2 中安装和使用 Zsh 的基本步骤：

1. 安装 Zsh：进到终端跑命令
```bash
sudo apt update
sudo apt install zsh
```

2. 安装 Oh My Zsh：Oh My Zsh 是一个流行的 Zsh 框架，它提供了许多有用的功能和主题。安装 Oh My Zsh 的命令如下：
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

3. 安装zsh-syntax-highlighting。zsh-syntax-highlighting是一个插件，可以高亮显示Zsh中的命令语法。
```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

4. 安装zsh-autosuggestions。zsh-autosuggestions是一个插件，可以自动提示你之前输入过的命令。
```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

5. 配置
```bash
vim ~/.zshrc

# 在.zshrc文件中，找到plugins=(这一行，然后添加zsh-syntax-highlighting和zsh-autosuggestions：
plugins=(... zsh-syntax-highlighting zsh-autosuggestions)


# 保存成功后启用配置
source ~/.zshrc
```

6. 设置 zsh 为默认 shell
```bash
chsh -s $(which zsh)
```

## 配置 node 环境

目前用的是跨平台的 [fnm](https://github.com/Schniz/fnm) 作为 node 版本的管理工具

1. 安装
```bash
curl -fsSL https://fnm.vercel.app/install | bash

# 没有装unzip的话需要提前安装unzip
sudo apt install unzip
```

2. 启动配置
上面的命令结束会出现一段配置让你粘贴到 shell 配置文件那边，复制到 .bashrc/.zshrc 里面，然后 source .bashrc/.zshrc 启用一下就可以使用了

3. 使用 node，可以看下面命令，或者参考项目里面的.nvmrc 等配置文件了
```bash
# 安装 18版本
fnm install v18
# 安装20版本
fnm install v20
# 使用18版本
fnm use v18
```

## 配置 docker 环境
官方推荐的话是是安装 [docker desktop](https://docs.docker.com/desktop/features/wsl/#download), 这种方式简单方便，又有可视化，确实方便。但是镜像默认装在C盘，并且还是有点不稳定，所有这边选择使用 Linux 方式安装。其实也简单,一条脚本的事情。

```bash
curl -fsSL https://get.docker.com | bash -s docker --mirror AzureChinaCloud
```

安装成功后会提示你要不要运行 Docker 守护进程的非特权模式，需要的话跑下面这个命令

```bash
dockerd-rootless-setuptool.sh install

# 要是运行不成功的话可能需要安装一下依赖
sudo apt-get update
apt-get install -y uidmap
```

这个命令会配置 Docker 守护进程，使其可以在非 root 用户下运行。更多关于非特权模式的信息，看 [Docker](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) 文档。

> 运行 Docker 守护进程并允许非 root 用户访问
如果您希望以完全特权模式运行 Docker 守护进程，但同时允许非 root 用户访问，您需要配置 Docker 守护进程的 Unix socket，使其可以被特定用户组访问。通常，这涉及到创建一个名为 docker 的用户组，并将需要访问 Docker 的用户添加到该组。更多详细信息，您可以访问 Docker 文档。

>安全警告
访问具有特权的 Docker 守护进程的远程 API 等同于在宿主机上拥有 root 权限。这意味着，如果攻击者能够访问 Docker 守护进程的 API，他们就能够执行与 root 用户相同的操作，包括但不限于查看或修改宿主机上的文件、网络配置和系统资源。因此，保护 Docker 守护进程的 API 端点非常重要，应仅允许受信任的用户和网络访问。

>保护 API 端点：您应该确保 Docker 守护进程的 API 端点仅通过 HTTPS 和证书来访问，以防止未授权访问。
限制访问：仅允许受信任的用户和网络访问 Docker 守护进程的 API。
安全配置：考虑使用安全配置文件（如 AppArmor 或 SELinux 策略）来限制容器的行为，减少潜在的安全风险。

跑成功后设置一下开机启动

```bash
sudo loginctl enable-linger ljy
```

安装 docker-compose
```bash
sudo apt-get install docker-compose
```