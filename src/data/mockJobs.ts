import type { Job } from '../types/jobs.js'

/**
 * 全部为示例：岗位名称、地点、用工类型、职责、能力要求和流程均未核验。
 * 数组长度用于界面测试，不代表 Atoms 当前真实招聘岗位数量。
 * 有意不设置 applyUrl，避免演示点击被误解为完成了正式投递。
 */
export const MOCK_JOBS: readonly Job[] = [
  {
    id: 'ai-product-engineer',
    title: 'AI 产品工程师',
    department: '产品与工程',
    location: '深圳 / 远程友好',
    employmentType: '全职',
    summary: '把真实用户问题拆成可验证的 AI 产品体验，从第一版原型推进到稳定交付。',
    responsibilities: [
      '与产品、设计和用户一起定义问题，快速搭建可用的端到端体验。',
      '使用 AI 工具完成探索、编码、测试与文档，把反馈转化为下一轮迭代。',
      '建立清晰的质量边界，持续关注性能、可维护性和真实使用效果。',
    ],
    requirements: [
      '能独立阅读问题、拆解任务，并用代码交付可工作的产品。',
      '熟悉现代 Web 开发基础，愿意理解数据、模型和产品之间的连接。',
      '有强烈的验证意识：会运行、观察、复盘，并修正自己的方案。',
    ],
    preferredQualifications: ['做过从 0 到 1 的工具或产品', '有 AI 应用、Agent 或工作流经验'],
    interviewProcess: ['线上交流：了解你的作品与工作方式', '异步小作业：围绕一个示例问题做出可使用的切片', '与团队共创：讨论取舍、反馈和下一步'],
    status: 'open',
  },
  {
    id: 'frontend-vibe-coder',
    title: '前端 Vibe Coder',
    department: '产品体验',
    location: '深圳',
    employmentType: '全职 / 实习',
    summary: '用前端把模糊想法变成有质感、能被使用的界面，和 AI 一起把速度变成体验。',
    responsibilities: [
      '负责从交互草图到上线页面的完整前端实现，保持细节和节奏感。',
      '和设计、产品一起定义组件与体验模式，沉淀可复用的界面系统。',
      '通过真实使用反馈持续打磨动效、响应式布局和无障碍细节。',
    ],
    requirements: [
      '熟悉 React 或同类框架，能写清晰、可迭代的前端代码。',
      '对排版、空间、交互状态有敏感度，愿意为一个细节多走一步。',
      '能用 AI 加速工作，也能判断 AI 输出是否真正可靠。',
    ],
    preferredQualifications: ['有个人产品、开源项目或可展示的作品集', '了解 TypeScript、组件设计或动效实现'],
    interviewProcess: ['作品交流：一起拆解你最满意的一个作品', '协作试做：把一个想法推进到可点击的界面', '团队沟通：对齐工作方式与成长方向'],
    status: 'open',
  },
  {
    id: 'product-designer-ai',
    title: 'AI 产品设计师',
    department: '产品体验',
    location: '远程友好',
    employmentType: '全职',
    summary: '设计人和 AI 协作的全新工作流，让复杂能力变得直接、清晰并且好用。',
    responsibilities: [
      '从用户目标出发，设计 AI 产品的信息架构、交互反馈和视觉语言。',
      '和工程师共同验证概念，在真实界面中快速试错，而不是只停留在稿件里。',
      '维护体验原则和设计系统，让每一次迭代都更一致、更有判断。',
    ],
    requirements: [
      '具备完整的产品设计能力，能讲清楚设计决策背后的用户问题。',
      '愿意理解技术边界，并能和工程师一起把方案做出来。',
      '乐于探索 AI 工具，把它作为思考和制作的日常协作者。',
    ],
    preferredQualifications: ['有 AI 产品或复杂工具类产品经验', '能用原型或代码快速验证交互'],
    interviewProcess: ['作品交流：讨论一个有取舍的设计决策', '共同工作：围绕真实需求完成一轮设计推演', '团队沟通：了解彼此的协作节奏'],
    status: 'open',
  },
  {
    id: 'community-operator',
    title: '创作者社区运营',
    department: '社区与增长',
    location: '上海 / 远程友好',
    employmentType: '全职',
    summary: '和一群愿意动手的人一起，让更多好想法被看见、被使用、被继续做下去。',
    responsibilities: [
      '策划创作者活动与内容栏目，建立真实、有来回的用户关系。',
      '观察社区信号，发现值得放大的作品和反馈，并推动跨团队协作。',
      '用数据和用户访谈复盘活动效果，持续提升参与和留存体验。',
    ],
    requirements: [
      '喜欢和人交流，也愿意亲自使用产品、理解创作者的工作流。',
      '能把复杂信息整理成清晰、有温度的内容和行动计划。',
      '有主人翁意识，能主动发现问题并推进到结果。',
    ],
    preferredQualifications: ['有开发者、设计师或 AI 创作者社区经验', '做过内容、活动或用户增长项目'],
    interviewProcess: ['工作方式交流：分享一次你主动推进的项目', '案例共创：为一群创作者设计一次活动', '团队沟通：对齐价值观与行动节奏'],
    status: 'open',
  },
]
