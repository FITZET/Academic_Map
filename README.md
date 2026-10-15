# Academic Map

一个极简的本地个人学术地图：在世界地图上按研究方向查看研究者分布；点进研究者后，记录标签和私人与其的互动。

## 当前功能

- 离线内置世界地图与红色研究者标记
- 按研究方向、标签和大洲筛选地图
- 自建研究领域并填写搜索关键词
- 配置自己的豆包方舟 API Key，通过豆包联网搜索发现学者；候选人经人工核对来源、机构和地理位置后才上图
- 研究者详情页：添加、移除和新建标签
- 私人互动记录：日期、地点、场景、记录、爱好和后续事项
- Android 系统返回键和屏幕左右边缘滑动返回
- 每次打开和从后台返回时检查 GitHub Release；最多每天请求一次，发现新 APK 后提示下载
- 领域、候选人、标签和互动记录保存在当前浏览器或 Android App 本地

内置研究者是**虚构示例**，不是实际学者。豆包返回的身份、网页和坐标都可能有误，必须打开来源核对。论文、云端同步和资料库页面不属于当前精简版。

## 豆包配置与隐私

在地图首页点「发现学者」→「配置豆包 API Key」。需要火山引擎方舟 API Key、支持联网搜索的模型权限；默认模型 ID 可在配置里修改。搜索使用方舟 Responses API 的豆包搜索源。只有领域名称和关键词会发给方舟；**私人互动和标签不会发送**。API Key 持久保存在本机的 WebView / 浏览器 localStorage，未加密；不要在共用设备上保存。可在配置中删除 Key。联网调用可能产生费用。

网页预览版从浏览器直接调用方舟，不经过本项目服务器。方舟当前允许该浏览器跨域请求，但如果其接口策略以后改变，网页端搜索可能失效；Android 本地地图和记录不受影响。应用不在 GitHub 仓库存储你的 Key 或私人数据。

## 本地启动

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

运行验证：

```bash
npm test
npm run build:pages
```

## Android APK

GitHub tag `v*` 会构建签名 APK 并发布到 GitHub Releases。应用在启动和回到前台时检查新版（成功查询后 24 小时内不重复请求）；有新版则提供 APK 下载链接。手机需要能访问 GitHub。Android 安装更新仍需用户确认，且必须保持相同包名和签名密钥；不会静默安装。

本机 Android SDK 已配置在 `E:\APP_Design`。本地构建还需要 JDK 21：

```bash
npm run build:mobile
npx cap sync android
cd android
gradlew assembleRelease
```
