# my-blog-frontend

个人博客前端(SPA),前后端分离。一套应用同时承载**读者前台**与**管理员后台**,PC + 移动双适配,支持深 / 浅色主题。

技术栈、接口契约与开发约定见 [`docs/`](docs/)。

## 技术栈

| 组件 | 选型 |
|---|---|
| 框架 | Vue 3.5（`<script setup>`) + Vite |
| 路由 | Vue Router 4 |
| 状态 | Pinia |
| UI | Element Plus 2.14 |
| 请求 | Axios（统一封装 + 拦截器) |
| Markdown 渲染 | markdown-it + highlight.js + DOMPurify(XSS 净化) |
| Markdown 编辑 | md-editor-v3 |

## 工程结构

```
src/
├─ api/          # 按模块封装接口(article / comment / category / tag / archive / project / search / site / admin)
├─ components/   # 通用组件 NavBar / ProfileCard / SideIndex / ArticleCard / CommentList / ThemeToggle
├─ composables/  # useBreakpoint(响应式断点)
├─ layouts/      # DefaultLayout(前台三栏) / AdminLayout(后台)
├─ views/        # 前台页面 Home / Category / Archive / About / Projects / ArticleDetail / Search / NotFound
│  └─ admin/     # 后台页面 Login / ArticleList / ArticleEdit / Comments / Projects / SiteInfo
├─ router/       # 路由表 + 登录守卫
├─ store/        # Pinia:theme(主题) / auth(鉴权) / site(站点信息)
├─ utils/        # request(axios) / markdown(渲染+TOC) / theme / auth(token) / format / breakpoints
└─ styles/       # CSS 变量(深/浅色) + 断点 + reset + markdown 样式
```

## 关键设计

- **响应式断点**(`src/utils/breakpoints.js` 与 `styles/breakpoints.css` 同步):桌面 ≥1024 三栏、平板 768–1023 两栏、移动 <768 单栏 + 汉堡抽屉。
- **主题**:CSS 变量两套色板挂 `[data-theme]`,默认跟随系统并可手动切换、持久化;Element Plus 暗色与 highlight.js 配色同步切换。
- **接口约定**:统一前缀 `/api`,返回 `{ code, message, data }`(`code=0` 成功);Axios 响应拦截解包 `data`、统一错误提示、`401` 清 token 跳登录。
- **鉴权**:`/admin/*` 路由守卫校验本地 token;token 经 `Authorization: Bearer` 头携带。
- **安全**:文章正文与评论渲染前一律 DOMPurify 净化防 XSS。

## 开发

```sh
npm install      # 安装依赖
npm run dev      # 启动开发服务器(已配置 /api 代理到 http://localhost:8080)
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

> 后端默认地址为 `http://localhost:8080`,如需修改改 `vite.config.js` 的 `server.proxy`。

## 环境要求

Node ≥ 22.12（推荐 22 / 24 LTS)。
