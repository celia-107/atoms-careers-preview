# Atoms 招聘页面设计预览

以柔和色彩和蛋仔形象呈现的招聘前端，包含产品介绍、工作方式、岗位筛选、岗位详情、招聘流程、FAQ 与演示投递入口。

**本项目是设计预览。岗位、地点、用工类型、职责和流程均为示例，不代表正式招聘信息；不收集个人资料。**

- [在线预览](https://celia-107.github.io/atoms-careers-preview/)
- [海报预览](https://celia-107.github.io/atoms-careers-preview/poster/index.html)

## 开发与发布

使用 Node.js 24、React、TypeScript 和 Vite。

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

推送到 `main` 后，GitHub Actions 自动检查并发布 `dist` 到 GitHub Pages。生产站点的基础路径为 `/atoms-careers-preview/`，修改仓库名时需同步修改构建路径。开发环境仍使用根路径。

## 内容与数据边界

- `src/types/jobs.ts` 定义前端统一的 `Job` 类型。
- `src/data/mockJobs.ts` 保存四条示例岗位。
- `src/services/jobs.ts` 是唯一的岗位获取层，导出 `getJobs()` 和数据来源展示配置 `jobsPresentation`。
- `src/data/careerStory.ts`、`src/data/careerInfo.ts` 保存产品、工作方式、流程及 FAQ 文案。
- `public/mascots/`、`public/poster/` 保存页面形象和海报素材。

当前未接入飞书招聘。未来替换 `src/services/jobs.ts` 的获取与映射实现，同时更新 `jobsPresentation`；页面继续使用同一 `Job` 类型。飞书鉴权应放在服务端，GitHub Pages 只托管静态前端，不能存储飞书密钥。

上线正式招聘前，仍需确认真实岗位、JD、办公与远程政策、面试流程、投递地址、联系入口，以及产品案例和团队介绍。

## 品牌素材

品牌名称和形象素材用于此招聘页面设计预览；本仓库未额外授予第三方使用品牌素材的许可。
