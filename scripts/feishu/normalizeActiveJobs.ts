import type { Job } from '../../src/types/jobs.ts'
import { normalizeJobPosts } from './normalize.ts'

type JsonObject = Record<string, unknown>

function object(value: unknown, path: string): JsonObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    // Values from the API must never appear in public build logs.
    throw new Error(`Invalid Feishu active job at ${path}: expected an object`)
  }
  return value as JsonObject
}

function named(value: unknown, path: string) {
  if (value === undefined || value === null) return undefined
  const item = object(value, path)
  return { name: { zh_cn: item.zh_name, en_us: item.en_name } }
}

function addresses(job: JsonObject, path: string) {
  if (job.city_list !== undefined && job.city_list !== null) {
    if (!Array.isArray(job.city_list)) {
      throw new Error(`Invalid Feishu active job at ${path}.city_list: expected an array`)
    }
    if (job.city_list.length) {
      return job.city_list.map((value, index) => {
        const itemPath = `${path}.city_list[${index}]`
        const city = object(value, itemPath)
        const name = city.name == null ? {} : object(city.name, `${itemPath}.name`)
        return { city: { name: { zh_cn: name.zh_cn, en_us: name.en_us } } }
      })
    }
  }
  const city = named(job.city, `${path}.city`)
  return city ? [{ city }] : []
}

/**
 * The company has confirmed that every actively recruiting job is public.
 * Therefore active_status === 1 is the publication rule; website/channel
 * publication state is deliberately not consulted. IDs remain stable job IDs.
 *
 * Only the specified JD fields are mapped. Raw internal records, salary,
 * headcount, contacts, custom fields and inferred application links are never
 * returned. Verified application URLs can be supplied separately by job ID.
 */
export function normalizeActiveJobs(
  records: unknown[],
  options: { now?: number; applyUrls?: Record<string, string> } = {},
): Job[] {
  if (!Array.isArray(records)) {
    throw new Error('Invalid Feishu active jobs: expected an array')
  }
  const posts = records.flatMap((value, index) => {
    const path = `jobs[${index}]`
    const job = object(value, path)
    if (job.active_status !== 1) return []
    return [{
      id: job.id,
      title: job.title,
      job_active_status: 1,
      // The internal jobs endpoint has no channel publication expiry rule.
      job_expire_time: null,
      job_department: named(job.department, `${path}.department`),
      job_recruitment_type: named(job.recruitment_type, `${path}.recruitment_type`),
      address_list: addresses(job, path),
      description: job.description,
      requirement: job.requirement,
    }]
  })
  // Reuse the shared rich-text conversion, full-JD preservation, allowlist and
  // verified-URL validation instead of maintaining a second output contract.
  return normalizeJobPosts(posts, options)
}
