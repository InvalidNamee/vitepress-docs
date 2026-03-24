import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar';
import type { UserConfig, DefaultTheme } from 'vitepress' 
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
const vitePressOptions: UserConfig<DefaultTheme.Config> = {
  title: "Star 的档案库",
  description: "刷题记录 & 结构化笔记",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link',{ rel: 'icon', href: '/vitepress-logo-mini.png'}],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: 'ACM', link: '/acm/' },
      { text: '笔记', link: '/notes/' },
      { text: '博客', link: 'https://starlab.top' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/InvalidNamee/vitepress-docs' }
    ],

    footer: {
      message: '© 2026 InvalidNamee. All Rights Reserved.',
      copyright: '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 12px;margin-top:8px;font-size:13px;"><a style="color:var(--vp-c-brand-1);text-decoration:none;font-weight:500;display:flex;align-items:center;gap:4px;" target="_blank" href="https://beian.mps.gov.cn/#/query/webSearch?code=13042702000231"><img src="/gongan.png" style="width:14px;height:14px;" alt="公安号"><span>冀公网安备13042702000231号</span></a><span style="color:rgba(128,128,128,0.4);">/</span><a style="color:var(--vp-c-brand-1);text-decoration:none;font-weight:500;" target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index">冀ICP备2026000059号-1</a></div>',
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 6],
      label: '页面导航'
    },

    editLink: { 
      pattern: 'https://github.com/InvalidNamee/vitepress-docs/edit/main/docs/:path',
      text: '在 GitHub 编辑本页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    docFooter: { 
      prev: '上一页', 
      next: '下一页', 
    },
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
    scanStartPath: 'notes',
    resolvePath: '/notes/',
    useTitleFromFrontmatter: true,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    collapsed: true
  },
  {
    documentRootPath: 'docs',
    scanStartPath: '.',
    resolvePath: '/',
    useTitleFromFileHeading: true,
    excludePattern: ['acm/**', 'notes/**']
  }
]

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));