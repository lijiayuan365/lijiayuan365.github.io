import { defineConfig } from 'vitepress'
import { autoSidebar } from 'vite-plugin-vitepress-utils'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    outline: {
      level: [2, 3], // 配置显示的标题级别，从 h2 到 h6
      label: '目录' // 目录导航的标签
    },
    search: {
      provider: 'local', // 使用本地搜索
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '工作记录', link: '/job' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  vite: {
    plugins: [
      autoSidebar({
        useMarkdownTitle: true,
        // 在这里可以添加自定义配置，具体选项见下文
      }),
    ],
  },
})
