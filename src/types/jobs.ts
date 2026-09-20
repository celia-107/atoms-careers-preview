export type JobStatus = 'open' | 'closed'

/**
 * 页面唯一依赖的岗位模型，不直接暴露飞书招聘字段或响应结构。
 * 未来由数据适配层完成映射；这不是飞书 API 的原始数据类型。
 */
export type Job = {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  preferredQualifications?: string[]
  interviewProcess?: string[]
  /** 仅填写已核验的公开投递链接；未配置时由页面显示投递尚未开放。 */
  applyUrl?: string
  status: JobStatus
}
