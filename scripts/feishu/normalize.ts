import type { Job } from '../../src/types/jobs.ts'

type JsonObject = Record<string, unknown>

const UNKNOWN = '待确认'
const SUMMARY_LENGTH = 120
const BLOCK_TAGS = new Set(['p', 'div', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'])
const INLINE_TAGS = new Set(['span', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'a', 'code', 'small', 'sub', 'sup'])
const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ensp: ' ', emsp: ' ', thinsp: ' ', ndash: '–', mdash: '—',
  hellip: '…', bull: '•', middot: '·', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', copy: '©', reg: '®', trade: '™',
}

function fail(path: string, reason: string): never {
  // Do not include API field values: errors can appear in public build logs.
  throw new Error(`Invalid Feishu job post at ${path}: ${reason}`)
}

function object(value: unknown, path: string): JsonObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(path, 'expected an object')
  }
  return value as JsonObject
}

function optionalText(value: unknown, path: string): string {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') fail(path, 'expected a string')
  return value.trim()
}

function requiredText(value: unknown, path: string): string {
  const text = optionalText(value, path)
  if (!text) fail(path, 'a non-empty string is required')
  return text
}

function localizedName(value: unknown, path: string): string {
  if (value === undefined || value === null) return ''
  const container = object(value, path)
  if (container.name === undefined || container.name === null) return ''
  const name = object(container.name, `${path}.name`)
  const chinese = optionalText(name.zh_cn, `${path}.name.zh_cn`)
  const english = optionalText(name.en_us, `${path}.name.en_us`)
  return chinese || english
}

function location(post: JsonObject, path: string): string {
  let addresses: unknown[] = []
  if (post.address_list !== undefined && post.address_list !== null) {
    if (!Array.isArray(post.address_list)) fail(`${path}.address_list`, 'expected an array')
    addresses = post.address_list
  }
  // The detail API marks address as deprecated; keep it only as a fallback.
  if (!addresses.length && post.address !== undefined && post.address !== null) {
    addresses = [post.address]
  }
  const labels = addresses.map((value, index) => {
    const itemPath = `${path}.addresses[${index}]`
    const address = object(value, itemPath)
    const city = localizedName(address.city, `${itemPath}.city`)
    const name = localizedName(address, itemPath)
    return city || name || UNKNOWN
  })
  return [...new Set(labels)].join(' / ') || UNKNOWN
}

function decodeEntities(value: string, path: string): string {
  return value.replace(/&(#(?:x[0-9a-f]+|[0-9]+)|[a-z][a-z0-9]+);/gi, (_match, entity: string) => {
    if (entity.startsWith('#')) {
      const hexadecimal = entity[1]?.toLowerCase() === 'x'
      const code = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10)
      if (!Number.isInteger(code) || code === 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) {
        fail(path, 'invalid numeric HTML entity')
      }
      return String.fromCodePoint(code)
    }
    if (!Object.hasOwn(ENTITIES, entity)) fail(path, 'unsupported named HTML entity; use plain text or a numeric entity')
    return ENTITIES[entity]
  })
}

/**
 * Converts plain text and a deliberately small subset of rich text into paragraphs.
 * This is not an HTML renderer. Unsupported/invalid markup stops publication so
 * complex content can be reviewed instead of silently dropping part of the JD.
 */
function paragraphs(value: unknown, path: string): string[] {
  const source = optionalText(value, path).replace(/\r\n?/g, '\n')
  if (!source) return []
  const hasMarkup = /<\/?[a-z][\s\S]*?>|<!|<\?/i.test(source)
  let plain = source
  if (hasMarkup) {
    const stack: string[] = []
    const pieces: string[] = []
    // Attribute values may contain >, so a naive /<[^>]+>/ replacement is unsafe.
    const tagPattern = /<\/?[a-z][a-z0-9]*(?:\s+[a-z_:][a-z0-9_.:-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*\/?>/gi
    let end = 0
    for (const match of source.matchAll(tagPattern)) {
      const before = source.slice(end, match.index)
      if (/[<>]/.test(before)) fail(path, 'unsupported or malformed HTML')
      pieces.push(before.replace(/\s+/g, ' '))
      const token = match[0]
      const tag = /^<\/?([a-z][a-z0-9]*)/i.exec(token)![1].toLowerCase()
      const closing = token.startsWith('</')
      const selfClosing = /\/\s*>$/.test(token)
      if (tag === 'br' || tag === 'hr') {
        if (closing) fail(path, 'invalid closing tag')
        pieces.push('\n')
      } else {
        if (!BLOCK_TAGS.has(tag) && !INLINE_TAGS.has(tag)) fail(path, 'unsupported HTML tag; review the JD as plain text')
        if (selfClosing) fail(path, 'self-closing non-void tag')
        if (closing) {
          if (!/^<\/[a-z][a-z0-9]*\s*>$/i.test(token) || stack.pop() !== tag) fail(path, 'unbalanced HTML tags')
        } else {
          stack.push(tag)
        }
        if (BLOCK_TAGS.has(tag)) pieces.push('\n')
      }
      end = match.index + token.length
    }
    const trailing = source.slice(end)
    if (/[<>]/.test(trailing) || stack.length) fail(path, 'unsupported or unbalanced HTML')
    pieces.push(trailing.replace(/\s+/g, ' '))
    plain = pieces.join('')
  }
  // Decode only after removing real tags. Encoded angle brackets remain plain text.
  return decodeEntities(plain, path).split('\n').map((line) => line.replace(/[\t \u00a0]+/g, ' ').trim()).filter(Boolean)
}

function isUnexpired(value: unknown, now: number, path: string): boolean {
  if (value === null || value === 'null') return true
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    fail(path, 'expected null, "null", or a millisecond timestamp string')
  }
  const expiresAt = Number(value)
  if (!Number.isSafeInteger(expiresAt) || expiresAt < 0) fail(path, 'invalid expiry timestamp')
  return expiresAt > now
}

function applyUrl(value: unknown, path: string): string {
  const text = requiredText(value, path)
  if (text !== value || !/^https:\/\//i.test(text) || /\s|[\u0000-\u001f\u007f\\]/u.test(text)) fail(path, 'invalid public HTTPS URL')
  let url: URL
  try {
    url = new URL(text)
  } catch {
    fail(path, 'invalid public HTTPS URL')
  }
  // Intentionally accept DNS names only. Credentials, local hosts and IP literals
  // are inappropriate in the public application link map.
  const hostname = url.hostname.toLowerCase()
  if (url.protocol !== 'https:' || url.username || url.password || !hostname.includes('.') ||
      !/^[a-z0-9.-]+$/i.test(hostname) || /^\d+(?:\.\d+){3}$/.test(hostname) ||
      /\.(?:localhost|local|internal|test)\.?$/.test(hostname) || hostname.endsWith('.')) {
    fail(path, 'expected a public HTTPS URL without credentials')
  }
  return text
}

/**
 * Normalize records from /hire/v1/websites/:website_id/job_posts (not /jobs).
 * applyUrls must be an independently verified public-link map keyed by job-post
 * ID. The API's internal job_id is never used to guess an application URL.
 */
export function normalizeJobPosts(
  posts: unknown[],
  options: { now?: number; applyUrls?: Record<string, string> } = {},
): Job[] {
  if (!Array.isArray(posts)) fail('posts', 'expected an array')
  object(options, 'options')
  const now = options.now === undefined ? Date.now() : options.now
  if (!Number.isSafeInteger(now) || now < 0) fail('options.now', 'expected a non-negative millisecond timestamp')
  const links = options.applyUrls === undefined ? {} : object(options.applyUrls, 'options.applyUrls')
  const verifiedLinks = new Map<string, string>()
  for (const [id, value] of Object.entries(links)) {
    if (!id.trim() || id !== id.trim()) fail('options.applyUrls', 'expected non-empty job-post IDs')
    verifiedLinks.set(id, applyUrl(value, 'options.applyUrls'))
  }
  const ids = new Set<string>()
  const jobs: Job[] = []
  posts.forEach((value, index) => {
    const path = `posts[${index}]`
    const post = object(value, path)
    if (post.job_active_status !== 1 && post.job_active_status !== 2) fail(`${path}.job_active_status`, 'expected 1 or 2')
    if (post.job_active_status === 2) return
    if (!isUnexpired(post.job_expire_time, now, `${path}.job_expire_time`)) return
    const id = requiredText(post.id, `${path}.id`)
    const title = requiredText(post.title, `${path}.title`)
    if (ids.has(id)) fail(`${path}.id`, 'duplicate job-post ID')
    ids.add(id)
    const responsibilities = paragraphs(post.description, `${path}.description`)
    const requirements = paragraphs(post.requirement, `${path}.requirement`)
    const firstParagraph = Array.from(responsibilities[0] || '岗位介绍待补充')
    const summary = firstParagraph.length > SUMMARY_LENGTH
      ? `${firstParagraph.slice(0, SUMMARY_LENGTH).join('')}…`
      : firstParagraph.join('')
    // Explicit allowlist: never copy raw API objects or creator/salary/headcount.
    const job: Job = {
      id,
      title,
      department: localizedName(post.job_department, `${path}.job_department`) || UNKNOWN,
      location: location(post, path),
      employmentType: localizedName(post.job_recruitment_type, `${path}.job_recruitment_type`) || UNKNOWN,
      summary,
      responsibilities,
      requirements,
      status: 'open',
    }
    const link = verifiedLinks.get(id)
    if (link) job.applyUrl = link
    jobs.push(job)
  })
  return jobs
}
