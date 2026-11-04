# 官网部署记录

日期：2026年10月25日（Asia/Shanghai）

## 一、自托管部署（VPS + MySQL）

适用场景：需要使用后台管理、页面文案维护与咨询线索持久化。

### 环境要求

- Node.js 24.x（支持 22–24）
- MySQL 8 或 MariaDB 10.6+，字符集 `utf8mb4`
- Nginx（HTTPS 反向代理）、PM2 或其他进程守护工具

### 1. 创建数据库

```sql
CREATE DATABASE yanhanzi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'yanhanzi'@'127.0.0.1' IDENTIFIED BY '替换为强密码';
GRANT ALL PRIVILEGES ON yanhanzi.* TO 'yanhanzi'@'127.0.0.1';
FLUSH PRIVILEGES;
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，至少填写：

- `DATABASE_URL`：`mysql://yanhanzi:密码@127.0.0.1:3306/yanhanzi`
- `ADMIN_USERNAME`：管理员账号
- `ADMIN_PASSWORD_HASH`：执行 `npm run hash-password` 生成，不要保存明文
- `SESSION_SECRET`：使用 `openssl rand -base64 48` 生成，至少 32 位
- `UPLOAD_DIR`：建议使用绝对路径，例如 `/var/www/yanhanzi/uploads`
- `UPLOAD_MAX_MB`：单张图片上限，默认 5，最大 20

`ADMIN_PASSWORD` 仅用于本地临时调试。生产环境请使用哈希并清空该项。`.env` 不得提交到版本库或放入 `public/`。

### 3. 初始化数据库

```bash
npm ci
npm run db:push
npm run db:seed
```

`db:seed` 会写入站点配置、9 个页面的默认文案与示例案例；已存在的键和案例不会重复写入。需要版本化迁移时改用 `npm run db:generate` + `npm run db:migrate`。

### 4. 构建与启动

```bash
npm run build
pm2 start npm --name yanhanzi -- start
pm2 save
```

默认监听 `0.0.0.0:3000`。建议由 Nginx 反向代理并启用 HTTPS。

### 5. Nginx 示例

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    client_max_body_size 12m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

应用自身已配置 `X-Content-Type-Options`、`Referrer-Policy`、`X-Frame-Options`、`Permissions-Policy` 安全响应头。

### 6. 上传目录与备份

- 确保 `UPLOAD_DIR` 对运行用户可写，并纳入部署与迁移流程。
- 定期备份数据库与上传目录：

```bash
mysqldump -u yanhanzi -p yanhanzi > backup-$(date +%F).sql
tar -czf uploads-$(date +%F).tar.gz /var/www/yanhanzi/uploads
```

### 7. 部署后检查

- `GET /api/health` 返回正常。
- 13 个公开路由（首页、案例、详情、方法、服务、人物、联盟、联系、隐私、robots、sitemap）返回 200。
- `/privacy` 返回 `noindex`，且不出现在 sitemap 中。
- `/admin/login` 可登录；未登录访问 `/admin` 会跳转登录页。
- `POST /api/inquiries` 在咨询关闭时返回 503 `CONTACT_NOT_CONFIGURED`。
- 后台「站点设置」保存后前台即时生效；「页面文案」可恢复默认。

## 二、正式环境部署记录（2026-10-26）

- 访问地址：https://yanhanzi.dadafuture.com（HTTP 自动 301 跳转 HTTPS）
- 服务器：124.222.222.127，Ubuntu 22.04，由 1Panel 管理 OpenResty 与 MySQL 8.4
- 应用目录：`/opt/yanhanzi/app`；上传目录：`/opt/yanhanzi/uploads`；日志：`/opt/yanhanzi/logs`
- 独立 Node 运行时：`/opt/yanhanzi/node`（v22.20.0）。系统自带 `/usr/local/bin/node` 为 v20.20，未升级，避免影响现有站点
- 监听端口：**3100**。现有 `lilydesign` 站点占用 3000，两者完全独立；3100 仅由 Nginx 反向代理对外
- 进程管理：systemd `yanhanzi.service`，开机自启、异常自动重启
- 数据库：复用本机 MySQL 8.4 容器 `1Panel-mysql-DMcB`，新建独立库 `yanhanzi` 与用户 `yanhanzi`，未复用现有 `lilydesign` 库
- OpenResty 站点配置：`/opt/1panel/www/conf.d/yanhanzi.dadafuture.com.conf`；站点目录：`/opt/1panel/www/sites/yanhanzi.dadafuture.com`
- 证书：Let's Encrypt（自动续期）。续期钩子 `/etc/letsencrypt/renewal-hooks/deploy/yanhanzi-reload.sh` 会同步证书到站点 ssl 目录并重载 OpenResty
- 环境变量：`/opt/yanhanzi/app/.env`（权限 600，由应用自身加载）。注意 `ADMIN_PASSWORD_HASH` 中的 `$` 必须转义为 `\$`，否则 Next 会将其当作变量展开，导致后台登录恒为 401
- Nginx 侧 `client_max_body_size` 为 12m，与 `UPLOAD_MAX_MB=5` 匹配

### 常用运维命令

```bash
sudo systemctl restart yanhanzi        # 重启应用
systemctl status yanhanzi              # 查看状态
tail -f /opt/yanhanzi/logs/app.log     # 运行日志
tail -f /opt/yanhanzi/logs/error.log   # 错误日志
sudo docker exec 1Panel-openresty-EYlV openresty -t          # 校验 Nginx 配置
sudo docker exec 1Panel-openresty-EYlV openresty -s reload   # 重载 Nginx
```

### 上线验证结果

| 检查 | 结果 |
|---|---|
| 前台 8 个页面、`/admin/login`、`/api/health`、`/sitemap.xml`、`/robots.txt` | 均返回 200 |
| 首页品牌文案 | 正常渲染「艳汉子」 |
| sitemap | 使用 `https://yanhanzi.dadafuture.com` |
| `/privacy` | 返回 `noindex` |
| `POST /api/inquiries` | 503 `CONTACT_NOT_CONFIGURED`，未接收个人信息 |
| 未登录访问 `/admin` | 307 跳转 `/admin/login` |
| HTTP 访问 | 301 跳转 HTTPS |
| 后台登录（HTTPS） | 200，成功进入概览、案例、页面文案 |
| 案例详情、静态图片 | 200 |
| 现有 `lilydesign.cn`（3000） | 未改动、未重启 |

初始管理员密码只在部署时生成并已告知，服务器上不保留明文；如需重置，执行 `npm run hash-password` 后在 `.env` 更新哈希（记得转义 `$`）并重启服务。

## 三、Vercel 部署记录（2026-11-04 重新发布）

- 说明：原 `kejieleungs-projects/yanhanzi` 项目已无法访问（CLI 提示项目被删除/转移或无权访问，`https://yanhanzi.vercel.app` 返回 404）。本次在当前可用的 `kecenthk-6563s-projects` 空间新建 `yanhanzi` 项目并发布展示版。
- 正式网址：https://yanhanzi.vercel.app（别名已绑定）
- 部署网址：https://yanhanzi-2khttvfaq-kecenthk-6563s-projects.vercel.app
- Vercel项目：`kecenthk-6563s-projects/yanhanzi`
- 项目ID：`prj_bb3xeVSh6UXaVddfpXKbU2O1c1eJ`；团队ID：`team_NMrZNoEDiumE4OoBlYhcToMu`
- 部署ID：`dpl_F8PJazRmaRsqK31TYkNkgioUj825`
- 环境：production；Vercel状态：READY（构建约 47s）。
- 框架：Next.js 16.4.3 / React 19.3.1；Tailwind CSS 4.3.3。
- 部署源：本地 `website/` 目录，经 Vercel CLI 上传；Git 仓库 `kecenthk/yanhanzi` 已关联，但 Hobby 套餐不支持私有仓库协作部署，提交作者 `kejieleung` 非项目成员时 Git 部署会被阻止（需仓库转 Public、改用项目成员身份提交或升级 Pro）。框架预设已在 `vercel.json` 固定为 `nextjs`。
- 环境变量：未配置（`.vercelignore` 已排除 `.env*`，密钥未上传）。
- 部署保护：保留默认 Vercel SSO 保护（`all_except_custom_domains`），未登录访问会看到登录页或 404。若需公网匿名访问，需在 Project Settings → Deployment Protection 关闭。
- 本地校验：TypeScript、ESLint 通过，测试 4/4 通过；Windows 本机 `next build` 因 `.next/node_modules/mysql2-*` junction 的 `EPERM` 失败（本地文件锁环境问题），Vercel 远程构建正常通过。

该版本为展示版。若继续在 Vercel 运行含后台的完整代码，需配置公网可访问的 MySQL；文件系统上传目录不适合无状态部署，建议改用持久化存储或对象存储。VPS 自托管是包含后台管理时的推荐方式。

## 四、展示版验证结果（历史记录）

| 检查 | 结果 |
|---|---|
| 单元与安全回归测试 | 4/4通过，含无JavaScript时没有原生提交路径 |
| ESLint | 通过，无错误或警告 |
| TypeScript | 通过 |
| 本地生产构建 | 通过 |
| Vercel远程生产构建 | 通过，READY |
| 主要页面、robots、sitemap与health | 13项GET均返回200 |
| 不存在的案例 | 返回404 |
| 未开通咨询接口 | POST返回503及CONTACT_NOT_CONFIGURED |
| 首页响应式 | 320、390、768、1024、1440宽度标题两行，无横向溢出 |
| 手机主要页面 | 案例、方法、服务、人物、联盟、联系、说明页无横向溢出，未发现加载失败图片 |
| 浏览器交互 | 手机菜单展开关闭与跳转、案例进入详情、提纲生成、复制均通过 |
| 无JavaScript状态 | 点击生成按钮不导航、不附带查询参数、不提交信息 |
| 浏览器应用错误 | 最终线上检查为空 |
| 发布后运行错误日志 | 查询当前项目production最近30分钟，未返回错误日志；仅代表此查询范围，不代表持续监控 |

## 五、仍待业务配置

- 公开手机号、微信/企业微信、邮箱、接待地址与服务时间。
- 正式经营主体及相应公开信息。
- 原始案例图公开权限、署名与服务分工确认；完整项目资料与实景状态。
- 实际11节点流程、团队履历与联盟具体权益。
- 正式咨询接收系统、隐私处理和跟进负责人。当前默认关闭，需在后台「站点设置」开启。
- 自有域名、长期监控与素材备份策略。

账户、环境秘密与`.env.local`未上传为网站资源。
