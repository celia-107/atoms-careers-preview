import { mascots } from './mascots'

export type ProductTask = {
  id: string
  label: string
  title: string
  description: string
  tasks: string[]
  outcome: string
  sourceJobId: string
  mascot: string
  tint: 'lilac' | 'mint' | 'cream'
}

export type WorkStep = {
  id: string
  number: string
  label: string
  title: string
  description: string
  detail: string
  mascot: string
}

/** Editorial copy is separate from the job service; task links resolve against its current jobs. */
export const careerStory = {
  hero: {
    eyebrow: 'HELLO, VIBE CODERS.',
    title: '好想法，',
    titleAccent: '一起做出来。',
    product: 'Atoms 让你用自然语言，把想法变成可上线的产品。',
    invitation: '我们在寻找能理解问题、借助 AI 交付，并主动验证迭代的 Vibe\u00a0Coder。',
    jobsAction: '查看岗位',
    applyAction: '直接申请',
    byline: 'HUMAN IMAGINATION. AI POSSIBILITY.',
  },
  product: {
    eyebrow: '02 / WHY ATOMS NEEDS YOU',
    title: '为什么 Atoms 需要 Vibe Coder',
    description: '让想法走向上线，需要把用户问题、AI 能力和工程实现连起来。我们期待能走完这段路的人。',
    context: [
      {
        label: '我们正在解决的问题',
        title: '让创造产品，变得更容易',
        description: '把复杂的 AI Agent 能力变成直观的使用体验，让用户从描述想法，到构建、上线产品的过程更顺畅、更可靠。',
      },
      {
        label: 'AI 如何进入日常工作',
        title: '用 AI 创造，也用工程验证',
        description: '在 Growth、SEO 等工程岗位中，Claude Code、Codex 参与日常开发；测试、评测和代码审查帮助我们检查结果。',
      },
    ],
    tasksLabel: '你会参与的真实任务',
    sourceNote: '整理自公开岗位，具体职责以岗位详情为准。',
    taskListLabel: '你会做什么',
    outcomeLabel: '交付的方向',
    jobAction: '查看相关岗位',
    fallbackAction: '查看当前岗位',
    tasks: [
      {
        id: 'core-experience',
        label: '核心产品体验',
        title: '把复杂的 Agent，变成好用的产品',
        description: '与算法、设计一起，把 AI Agent 的编排能力转化为直观的界面和稳定的产品能力。',
        tasks: ['贯穿前端、后端与云端，完成产品能力开发', '与算法、设计配合，打磨用户实际使用的体验', '从部署上线到性能优化，持续维护和迭代'],
        outcome: '可复用的产品能力，以及更顺畅的核心体验。',
        sourceJobId: '7593964671033100563',
        mascot: mascots.snow,
        tint: 'lilac',
      },
      {
        id: 'growth-experiments',
        label: '增长实验',
        title: '把一个增长想法，做成可验证的实验',
        description: '从用户反馈和业务数据出发，选择值得先解决的问题，亲手完成分析、原型、实现和效果验证。',
        tasks: ['定位注册、激活等环节的问题，明确实验指标', '搭建页面、Demo 或工具，推动实验上线', '复盘实际效果，把有效方法沉淀为 Agent 能力'],
        outcome: '能追踪效果、继续迭代的增长产品与工具。',
        sourceJobId: '7682689678470662454',
        mascot: mascots.mint,
        tint: 'mint',
      },
      {
        id: 'seo-agent',
        label: 'SEO Agent',
        title: '让有效的方法，成为可复用的工具',
        description: '面对真实页面、流量与用户，把关键词发现、页面生成、发布校验和效果反馈连起来。',
        tasks: ['搭建页面生成、更新与生命周期管理流程', '将技术 SEO 检查、发布校验和回滚接入流程', '结合收录、流量与转化数据，持续改进 Agent'],
        outcome: '能稳定复用、效果可追踪的 SEO Agent 工具。',
        sourceJobId: '7682688742339184932',
        mascot: mascots.blue,
        tint: 'cream',
      },
    ] satisfies ProductTask[],
  },
  work: {
    eyebrow: '03 / HOW WE WORK',
    title: '工作方式：从想法到产品',
    description: '我们眼中的 Vibe Coder，能借助 AI 加快动手，也愿意对判断、细节和最终交付负责。',
    caseLabel: '从一个问题开始，把每一步做扎实',
    stepHint: '点击了解每一步',
    steps: [
      {
        id: 'understand',
        number: '01',
        label: '明确问题',
        title: '先找到值得做的问题',
        description: '结合用户反馈、产品与业务数据，明确目标、优先级和验证标准，把模糊想法拆成可以动手的任务。',
        detail: '先说清楚：为谁做、解决什么，以及怎样判断它有用。',
        mascot: mascots.pink,
      },
      {
        id: 'collaborate',
        number: '02',
        label: 'AI 协作',
        title: '借助 AI，做出第一版',
        description: '把目标、上下文与约束交给 AI 编程工具，探索方案、编写代码、连接工具，做出能运行的页面、工具或服务。',
        detail: '人来决定方案、检查实现，并解释关键的产品与工程取舍。',
        mascot: mascots.explorer,
      },
      {
        id: 'validate',
        number: '03',
        label: '协作与试错',
        title: '一起检查，也一起修正',
        description: '与产品、设计和工程伙伴一起试用，用测试、评测和代码审查检查体验与质量。发现问题就复现、修正，再验证。',
        detail: '带着可运行的版本讨论，让具体反馈推动下一次修改。',
        mascot: mascots.mint,
      },
      {
        id: 'deliver',
        number: '04',
        label: '交付与迭代',
        title: '上线之后，继续迭代',
        description: '用用户反馈、监控和实际数据判断结果，持续改进可靠性与体验，把验证有效的做法沉淀为可复用能力。',
        detail: '交付包括上线，也包括后续维护、效果验证和必要的回滚。',
        mascot: mascots.orange,
      },
    ] satisfies WorkStep[],
    closing: '从想法到第一版，再到真正可用。每一步，都有你的判断。',
  },
} as const
