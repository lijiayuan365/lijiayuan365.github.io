# 本地部署 deep-seek

DeepSeek 是由深度资本（DeepSeek Capital）开发的开源大型语言模型（LLM）。它提供多个版本，包括 1.5B、7B、67B 等不同参数规模的模型，支持中英文双语，并且在代码生成、数学推理等领域表现出色。

## 为什么选择本地部署?

本地部署 AI 模型有以下优势:

1. 数据隐私安全 - 所有对话数据都在本地处理，不会上传到云端
2. 无需联网 - 部署完成后可离线使用
3. 无使用限制 - 不受 API 调用次数和费用限制
4. 低延迟 - 本地运算响应更快
5. 本地部署其实真的挺简单的

## 硬件要求

运行 DeepSeek 1.5B 版本的最低配置:

- CPU: 4核及以上
- 内存: 8GB及以上 
- 硬盘: 至少 2GB 可用空间
- GPU: 可选(有 GPU 加速会更流畅)


## 安装 Ollama

Ollama 是一个用于管理和运行本地语言模型的工具。

直接去到 Ollama 的[下载页面](https://ollama.com/download/linux)， 根据平台自行下载。 我这边用的是Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
``` 
安装终端跑一下
```bash
ollama -v
```
出现版本号就说明安装成功了。

## 拉取 deep-seek 模型运行
模型版本有很多，具体上[Ollama](https://ollama.com/library/deepseek-r1:1.5b)那边查看，这边就先使用最小的1.5b 作为例子了
```bash
ollama run deepseek-r1:1.5b
```
这个这个模型只有1.1g的大小，所以拉取下来还是很快的。拉取成功后就可以看到终端可以开始对话了

## 可视化页面
虽然终端可以直接对话，但使用可视化界面会更方便。以下是几个推荐的可视化工具：

### 1. Page Assist 浏览器插件

[Page Assist](https://github.com/n4ze3m/page-assist) 是一个 Chrome 插件，可以直接与本地模型通信，使用简单方便。

### 2. Open WebUI

[Open WebUI](https://github.com/open-webui/open-webui) 是一个专门为 Ollama 设计的开源 Web 界面，提供了更多高级功能。

