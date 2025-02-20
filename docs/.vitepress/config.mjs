import { defineConfig } from 'vitepress'
import { autoSidebar } from 'vite-plugin-vitepress-utils'

import { blogTheme } from './blog-theme'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  title: "异乡小红帽",
  description: "随便写写",
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
      {
        text: 'AI 相关',
        link: '/ai'
      },
      { text: '开源作品', items: [
        { text: 'vue-docgen-component', link: 'https://github.com/lijiayuan365/vue-docgen-component' },
        { text: 'vite-plugin-vitepress-utils', link: 'https://github.com/lijiayuan365/vite-plugin-vitepress-utils' },
      ] },
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
      { icon: 'github', link: 'https://github.com/lijiayuan365/lijiayuan365.github.io' }
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
  srcExclude: ['**/resume.md']
})
