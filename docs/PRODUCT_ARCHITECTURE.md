# Academic Atlas 产品与技术设计

## 1. 产品信息架构

```text
Academic Atlas
├─ 学术地图（首页）
│  ├─ 全局搜索
│  ├─ 研究方向切换
│  ├─ 世界 / 大洲地图
│  ├─ 老师区域列表
│  ├─ 今日论文与同步摘要
│  └─ 快速新增 / 自动发现
├─ 研究方向
│  ├─ 方向配置与关键词
│  ├─ 代表论文 / 会议 / 种子老师
│  └─ 独立地图入口
├─ 学者资料库
│  └─ 老师详情
│     ├─ 基本信息与简介
│     ├─ 外部身份
│     ├─ 标签与研究方向
│     ├─ 论文列表
│     └─ 私人互动记录
├─ 候选老师
│  ├─ 匹配度与推荐理由
│  ├─ 身份及同名风险
│  └─ 接纳 / 忽略 / 排除 / 合并
├─ 论文动态
│  ├─ 搜索、年份与方向筛选
│  └─ 收藏、笔记、错误归属修正
└─ 系统设置
   ├─ Provider 状态
   ├─ 每日同步
   ├─ 隐私规则
   └─ 导入、导出与备份
```

## 2. 数据分层

| 层级 | 数据 | 更新策略 |
|---|---|---|
| 自动同步层 | OpenAlex、Semantic Scholar、ORCID 等公开元数据 | 可刷新，保存来源与时间 |
| 用户确认层 | 已确认老师、归属关系、人工修改 | 用户优先，支持字段锁定 |
| 私人数据层 | 标签、笔记、互动、爱好、合影、个人印象 | 仅当前用户可见，禁止发送给外部 Provider |

关键关系：`User → ResearchDirection ↔ Teacher ↔ Publication`；老师与研究方向、标签、论文均为多对多关系。`InteractionRecord` 和附件由用户与老师共同限定。`ExternalIdentity` 用于作者消歧，`FieldOverride` 保护人工内容，`SyncTask/SyncLog` 记录后台更新。

完整字段与约束见 `prisma/schema.prisma`。

## 3. 主要用户流程

### 自动发现

```text
创建研究方向 → 配置关键词/论文/会议/种子老师
→ Provider 检索论文 → 聚合作者 → 作者消歧
→ 机构定位与身份推断 → 计算匹配度
→ 候选审核区 → 用户确认 → 正式进入地图
```

### 每日论文更新

```text
定时任务 → 读取老师唯一身份 → 多 Provider 拉取
→ DOI / 标题+年份去重 → 判断归属置信度
├─ 高置信度：更新论文列表与同步日志
└─ 低置信度：进入人工审核
```

任何同步操作都先检查 `FieldOverride`，不得覆盖人工锁定字段。

### 私人互动

```text
老师详情 → 我的互动记录 → 新增见面/邮件/活动
→ 私密存储文本和附件 → 设置后续事项
```

该路径与公开资料同步服务隔离。

## 4. 技术架构

```text
Next.js App Router + TypeScript
├─ 页面与交互组件
├─ Local Demo Repository（当前 MVP）
├─ Domain Rules
│  ├─ 论文去重
│  ├─ 人工字段保护
│  └─ 全局搜索
├─ Academic Provider Adapters
│  ├─ OpenAlexProvider
│  └─ MockAcademicProvider
└─ PostgreSQL + Prisma（生产数据层）
   ├─ 公开/确认数据
   ├─ 私人互动数据
   └─ 同步任务与日志
```

地图采用 React Leaflet 与 OpenStreetMap 底图；生产环境可切换为有 SLA 的 MapTiler、Mapbox 或自托管 MapLibre 瓦片。后台任务可以使用独立 API 服务、BullMQ + Redis 与托管 Cron。附件使用 S3 兼容对象存储，并为私人附件生成短期签名 URL。

## 5. 项目目录

```text
Academic_Map/
├─ prisma/schema.prisma          # PostgreSQL 数据模型
├─ scripts/sync-papers.ts        # 同步任务入口
├─ src/app/                      # 页面与 API
│  ├─ candidates
│  ├─ directions
│  ├─ publications
│  ├─ settings
│  └─ teachers/[id]/interactions
├─ src/components/               # 地图、仪表盘、详情与表单
├─ src/lib/
│  ├─ providers/                 # 外部学术数据适配器
│  ├─ domain.ts                  # 领域规则
│  ├─ mock-data.ts               # 零配置演示数据
│  └─ types.ts
└─ src/lib/domain.test.ts        # 关键规则测试
```

## 6. 生产化路径

1. 将本地 Provider 替换为 Prisma Repository 和受身份验证保护的 Server Actions。
2. 为用户数据增加 Auth.js 或企业 OAuth，并在所有查询中强制 `userId` 范围。
3. 接入 BullMQ/Redis 或托管 Cron，实现幂等的每日同步。
4. 增加 Semantic Scholar、ORCID、Crossref、DBLP 和 IEEE Provider。
5. 将候选评分、作者消歧与机构地理编码拆分为可重试任务。
6. 为附件启用私有对象存储、病毒检查和签名下载。
7. 增加回收站、审计日志、加密备份和数据导入。

## 7. Web 与 Android 发布

- GitHub Pages 工作流构建带 `/Academic_Map` base path 的静态站点。
- Capacitor 工作流构建不带 base path 的离线 Web 资源并打包进 APK。
- Release APK 使用固定的私有签名密钥；后续版本必须使用同一签名，否则 Android 无法覆盖安装。
- App 启动后最多每 24 小时查询一次 `FITZET/Academic_Map` 的最新 GitHub Release。
- 新版本只做检测和下载提示，最终安装必须由用户在 Android 系统界面确认。
