# 艳汉子大定制官网

Next.js 16.4.3（App Router）、React 19.3.1、TypeScript、Tailwind CSS 4.3.3，数据层使用 MySQL 8 / MariaDB 10.6+ 与 Drizzle ORM。项目可在 VPS 自托管运行，也可部署到 Vercel（需外部 MySQL）。

## 本地运行

- 安装：`npm ci`
- 环境变量：复制 `.env.example` 为 `.env.local`，填写 `DATABASE_URL`、`ADMIN_USERNAME`、`ADMIN_PASSWORD_HASH`、`SESSION_SECRET`
- 生成管理员密码哈希：`npm run hash-password`
- 建表：`npm run db:push`（需要版本化迁移时改用 `npm run db:generate` + `npm run db:migrate`）
- 写入初始站点配置与默认案例：`npm run db:seed`
- 开发：`npm run dev`
- 检查：`npm test`、`npm run lint`、`npm run typecheck`
- 生产构建与启动：`npm run build`、`npm start`

建议部署使用 Node.js 24.x；本地支持 Node.js 22 及以上。

未配置 `DATABASE_URL` 时站点仍可访问，前台读取代码内默认文案，后台可查看但无法保存。数据库连接失败不会导致页面崩溃，读取层会回退默认内容。

## 后台管理

入口：`/admin/login`，账号密码由服务器环境变量配置。登录会话使用签名 Cookie，有效期 8 小时；连续 6 次失败会锁定 10 分钟。

| 模块 | 路径 | 功能 |
|---|---|---|
| 概览 | `/admin` | 案例、未读线索、素材与咨询状态统计 |
| 案例管理 | `/admin/cases` | 新建、编辑、发布/下架、删除、上传案例图片 |
| 页面文案 | `/admin/pages` | 全站导航、页脚与 9 个页面的全部文案、栏目和链接 |
| 咨询线索 | `/admin/leads` | 查看、搜索、标记已读、删除、导出 CSV |
| 素材库 | `/admin/media` | 上传图片、复制地址、删除 |
| 站点设置 | `/admin/settings` | 站点名称、SEO、公开联系方式、咨询接收开关 |

页面文案保存后前台即时生效。编辑页支持「恢复默认」，会清除该页面的自定义内容。未保存离开页面时会提示。

页面文案字段以小字标注原始字段标识，便于对照前台位置。数组栏目支持添加、删除和上下移动，最多 40 项；服务端保存前会按默认结构净化，避免写入任意结构。

咨询线索默认关闭。在「站点设置」开启前，`POST /api/inquiries` 返回 503 `CONTACT_NOT_CONFIGURED`，不接收、不保存任何个人信息。开启前请先完成数据库迁移，并确认隐私说明、处理方式与跟进负责人。

## 联系功能状态

咨询通道默认保持「待配置」。联系页的需求提纲只在浏览器本地生成，不会上传服务器。公开电话、微信、邮箱、地址与服务时间可在「站点设置」中填写；填写联系方式不会自动开启表单接收。

## 内容维护

- 页面文案默认值：`src/lib/page-content-defaults.ts`
- 站点配置默认值：`src/lib/site-defaults.ts`
- 数据库结构：`db/schema.ts`；初始数据：`db/seed.ts`
- 前台页面：`src/app/(site)/`；后台：`src/app/admin/`
- 原始资料图片：`public/images/`；后台上传图片：`UPLOAD_DIR`，默认 `./uploads`

默认值仅作为首次部署与数据库缺失时的兜底，日常内容请在后台维护。

## 素材与事实边界

图片从用户提供的 14 页商业计划书提取，未以 AI 生成室内图替代真实项目图片：

| 文件 | 来源 | 使用方式 |
|---|---|---|
| cover-interior.jpg | PDF第1页Im1，1920×1080 | 品牌空间意象，非交付证明 |
| founder.jpg | PDF第3页Im3，625×625 | 资料中的主理人照片 |
| nancheng-yuefu-a.jpg | PDF第6页Im5，746×334 | 资料所列项目，保留WAN RUN SPACE DESIGN署名 |
| nancheng-yuefu-b.jpg | PDF第6页Im6，740×334 | 资料所列项目，保留WAN RUN SPACE DESIGN署名 |

项目状态、面积、价格、工期、服务分工与公开授权须补齐；页面未将其设为已核实事实。完整 11 节点和联盟权益未编造。

## 部署

VPS 自托管步骤见 `DEPLOYMENT.md`。线上展示域名仍为 https://yanhanzi.vercel.app；若继续使用 Vercel，需要为项目配置可访问的 MySQL，否则后台与线索功能不可用。
