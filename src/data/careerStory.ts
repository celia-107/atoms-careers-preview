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
    eyebrow: '03 / HOW WE WORK',
    title: 'AI 加速动手，人来决定方向。',
    description: '下面是一段招聘页面的前端示例流程。它展示协作方式，不承诺特定结果，也不替代每个项目自己的判断。',
    caseLabel: '示例案例 · 招聘页面前端',
    stepHint: '点击步骤，看看一个想法如何推进',
    steps: [
      {
        id: 'understand',
        number: '01',
        label: '问题',
        title: '先把候选人真正想知道的事说清楚',
        description: '从“你们在做什么、我会做什么、怎么申请”出发，拆出页面需要回答的问题。',
        detail: '人的判断：确认受众、语气和不能虚构的信息；AI 可以帮助整理访谈、归纳问题和提出页面结构草案。',
        mascot: mascots.pink,
      },
      {
        id: 'collaborate',
        number: '02',
        label: 'AI 协作',
        title: '让 AI 先把可讨论的版本做出来',
        description: '用文字、草图和组件快速试出首屏、产品介绍和岗位路径，再由团队一起挑选方向。',
        detail: '人的判断：选择真正贴合品牌的表达，检查内容来源和边界；AI 负责加速探索，不负责替团队作决定。',
        mascot: mascots.explorer,
      },
      {
        id: 'validate',
        number: '03',
        label: '验证',
        title: '让真实的人点一遍、问一遍',
        description: '观察页面是否易懂、按钮是否找得到、岗位信息是否足够，记录疑问后再修改。',
        detail: '人的判断：安排走查、阅读反馈并决定取舍；AI 可以协助生成检查清单和复现问题，不能代替真实使用者。',
        mascot: mascots.mint,
      },
      {
        id: 'deliver',
        number: '04',
        label: '交付',
        title: '把一个能继续维护的版本交到手里',
        description: '收拢内容、状态和响应式细节，让后续接入岗位数据时只需要替换数据层。',
        detail: '人的判断：确认验收范围、记录已知限制并交接维护方式；AI 可以帮助检查遗漏和整理文档。',
        mascot: mascots.orange,
      },
    ] satisfies WorkStep[],
    boundaryTitle: '我们眼中的 Vibe Coder',
    boundary: [
      '人负责目标、事实、优先级与最终取舍。',
      'AI 负责探索、整理、生成草案与重复检查。',
      '每一次交付都需要真实走查、修正和确认。',
    ],
    traits: [
      { title: '理解问题', description: '先问为什么，再开始动手。' },
      { title: 'AI 交付', description: '借助 AI，把想法推进为产品。' },
      { title: '主动验证', description: '检查、试用、修正，继续迭代。' },
      { title: '产品判断', description: '理解用户，也看见工程取舍。' },
    ],
    note: '示例内容用于说明工作方式；真实项目会根据团队和用户反馈继续变化。',
  },
} as const
