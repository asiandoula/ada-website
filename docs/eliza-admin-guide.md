# ADA 官网更新通知 & Admin 系统使用指南

Hi Eliza,

ADA 官网已经全面更新上线了！请帮忙 review 一下，看有没有内容、设计、或功能上的问题。

**网站地址**: https://www.asiandoula.org
**管理后台**: https://admin.asiandoula.org

---

## 你的管理员账号

- **登录地址**: https://admin.asiandoula.org （会自动跳转到登录页）
- **邮箱**: eliza@asiandoula.org
- **密码**: 134398

---

## 官网更新内容（请 Review）

### 公共页面
- **首页**: 全新设计，包含培训照片、数据统计、合作伙伴、文章模块
- **For Families**: 全新品牌叙事页 — 坐月子/산후조리/里帰り 文化介绍、PPD 数据、doula 服务详解、保险覆盖指南
- **How We Train**: 从家庭视角展示 7 个培训模块（"你的 doula 学了什么"）
- **Verify a Doula**: 支持按姓名、Doula ID、证书编号搜索，公众和机构都能用
- **Doula Portal**: Doula 可以用 ID + 邮箱登录，查看证书、成绩、下载 PDF
- **Renew 页面**: 更新为 1 年有效期，两种续期方式（推荐信 or 重考）
- **Articles**: 14 篇文章已上线
- **Cookie 同意弹窗 + Google Analytics 已接入**

### 需要你特别看的
1. **For Families 页面**的坐月子介绍是否准确？
2. **How We Train** 的 7 个培训模块描述是否正确？
3. 各页面的文字内容有没有需要修改的？
4. 照片是否合适？

---

## Admin 后台功能指南

以下是你日常会用到的所有操作：

### 1. 新增 Doula（报名考试后录入）

**路径**: Admin → Doulas → + New Doula

填写：
- Full Name（英文名）*必填
- Chinese Name（中文名）
- Email
- Phone
- Training Provider（默认 Cooings）

系统会自动：
- 生成 Doula ID（格式 #YY-NNNN）
- 设置 Account Status = `Registered`
- 设置 Exam Status = `Not Started`

### 2. 批量录入考试成绩

**路径**: Admin → Exams → Record Exam Results

操作：
1. 填写 **Exam Session**（如 IRV-20260322-001）和 **Exam Date**
2. 选择 **Exam Type**（Postpartum / Birth）
3. **搜索框输入名字或 ID** → 点击添加（支持批量添加多人）
4. 填入 8 项子分数：
   - Terminology（术语）
   - Newborn（新生儿护理）
   - Lactation（母乳喂养）
   - Emergency（紧急情况）
   - Practical（实操）
   - Postpartum（产后护理）
   - Knowledge（知识）
   - Ethics（伦理）
5. 系统 **自动计算总分**（8 项平均）
6. **及格线 70 分** — 达到自动显示 PASS，不到显示 FAIL
7. 如需手动调整（比如 69 分但想让她通过）→ 点 **Override** 按钮，必须写理由
8. 点 **Save** → 自动更新 doula 的 Exam Status

**也可以在单个 Doula 详情页直接录入**: Admin → Doulas → 点击某个 doula → Exam Results 区域 → + Record Exam

### 3. 颁发证书（Grant Certification）

**路径**: Admin → Doulas → 点击某个 doula → Grant Certification

操作：
1. 选择 **Certificate Type**（Postpartum / Birth / CPR / IBCLC）
2. 设置 **Expiration Date**（默认 1 年后，可调整）
3. 点 **Grant Certification & Generate PDF**

系统会自动：
- 生成证书编号（如 ADA-PD-2026-0132）
- 生成 PDF 证书（填入姓名、编号、到期日期）
- 上传 PDF 到云存储
- 如果 doula 状态是 Registered，自动变为 Active
- Doula 可以在 Portal 下载 PDF

**注意**: 同一 doula + 同一类型 只能有一张证书，不会重复生成。

### 4. 证书续期（Renew）

**路径**: Admin → Doulas → 点击某个 doula → Certification Renewal

操作：
1. 查看当前到期日期
2. 设置 **新的到期日期**（默认 +1 年，可调整）
3. 点 **Renew & Regenerate PDF**

系统会自动生成新的 PDF（新日期）并替换旧的。

### 5. 重新生成 PDF（信息修改后）

如果 doula 改了名字或其他信息：
- Admin → Doulas → 点击该 doula → Certificates 表格 → 点 **Regen PDF**

### 6. 撤销证书（Revoke）

- Certificates 表格 → 点 **Revoke**（需要确认，不可撤销）
- 撤销后 Verify 页面会显示红色 "CREDENTIAL REVOKED"

### 7. 修改 Doula 状态

**路径**: Admin → Doulas → 点击某个 doula → Profile 区域

两个状态字段：
- **Account Status**: Registered / Active / Under Investigation / Suspended / Revoked / Retired
- **Exam Status**: Not Started / Scheduled / Passed / Failed

### 8. 删除 Doula

**路径**: Admin → Doulas → 点击某个 doula → 页面最底部 Danger Zone

⚠️ 会同时删除该 doula 的所有考试记录、证书、凭证。不可恢复。

### 9. Excel 批量导入

**路径**: Admin → Doulas → 📥 Import Excel 按钮

上传 Excel 文件，系统自动：
- 匹配已有的 doula（按 Doula ID）
- 新的自动添加
- 已有的自动更新（名字、状态、日期等）
- 不变的跳过

### 10. Dashboard

**路径**: Admin → Dashboard

显示：
- 总 Doula 数、Active 数、即将到期数、证书总数
- 90 天内到期列表（可直接点击续期）
- 过期未续期列表
- 最近活动（新考试、新证书）

---

## 常见流程总结

```
新学员报名 → 新增 Doula (Registered)
    ↓
考试 → 批量录入成绩 (Exam Status → Passed/Failed)
    ↓
通过 → Grant Certification (Status → Active, PDF 自动生成)
    ↓
1 年后 → Renew (新 PDF 自动生成)
    ↓
如有问题 → 修改 Status (Suspended / Under Investigation / Revoked)
```

---

## 有问题？

- 技术问题联系 Six
- 后台操作问题可以参考这个文档

请帮忙 review 网站内容，有任何问题直接告诉我！

谢谢 🙏

— Six
