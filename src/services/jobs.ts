/// <reference types="vite/client" />

import { MOCK_JOBS } from '../data/mockJobs'
import type { Job } from '../types/jobs'

type MockState = 'success' | 'loading' | 'empty' | 'error'

/**
 * 当前岗位来源的展示说明，与读取实现一起切换。
 * 页面只读这些标识，不自行推断真实数据是否属于演示内容。
 */
export type JobsPresentation = Readonly<{
  isMock: boolean
  listNote: string
  itemLabel: string
  detailNote: string
  /** 没有已核验 applyUrl 时展示，不用于覆盖正式投递链接。 */
  defaultApplyNote: string
}>

export const jobsPresentation: JobsPresentation = {
  isMock: true,
  listNote: '以下岗位、地点与流程均为演示内容，非真实招聘信息。',
  itemLabel: '示例岗位',
  detailNote: '以上职责、要求与面试流程均为示例，正式内容以招聘团队确认为准。',
  defaultApplyNote: '当前为演示投递入口',
}

function getMockState(): MockState {
  // 此显式开关只在本地开发环境生效；生产构建忽略 URL 中的模拟参数。
  if (!import.meta.env.DEV || typeof window === 'undefined') return 'success'

  const state = new URLSearchParams(window.location.search).get('mockState')
  return state === 'loading' || state === 'empty' || state === 'error'
    ? state
    : 'success'
}

function copyJob(job: Job): Job {
  return {
    ...job,
    responsibilities: [...job.responsibilities],
    requirements: [...job.requirements],
    preferredQualifications: job.preferredQualifications
      ? [...job.preferredQualifications]
      : undefined,
    interviewProcess: job.interviewProcess ? [...job.interviewProcess] : undefined,
  }
}

/**
 * 岗位读取边界：仅返回可以公开展示的开放岗位。
 * 接入真实数据时仅替换本文件中的来源和适配逻辑，保持返回类型不变。
 * 飞书密钥及请求认证必须留在服务端，不得添加到前端环境变量中。
 */
export async function getJobs(): Promise<Job[]> {
  const state = getMockState()

  if (state === 'loading') {
    // 有意保持等待以检查加载状态，无轮询、计时器或外部请求。
    // 删除 mockState 参数并刷新即可返回正常演示。
    return new Promise<Job[]>(() => {})
  }

  await new Promise<void>((resolve) => setTimeout(resolve, 320))

  if (state === 'error') {
    throw new Error('岗位暂时加载失败，请稍后重试。')
  }

  if (state === 'empty') return []

  // 每次返回独立对象，避免调用方修改内容后污染下一次读取。
  return MOCK_JOBS.filter((job) => job.status === 'open').map(copyJob)
}
