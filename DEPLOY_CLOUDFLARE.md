# Cloudflare 部署说明

这个项目已经改造成 Cloudflare Pages + Nuxt server routes + D1 数据库。

## 1. 登录 Cloudflare

```powershell
npx wrangler login
```

## 2. 创建 D1 数据库

```powershell
npx wrangler d1 create knowledge_base
```

命令会输出 `database_id`。把它复制到 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "knowledge_base"
database_id = "这里换成你的 database_id"
```

## 3. 初始化数据库表

```powershell
npx wrangler d1 migrations apply knowledge_base --remote
```

## 4. 设置登录密钥

在 Cloudflare Pages 项目的环境变量里新增：

```text
SESSION_SECRET=一段足够长的随机字符串
```

## 5. 手动部署

```powershell
npm run build:cloudflare
npx wrangler pages deploy dist --project-name=nuxt-knowledge-base
```

## 6. GitHub 自动部署

仓库已经包含 `.github/workflows/deploy-cloudflare.yml`。

你需要在 GitHub 仓库里添加两个 Secrets：

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

然后每次 push 到 `main` 分支都会自动部署到 Cloudflare Pages。

## 后续使用

部署完成后：

1. 打开站点。
2. 注册账号。
3. 在工作台右侧新增笔记。
4. 选择分类：英语、前端、公众号、小红书、证书。
5. 以后新增内容不需要改代码。
