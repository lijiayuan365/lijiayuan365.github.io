# 常用 AI IDE 添加 MCP 指南（以 Figma 为例）

MCP (Model Context Protocol) 的安装通常非常简单，大多数情况下只需一条命令即可完
成，具体的步骤在对应 mcp 的文档里面也会有说明。本文档旨在记录在不同 AI 编程工具
中配置 Figma MCP 的具体步骤和注意事项，作为备忘。

## 1. Claude Code

Claude Code 的配置最为标准和直接。

### 添加步骤

最简单的方法是使用 `claude mcp add` 命令直接添加 Figma 的远程 MCP 服务。

1.  **运行安装命令**：打开终端，运行以下命令：

    ```bash
    claude mcp add --transport http figma https://mcp.figma.com/mcp
    ```

2.  **认证授权**：
    - 在 Claude Code 中输入 `/mcp` 命令查看服务器列表，确保 `figma` 已列出。
    - 系统会提示认证 (Authenticate)。
    - Claude 会提供一个 URL，点击打开浏览器，登录你的 Figma 账户。
    - 在 Figma 授权页面点击 **Allow Access**（允许访问）。
    - 返回 Claude Code，看到 "Authentication successful" 即表示成功。

### 使用方法

- **读取设计**：查看 Figma 文件内容，选中节点右键复制所选元素的 link 给到然后直
  接给到对话中。
- **生成代码**：结合设计上下文，让 Claude 生成对应的代码组件。

---

## 2. Cursor

Cursor 原生支持 MCP，配置界面友好，支持自动安装依赖。

### 添加步骤

1.  **打开设置**：
    - 点击右上角齿轮图标 -> **General** -> **MCP** (或直接在设置中搜索 "MCP")。
2.  **添加新服务**：
    - 点击 **+ Add New MCP Server**。
    - 在弹出的配置框中，填入以下 JSON 配置：
      ```json
      {
        "mcpServers": {
          "Figma": {
            "url": "https://mcp.figma.com/mcp"
          }
        }
      }
      ```
    - 保存后，Cursor 会自动处理依赖安装和启动。
3.  **认证**：
    - 添加完成后，Cursor 会尝试启动服务。如果需要认证，通常会弹出提示或在输出面
      板显示认证链接，流程与 Claude Code 类似。

### 检查与使用

- **检查状态**：在设置页面的 MCP 列表中，确保 Figma 服务的开关处于 **On** 状态且
  无报错。
- **Composer 生成**：在 Composer (Cmd+I) 中，输入 "参考 Figma 设计 [链接] 生成代
  码"。
- **上下文引用**：在 Chat (Cmd+L) 中，可以使用 `@Figma` (如果插件支持) 或直接用
  自然语言描述，Cursor 会自动调用工具。

---

## 3. VS Code (GitHub Copilot)

VS Code 的 MCP 支持主要通过 GitHub Copilot 扩展实现。需要注意的是，微软目前的实
现与标准 MCP 协议在配置文件结构上略有不同。

### 注意事项

- **配置格式差异**：标准协议使用 `mcpServers` 字段，而 VS Code 目前使用
  `servers` 字段。
- **兼容性**：VS Code 生成的配置文件可能无法被其他遵循标准协议的工具（如 Claude
  Code）直接读取。

### 添加步骤

1.  **通过命令添加**：
    - 按下 `Cmd+Shift+P`，搜索 **MCP: Add Server**。
    - 根据提示选择方式并填入参数。
2.  **手动配置 (推荐)**：
    - 在当前项目的 `.vscode` 文件夹下创建 `.mcp.json` 文件。
    - 填入以下内容：
      ```json
      {
        "servers": {
          "Figma": {
            "url": "https://mcp.figma.com/mcp",
            "type": "http"
          }
        },
        "inputs": []
      }
      ```
3.  **初始化与状态**：
    - 保存文件后，VS Code 会自动尝试初始化连接。
    - 如果未自动连接，可以打开 `.mcp.json` 文件，文件上方通常会出现 MCP 状态菜单
      （显示 Running 或 Start），点击即可重启服务。
    - 后续使用 Copilot 时，可以像引用其他上下文一样引用 MCP 服务。

---

## 4. Google Antigravity

Google Antigravity 对 MCP 的支持还在演进中。现在的话确实不好用

### 现状与体验

- **MCP Store**：自带一个 MCP Store，搜索和安装通用 MCP 工具比较方便。
- **复杂配置挑战**：对于像 Figma 这样需要复杂认证或初始化的服务，体验尚待优化。
  - 虽然 Store 中提供了 Figma，也有授权说明，但如果需要手动修改配置文件添加，或
    者处理初始化流程，操作相对繁琐。
  - **Figma 限制**：Figma MCP 目前对权限有一定要求（如需要 Pro 计划，且通常需要
    项目负责人配置开启 MCP Server），这对普通开发者来说可能是一个门槛。
