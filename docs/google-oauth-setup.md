# ADA Admin — Google 登录启用手册（给 Seth / 有 Supabase 后台权限的人）

代码已经写好并部署：域白名单（`@cooings.com` / `@asiandoula.org`）已在生效，Google 登录按钮和回调路由已就位，但**按钮默认隐藏、Google provider 默认关闭**，需要下面几步手动配置才会亮。全程约 15 分钟，不碰代码。

> 白名单 = 单一事实源 `src/lib/auth/access.ts`。以后加/减允许的域，只改那一个文件里的 `ALLOWED_ADMIN_DOMAINS`。

## 前提：这些必须由后台 owner 做（Claude MCP 够不到 ADA 的 Supabase）

Supabase 项目：`sztqpeebrvgualvegbxd`

### 1. 建 Google OAuth Client（Google Cloud Console，~5 分钟）
1. console.cloud.google.com → 选一个项目（或新建，如 `ada-web-auth`）
2. **APIs & Services → OAuth consent screen**：Internal（如果 asiandoula.org 是同一个 Workspace org）或 External，填基本信息
3. **Credentials → Create Credentials → OAuth client ID → Web application**
4. **Authorized redirect URI** 填这一条（Supabase 的回调，不是网站的）：
   ```
   https://sztqpeebrvgualvegbxd.supabase.co/auth/v1/callback
   ```
5. 保存，拿到 **Client ID** 和 **Client Secret**

### 2. 在 Supabase 后台开 Google provider（~3 分钟）
1. Supabase Dashboard → **Authentication → Providers → Google** → Enable
2. 粘贴上一步的 Client ID / Client Secret，保存
3. **Authentication → URL Configuration → Redirect URLs** 里加上（网站侧回调）：
   ```
   https://www.asiandoula.org/auth/callback
   ```
   Site URL 设为 `https://www.asiandoula.org`

### 3. 关掉公开注册（重要，防御纵深）
**Authentication → Sign In / Providers → 关闭 "Allow new users to sign up"**（即 `disable_signup = true`）。
✅ **2026-07-16 已关闭**。关掉注册从源头断掉"外人自助建号"；走 Google 登录后根本不需要公开注册。

### 4. 登录页 Google 按钮
~~原本用 `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` env 门控~~ → **2026-07-16 已移除门控，按钮默认常显**，无需任何 Vercel env 配置。provider 开好后按钮即生效。

配好后，登录页会出现「Sign in with Google」，6 个人用各自的 @cooings.com / @asiandoula.org Google 账号一键登录，非白名单的 Google 账号会被自动踢回登录页并提示未授权。

## 验证（配置完之后）
1. 用一个 @cooings.com 账号点 Google 登录 → 应进 `/admin/dashboard`
2. 用一个私人 @gmail.com 账号点 Google 登录 → 应被踢回 `/admin/login?error=unauthorized`

## 收尾（Google 登录稳定跑一阵后，可选）
- 删除登录页的邮箱/密码表单，彻底弃用密码（代码里 `handleLogin` 那段）
- 那时也不再需要密码找回系统（没有密码可找回）
- 现有 6 个密码账号可以保留作应急，或在 Supabase 后台删掉密码身份只留 Google

## 当前账号（截至 2026-07-15）
6 个 auth 账号，全在白名单域内：`dongxuan@cooings.com`、`yiman@cooings.com`、`eliza@asiandoula.org`、`dev@asiandoula.org`、`perryn@asiandoula.org`、`susan@asiandoula.org`。切 Google 登录后它们能直接用同名 Google 账号登入，无需迁移。
