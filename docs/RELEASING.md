# 发布新版本

## 首次发布

仓库需要配置以下 GitHub Actions Secrets：

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

签名材料不得提交到 Git。初次配置后必须保留同一密钥，否则未来 APK 不能覆盖安装旧版本。

## 后续版本

1. 更新 `package.json` 中的 `version`。
2. 更新 `src/lib/version.ts` 中的 `APP_VERSION`。
3. 更新 `android/app/build.gradle` 的 `versionCode` 和 `versionName`。`versionCode` 每次递增。
4. 提交并推送到 `main`，GitHub Pages 会自动更新。
5. 创建并推送同名 tag，例如：

```bash
git tag v0.2.0
git push origin v0.2.0
```

Android 工作流会构建签名 APK，创建 GitHub Release，并把 APK 作为下载附件。旧版 App 最多在 24 小时内检测到新 Release。

## 注意

- Release tag 必须使用可比较的语义版本，如 `v1.2.0`。
- 不要删除或更换 Android 签名 Secrets。
- GitHub Pages 是静态客户端，不应放置 OpenAlex、IEEE 或其他私密 API Key。
