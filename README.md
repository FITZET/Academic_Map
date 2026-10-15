# Academic Map

一个极简的本地个人学术地图：在世界地图上按研究方向查看研究者分布；点进研究者后，记录标签和私人与其的互动。

## 当前功能

- 离线内置世界地图与红色研究者标记
- 按研究方向、标签和大洲筛选地图
- 研究者详情页：添加、移除和新建标签
- 私人互动记录：日期、地点、场景、记录、爱好和后续事项
- 所有数据仅保存到当前浏览器或 Android App 的本地存储

论文、自动发现、候选审核、云端同步、搜索、设置和资料库页面已从界面中移除。

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

GitHub tag `v*` 会构建签名 APK 并发布到 GitHub Releases。应用每 24 小时检查一次 Release，以提示可用更新；安装更新仍需 Android 用户确认。

本机 Android SDK 已配置在 `E:\APP_Design`。本地构建还需要 JDK 21：

```bash
npm run build:mobile
npx cap sync android
cd android
gradlew assembleRelease
```
