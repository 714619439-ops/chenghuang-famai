# 城隍法脉疗愈 · 静态网站

全国城隍法脉疗愈 · 免费为全球青少年身心疗愈

## 项目简介

城隍法脉源于传统城隍信仰中的司署体系，经铁一锤发愿整合，形成以**四十二司**为核心的疗愈法脉。法脉以正心正念为根本，以慈悲济世为宗旨，专为现代人尤其是青少年提供身心疗愈支持。

**核心原则**：不收费 · 不问来处 · 不涉组织

## 技术栈

- 纯静态 HTML + CSS + JavaScript
- PWA 支持（可安装到手机桌面）
- GitHub Pages 一键部署
- 禅意素雅风设计（月白底色 · 深褐文字 · 金色点缀）

## 项目结构

```
D:\XR\
├── index.html              # 首页（大愿横幅 + 导航卡）
├── all-si.html             # 四十二司总览（含筛选功能）
├── about.html              # 认识法脉（大愿/须知/发愿文）
├── protect-youth.html      # 护青公益计划
├── rituals.html            # 功课仪轨（早/晚课/朔望/莲花救度）
├── prayer-generator.html   # 祈请文生成器（支持42司）
├── contact.html            # 关于我们
├── css/style.css           # 禅意素雅风样式表
├── js/data.js              # 双数据集：SI_DATA(21) + SIXI_DATA(21)
├── js/main.js              # 全局功能 + renderSiPage引擎
├── pages/                  # 四十二司详情页（统一模板渲染）
│   ├── TEMPLATE.html       # 动态渲染模板
│   ├── 阴阳司.html ~ 济度司.html   # 新增21司
│   ├── 冥阳司.html ~ 财运司.html   # 原版21司
│   └── 1司.html ~ 21司.html       # 保留（编号版）
├── icon-192.svg            # PWA图标 192x192
├── icon-512.svg            # PWA图标 512x512
├── manifest.json           # PWA配置文件
├── sw.js                   # Service Worker（离线缓存）
└── README.md               # 本文件
```

## 数据架构

| 数据集 | 司数 | 风格 | 来源 |
|--------|------|------|------|
| `SI_DATA` | 21司 | 城隍司署体系（阴阳/速报/功德等） | 新增 |
| `SIXI_DATA` | 21司 | 实用疗愈体系（冥阳/出行/口舌等） | 原版 |

两套数据共存，通过 `pages/TEMPLATE.html` 统一动态渲染。访问任一司页面时，自动在 `SI_DATA` 和 `SIXI_DATA` 中查找匹配。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库
2. 将本项目所有文件推送到仓库
3. 仓库 Settings → Pages → 选 main 分支
4. 访问 `https://你的用户名.github.io/仓库名/`

## 本地预览

直接用浏览器打开 `index.html` 即可预览。

## 许可

本网站仅供公益学习交流使用，所有内容免费共享。
