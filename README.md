# Academic Atlas（个人学术地图）

一个以地图为入口的个人学术情报与人脉管理 Web 应用：管理研究方向、老师、论文动态、自动发现候选以及私密互动记录。

## 当前可运行功能

- 世界地图与大洲切换、研究方向和标签筛选
- 老师资料库、详情页、外部学术身份与论文列表
- 全局搜索（姓名、机构、地区、标签、研究方向与论文）
- 候选老师审核：加入地图、暂时忽略、排除与批量操作
- 手动新增老师与人工字段锁定
- 研究方向创建与独立地图入口
- 私人互动时间线和本地记录
- 论文动态、数据来源和同步状态展示
- 深色模式、响应式桌面/平板布局
- OpenAlex Provider、模拟 Provider、发现 API 和定时同步 API 骨架
- PostgreSQL/Prisma 完整数据模型
- JSON 本地备份导出

默认采用演示数据和浏览器 `localStorage`，无需数据库或 API 密钥即可体验全部 MVP 页面。人工录入的数据会保留在当前浏览器中。

## 本地启动

要求：Node.js 20.9+（已在 Node.js 22 下验证）。

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。公开网页版发布后位于 `https://fitzet.github.io/Academic_Map/`。

生产构建：

```bash
npm test
npm run build
npm start
```

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写：

```bash
DATABASE_URL="postgresql://academic_map:password@localhost:5432/academic_map?schema=public"
OPENALEX_API_KEY=""
SEMANTIC_SCHOLAR_API_KEY=""
ORCID_CLIENT_ID=""
ORCID_CLIENT_SECRET=""
IEEE_API_KEY=""
CRON_SECRET="change-me"
```

OpenAlex 基础查询可以在无密钥时运行；正式部署建议配置密钥并设置请求额度与缓存。Google Scholar 仅作为老师档案中的外部链接，不作为自动抓取来源。

## 数据库

Prisma 模型位于 `prisma/schema.prisma`，包含需求中的全部核心实体。配置 PostgreSQL 后运行：

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

当前界面使用本地演示仓库，便于零配置验收。接入生产数据库时，将 `AcademicMapProvider` 的本地操作替换为对应 API/Server Action；页面组件与领域规则无需重写。

## Android APK

应用使用 Capacitor 封装，Android 工程位于 `android/`。GitHub tag `v*` 会触发 `.github/workflows/android-release.yml`：构建签名版 APK、创建 GitHub Release 并上传 APK。

手机 App 每 24 小时访问一次 GitHub Releases API。检测到比内置版本号更高的 Release 后，会显示更新提示并打开对应 APK 下载地址；安装更新仍需用户确认，这是 Android 的安全要求。

本机 Android SDK 位于 `E:\APP_Design`。如需本地构建，还需安装 JDK 21，然后执行：

```bash
npm run build:mobile
npx cap sync android
cd android
gradlew assembleRelease
```

发布说明见 [`docs/RELEASING.md`](docs/RELEASING.md)。

## Provider

Provider 接口位于 `src/lib/providers/types.ts`。当前包含 OpenAlex 和 Mock 实现，Semantic Scholar、ORCID、Crossref、DBLP、IEEE 可按相同接口继续扩展。GitHub Pages 和 APK 是纯客户端静态版本，因此正式的自动抓取与定时任务需要部署独立后端服务，避免在客户端暴露 API 密钥。

## 数据保护规则

- 自动发现结果只能进入候选区，不能直接进入正式地图。
- `FieldOverride` 与前端 `lockedFields` 记录人工锁定字段。
- 自动更新合并逻辑不会覆盖人工锁定字段。
- 私人互动记录不进入 Provider 请求。
- 论文优先按 DOI 去重，无 DOI 时按标准化标题和年份去重。
- 自动字段应保存来源与最后更新时间。

## 测试

```bash
npm test
```

测试覆盖论文去重、人工字段优先级，以及跨老师/机构/标签/论文搜索。

详细的信息架构、数据库设计、用户流程和技术架构见 [`docs/PRODUCT_ARCHITECTURE.md`](docs/PRODUCT_ARCHITECTURE.md)。
