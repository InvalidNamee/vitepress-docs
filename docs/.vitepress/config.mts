import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar';
import type { UserConfig, DefaultTheme } from 'vitepress' 
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
const vitePressOptions: UserConfig<DefaultTheme.Config> = {
  title: "Star's Docs",
  description: "A VitePress Site",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'ACM', link: '/acm/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/InvalidNamee/vitepress-docs' }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 6],
      // label: '页面导航'
    }
  },

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
    math: true,
    image: {
      lazyLoading: true
    },
  },

  vite: {
    plugins: [groupIconVitePlugin()]
  },
};

const vitePressSidebarOptions = [
  {
    documentRootPath: 'docs',
    scanStartPath: 'acm',
    resolvePath: '/acm/',
    useTitleFromFrontmatter: true,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    collapsed: true
  },
  {
    documentRootPath: 'docs',
    scanStartPath: '.', // 扫描根目录
    resolvePath: '/',   // 其他所有路径显示这个
    useTitleFromFileHeading: true,
    excludePattern: ['acm/**'] // 避免在根边栏里再次列出 acm 文件夹
  }
]

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));