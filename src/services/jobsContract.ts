import type { Job } from '../types/jobs.ts'

/** Public, normalized data only. Never put authentication or internal fields here. */
export type JobsDocument = {
  schemaVersion: 1
  source: 'feishu'
  syncedAt: string
  jobs: Job[]
}

const JOB_FIELDS = new Set([
  'id', 'title', 'department', 'location', 'employmentType', 'summary',
  'responsibilities', 'requirements', 'preferredQualifications',
  'interviewProcess', 'applyUrl', 'status',
])

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`)
  }
  return value as Record<string, unknown>
}

function onlyFields(value: Record<string, unknown>, allowed: Set<string>, label: string): void {
  if (Object.keys(value).some(key => !allowed.has(key))) {
    throw new Error(`${label} contains unsupported fields`)
  }
}

function text(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be non-empty text`)
  return value.trim()
}

function textList(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`)
  return value.map(item => text(item, label))
}

function parseJob(input: unknown): Job {
  const value = record(input, 'Job')
  onlyFields(value, JOB_FIELDS, 'Job')
  const id = text(value.id, 'Job.id')
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(id)) throw new Error('Job.id is not a safe route identifier')
  if (value.status !== 'open' && value.status !== 'closed') throw new Error('Job.status is invalid')

  const job: Job = {
    id,
    title: text(value.title, 'Job.title'),
    department: text(value.department, 'Job.department'),
    location: text(value.location, 'Job.location'),
    employmentType: text(value.employmentType, 'Job.employmentType'),
    summary: text(value.summary, 'Job.summary'),
    responsibilities: textList(value.responsibilities, 'Job.responsibilities'),
    requirements: textList(value.requirements, 'Job.requirements'),
    status: value.status,
  }
  if (value.preferredQualifications !== undefined) {
    job.preferredQualifications = textList(value.preferredQualifications, 'Job.preferredQualifications')
  }
  if (value.interviewProcess !== undefined) {
    job.interviewProcess = textList(value.interviewProcess, 'Job.interviewProcess')
  }
  if (value.applyUrl !== undefined) {
    const applyUrl = text(value.applyUrl, 'Job.applyUrl')
    const parsed = new URL(applyUrl)
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
      throw new Error('Job.applyUrl must be a public HTTPS URL without credentials')
    }
    job.applyUrl = parsed.href
  }
  return job
}

/** Shared by the browser and the static route build, so they accept the same data. */
export function parseJobsDocument(input: unknown): JobsDocument {
  const value = record(input, 'Jobs document')
  onlyFields(value, new Set(['schemaVersion', 'source', 'syncedAt', 'jobs']), 'Jobs document')
  if (value.schemaVersion !== 1 || value.source !== 'feishu') throw new Error('Unsupported jobs document')
  const syncedAt = text(value.syncedAt, 'Jobs document.syncedAt')
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(syncedAt) || !Number.isFinite(Date.parse(syncedAt))) {
    throw new Error('Jobs document.syncedAt must be an ISO timestamp')
  }
  if (!Array.isArray(value.jobs)) throw new Error('Jobs document.jobs must be an array')
  const jobs = value.jobs.map(parseJob)
  if (new Set(jobs.map(job => job.id)).size !== jobs.length) throw new Error('Duplicate job identifiers')
  return { schemaVersion: 1, source: 'feishu', syncedAt, jobs }
}
