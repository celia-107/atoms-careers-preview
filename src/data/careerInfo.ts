import { jobsPresentation } from '../services/jobs'

/**
 * 招聘页面非岗位数据。
 *
 * 工作地点已由团队确认为深圳、厦门；流程与联系方式仍按各处标注确认。
 * 文案保留在独立数据层，方便后续接入内容管理时替换。
 */
export type ProcessStep = {
  id: string
  number: string
  title: string
  description: string
  /** 用于轻量提示当前内容仍在确认中。 */
  status?: 'example' | 'confirmed'
}

export type FaqCategory = '岗位与地点' | '申请与作品' | '流程与协作'

export type FaqItem = {
  id: string
  category: FaqCategory
  question: string
  answer: string
}

export const CAREER_INFO = {
  process: {
    eyebrow: '05 / HOW WE MEET',
    heading: ['从一次交流，', '开始一起做事。'],
    introduction: ['我们希望尽早看到真实的思考和协作。', '下面是帮助你了解节奏的流程示例。'],
    asideTitle: '带着你真正做过的东西来。',
    asideDescription: '作品可以是一个网页、一个流程、一次实验，或任何能让我们看见你如何思考和迭代的东西。',
    notice: '流程示例 · 具体安排待团队确认',
  },
  faq: {
    eyebrow: '06 / BEFORE YOU APPLY',
    heading: ['还有问题？', '先从这里找到答案。'],
    introduction: ['关于岗位、作品和协作方式的常见问题。', '未确认的信息，我们会清楚标注。'],
    asideTitle: ['没有合适的岗位，', '也可以先认识彼此。'],
    asideDescription: '公开联系入口正在准备中。先看看你可以带来的问题和作品。',
  },
  contact: {
    title: '联系方式待补充',
    description: '我们正在确认公开联系入口。现在可以先准备好能代表你的作品，页面不会收集或发送个人信息。',
    preparation: [
      '一个可体验的 Demo、网页或 GitHub 链接',
      '你如何借助 AI 推进，以及怎样验证结果',
      '想和我们一起解决的一个真实问题',
    ],
  },
} as const

/** 流程示例，不代表当前真实招聘承诺。 */
export const CAREER_PROCESS: readonly ProcessStep[] = [
  {
    id: 'materials',
    number: '01',
    title: '材料',
    description: '准备一份能说明你是谁、做过什么的简短介绍，以及一个可以被体验或阅读的作品。',
    status: 'example',
  },
  {
    id: 'conversation',
    number: '02',
    title: '交流',
    description: '和团队聊聊你关注的问题、工作方式，以及你如何借助 AI 把想法推进到结果。',
    status: 'example',
  },
  {
    id: 'collaboration',
    number: '03',
    title: '协作验证',
    description: '围绕一个小问题共同推演或试做，了解彼此的判断、反馈和迭代节奏。',
    status: 'example',
  },
  {
    id: 'alignment',
    number: '04',
    title: '双方确认',
    description: '互相确认方向、职责和后续安排，再决定是否继续往前走。',
    status: 'example',
  },
]

/**
 * FAQ 的回答避免填入未经确认的政策、时限或承诺；真实招聘开放后可直接替换文本。
 */
export const CAREER_FAQS: readonly FaqItem[] = [
  {
    id: 'roles',
    category: '岗位与地点',
    question: '现在有哪些岗位？',
    answer: jobsPresentation.isMock
      ? '页面中的岗位目前是用于展示筛选和详情交互的示例数据，不代表当前真实岗位数量或开放状态。正式岗位会以岗位列表和对应的公开说明为准。'
      : '这里展示当前从飞书招聘同步的招聘中岗位。你可以按方向、地点和岗位类型筛选，查看职责与要求。点击“立即投递”可查看该岗位的投递信息；尚未配置正式链接的岗位会明确提示“投递链接待补充”。',
  },
  {
    id: 'location',
    category: '岗位与地点',
    question: '工作地点在哪里？',
    answer: jobsPresentation.isMock
      ? '不同岗位的地点要求可能不同，页面里的地点字段也是示例。具体办公地点、远程协作范围和到岗安排，需以目标岗位发布时的确认信息为准。'
      : '工作地点为深圳或厦门，具体以各岗位标注为准。详细办公地址和到岗安排可在沟通时与招聘团队确认。',
  },
  {
    id: 'internship',
    category: '岗位与地点',
    question: '会开放实习岗位吗？',
    answer: jobsPresentation.isMock
      ? '是否开放实习取决于具体岗位和团队安排。当前页面展示的用工类型仅用于演示筛选，不构成实习机会或名额承诺。'
      : '请通过“岗位类型”筛选查看当前公开的实习机会。如果列表中没有实习岗位，表示当前同步数据没有相应开放岗位；后续安排以招聘团队发布的信息为准。',
  },
  {
    id: 'portfolio',
    category: '申请与作品',
    question: '没有传统简历，可以只提交作品吗？',
    answer: '可以先准备一个能代表你思考和交付能力的作品、Demo 或仓库链接。正式投递时需要提交哪些材料，仍以对应岗位的公开说明为准。',
  },
  {
    id: 'take-home',
    category: '申请与作品',
    question: '申请时一定会有笔试吗？',
    answer: '目前没有已确认的统一笔试安排。某些岗位可能会通过小型协作或案例交流了解工作方式，具体形式和要求会在沟通时说明。',
  },
  {
    id: 'ai-work',
    category: '申请与作品',
    question: '作品里需要说明 AI 的使用方式吗？',
    answer: '如果作品使用了 AI，欢迎说明你如何提出问题、验证输出和做出取舍。我们更关注真实判断和最终交付，不要求把工具使用包装成固定模板。',
  },
  {
    id: 'process',
    category: '流程与协作',
    question: '从投递到沟通需要多久？',
    answer: '当前没有可以承诺的统一回复时限。流程模块展示的是帮助理解的示例路径，真实安排会结合岗位和团队情况沟通确认。',
  },
  {
    id: 'contact',
    category: '流程与协作',
    question: '暂时没有合适的岗位，怎么保持联系？',
    answer: '可以先准备好作品和你想解决的问题，等待公开岗位更新。联系方式目前尚未补充，点击“联系方式待补充”可查看说明；页面不会收集个人信息。',
  },
]

export const CAREER_FAQ_CATEGORIES: readonly ('全部' | FaqCategory)[] = [
  '全部',
  '岗位与地点',
  '申请与作品',
  '流程与协作',
]
