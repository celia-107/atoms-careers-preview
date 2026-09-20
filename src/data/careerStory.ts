import { mascots } from './mascots'

export type ProductDemo = {
  id: string
  label: string
  title: string
  description: string
  audience: string
  problem: string
  steps: string[]
  prompt: string
  result: string
  mascot: string
  tint: 'lilac' | 'mint'
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

export const careerStory = {
  product: {
    eyebrow: '02 / WHAT WE ARE BUILDING',
    title: '把一个想法，变成可以使用的产品。',
    description: 'Atoms 服务想把事情做出来的创造者：从一句模糊的念头开始，借助 AI 组织信息、搭出界面，再回到真实问题里验证。',
    note: '以下为产品方向示意，不代表实际客户截图或已发布成果。',
    demoStatus: '交互示意',
    demosLabel: '切换一个产品想象',
    preview: {
      browserLabel: '一个可以点击的小原型',
      badge: '交互示意',
      activity: {
        eyebrow: 'A LITTLE IDEA CLUB',
        title: '给一个小想法，留出一个下午。',
        description: '把好奇心带来，一起做点有意思的东西。',
        tags: ['创意交流', '动手做', '作品分享'],
        action: '预览报名',
        close: '收起提示',
        confirmation: '这是报名入口的交互示意。真实活动信息、表单和提交功能尚未开放。',
      },
      tasks: {
        eyebrow: 'MY LITTLE WORKSPACE',
        title: '今天，先做这三件事。',
        description: '点击任务，体验完成一个小步骤的感觉。',
        reset: '重置示例',
        progressLabel: '项已完成',
        items: [
          { id: 'problem', label: '说清一个真实问题', meta: '先想一想，再开始' },
          { id: 'prototype', label: '做出一个可点击的原型', meta: '借助 AI，快速试一版' },
          { id: 'feedback', label: '找一个人试用', meta: '带着反馈，继续迭代' },
        ],
      },
    },
    demos: [
      {
        id: 'launch-page',
        label: '活动页',
        title: '一页讲清一个新想法',
        description: '为正在准备活动的创作者，把主题、时间和行动入口组织成一页轻量页面。',
        audience: '适合：需要快速验证表达方式的个人与小团队',
        problem: '信息散落在聊天记录、文档和表格里，访客很难知道下一步要做什么。',
        steps: ['整理目标与受众', '生成页面结构', '邀请一位真实访客试用'],
        prompt: '“帮我把这次活动的重点，排成一个让人愿意报名的页面。”',
        result: '示意交付：一个可继续编辑、预览和迭代的活动页。',
        mascot: mascots.snow,
        tint: 'lilac',
      },
      {
        id: 'personal-tool',
        label: '个人工具',
        title: '把重复工作收进一个小工具',
        description: '为有明确工作流的创作者，把每天反复整理、筛选和跟进的步骤变成一个可操作的界面。',
        audience: '适合：想先解决自己一个具体问题的实践者',
        problem: '手动复制和核对消耗了注意力，却没有留下可以复用的工作流。',
        steps: ['描述一条工作流', '快速搭出交互草图', '用自己的数据检查细节'],
        prompt: '“我每天都要做这三步，能不能先做一个只解决它的小工具？”',
        result: '示意交付：一个围绕单一任务、可以被反复使用的工具原型。',
        mascot: mascots.blue,
        tint: 'mint',
      },
    ] satisfies ProductDemo[],
  },
  work: {
    eyebrow: '03 / THE VIBE CODER MINDSET',
    title: '我们眼中的 Vibe Coder',
    description: '快速理解问题，借助 AI 做出可用的产品。主动验证、持续迭代，也对自己的判断和交付负责。',
    caseLabel: '从理解问题，到交付产品',
    stepHint: '点击看看，我们看重的四种能力',
    steps: [
      {
        id: 'understand',
        number: '01',
        label: '理解问题',
        title: '先想清楚，为什么要做',
        description: '快速理解用户、场景和目标，把模糊的需求拆成具体问题，找到值得先解决的那一个。',
        detail: '能说清楚：为谁做、解决什么，以及怎样判断它有用。',
        mascot: mascots.pink,
      },
      {
        id: 'collaborate',
        number: '02',
        label: 'AI 交付',
        title: '借助 AI，把想法做出来',
        description: '善用 AI 探索方案、编写代码、连接工具，把一个想法推进成别人能打开、能使用的产品。',
        detail: '能展示一个可体验的版本，也能解释自己做了哪些关键决定。',
        mascot: mascots.explorer,
      },
      {
        id: 'validate',
        number: '03',
        label: '主动验证',
        title: '亲自验证，带着反馈迭代',
        description: '亲自运行、测试和试用，主动检查 AI 的输出。发现问题就定位、修正，再用真实反馈推进下一版。',
        detail: '能讲清楚：哪里出过问题、如何验证，以及后来改好了什么。',
        mascot: mascots.mint,
      },
      {
        id: 'deliver',
        number: '04',
        label: '产品与工程判断',
        title: '知道先做什么，也懂得取舍',
        description: '理解用户价值，也考虑实现成本、可靠性与维护。在速度和质量之间做出有依据的选择。',
        detail: '能解释为什么这样做、哪些可以暂缓，以及怎样让产品持续可用。',
        mascot: mascots.orange,
      },
    ] satisfies WorkStep[],
    closing: '把好奇心变成行动，把想法做成真正可用的产品。',
  },
} as const
