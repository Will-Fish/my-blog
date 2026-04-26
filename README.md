# my-blog

一个基于 Next.js App Router 构建的个人网站，包含：

- 首页与个人介绍
- 项目归档与项目详情页
- 博客列表、博客详情、目录跳转
- 摄影作品展示
- RSS、sitemap、robots

![image-20260426171456009](assets/image-20260426171456009.png)

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问：

```bash
http://localhost:3000
```

## 常用脚本

```bash
npm run dev
```

启动 Next.js 本地开发服务器。

```bash
npm run build
```

执行标准 Next.js 生产构建。

```bash
npm run lint
```

执行 ESLint 检查。

```bash
npm run preview
```

用 OpenNext 构建并本地预览 Cloudflare Workers 版本。

```bash
npm run deploy
```

用 OpenNext 构建并部署到 Cloudflare Workers。

```bash
npm run cf-typegen
```

生成 Wrangler 环境类型定义。

## Cloudflare Workers 部署

当前仓库已经使用：

- `@opennextjs/cloudflare`
- `wrangler`
- `wrangler.jsonc`
- `open-next.config.ts`

## Cloudflare 后台推荐配置

如果你使用 Git 自动部署，Cloudflare 侧建议按下面填写：

- Root directory: `my-blog`
- Install command: `npm install`
- Build / Deploy command: `npm run deploy`
- Node.js version: `20` 或 `22`

后续更新内容的流程就是：

1. 本地修改文章或代码
2. `git commit`
3. `git push`
4. Cloudflare 自动构建并重新部署

## Windows 注意事项

这个仓库可以在 Windows 下正常进行：

- 内容编辑
- `npm run dev`
- `npm run build`

但 `OpenNext` 在 Windows 本地执行 `preview` / `deploy` 时，可能因为 `symlink` 权限或兼容性问题失败。这是 OpenNext 在 Windows 上的常见限制，不代表 Cloudflare 线上构建会失败。

如果你想在本地完整验证 Workers 构建链路，建议使用：

- WSL
- 或 Linux / macOS 环境

## 内容结构

主要内容目录：

- `content/blog`：博客文章 Markdown
- `content/projects`：项目内容 Markdown
- `content/photography`：摄影资源
- `public`：公开静态资源

主要页面与组件目录：

- `app`
- `components`
- `lib`

## 备注

如果后续要接入环境变量、KV、R2、Analytics 或其他 Cloudflare 能力，建议在 `wrangler.jsonc` 里继续补 bindings，并重新生成类型：

```bash
npm run cf-typegen
```
