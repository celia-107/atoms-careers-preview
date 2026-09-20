# Atoms 招聘页面设计预览

以柔和色彩和蛋仔形象呈现的招聘前端，包含产品介绍、工作方式、岗位筛选、岗位详情、招聘流程和 FAQ。

**岗位已切换为飞书招聘实际数据。** 数据范围是用户确认可公开的全部“招聘中”岗位，工作地点为深圳和厦门。岗位职责与要求保留源内容；未核验的投递链接不编造，面试流程和团队案例的示例说明仍保留。页面不收集个人资料。

- [在线预览](https://celia-107.github.io/atoms-careers-preview/)
- [海报预览](https://celia-107.github.io/atoms-careers-preview/poster/index.html)

## 开发与发布

使用 Node.js 24、React、TypeScript 和 Vite。

```sh
npm ci
npm run dev
npm run typecheck
npm run test:jobs
npm run build
npm run preview
```

推送到 `main` 后，GitHub Actions 自动检查并发布 `dist` 到 GitHub Pages，使用飞书数据模式。生产站点的基础路径为 `/atoms-careers-preview/`，修改仓库名时需同步修改构建路径。开发环境仍使用根路径，显式 `VITE_JOBS_SOURCE=mock` 可检查独立示例数据。

## 内容与数据边界

- `src/types/jobs.ts` 定义前端统一的 `Job` 类型。
- `src/data/mockJobs.ts` 保存四条示例岗位。
- `public/data/jobs.json` 保存最近一次从飞书同步的招聘中岗位，含同步时间。这是同步快照，尚未配置后台定时更新。
- `src/services/jobs.ts` 是唯一的岗位获取层，导出 `getJobs()` 和数据来源展示配置 `jobsPresentation`。
- `src/services/jobsContract.ts` 同时校验浏览器读取与构建所需数据。
- `scripts/feishu/normalizeActiveJobs.ts` 按 `active_status === 1` 映射经授权公开的字段，不使用官网渠道状态过滤。
- `src/data/careerStory.ts`、`src/data/careerInfo.ts` 保存产品、工作方式、流程及 FAQ 文案。
- `public/mascots/`、`public/poster/` 保存页面形象和海报素材。

本次通过已有飞书连接器完整分页读取岗位，再生成白名单 JSON。原始响应、负责人、人员 ID 和鉴权信息不进入仓库。之后可将完整且已确认的岗位导出文件传给 `npm run jobs:import -- <文件路径>`，检查后提交公开 JSON 并发布。禁止将仅一页结果作为完整数据同步。

`config/feishu-apply-urls.json` 保存已核验的正式投递链接，按岗位 ID 对应；未配置时页面明确提示链接待补充。后续自动同步仍需服务端鉴权，GitHub Pages 不能存储飞书密钥。面试流程、投递地址、联系入口、产品案例和团队介绍仍待补全。

## 品牌素材

品牌名称和形象素材用于此招聘页面设计预览；本仓库未额外授予第三方使用品牌素材的许可。
