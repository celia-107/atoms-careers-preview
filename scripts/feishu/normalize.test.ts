import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeJobPosts } from './normalize.ts'

const NOW = 1_800_000_000_000
const active = (overrides: Record<string, unknown> = {}) => ({
  id: 'public-post-1',
  job_id: 'internal-job-1',
  title: '产品工程师',
  job_active_status: 1,
  job_expire_time: 'null',
  description: '理解用户的问题。\n借助 AI 完成交付。',
  requirement: '能够验证和迭代。',
  job_department: { name: { zh_cn: '产品研发', en_us: 'Product' } },
  job_recruitment_type: { name: { zh_cn: '全职' } },
  address_list: [{ city: { name: { zh_cn: '深圳' } }, name: { zh_cn: '深圳办公室' } }],
  ...overrides,
})
const normalize = (posts: unknown[]) => normalizeJobPosts(posts, { now: NOW })

test('uses the public job-post ID and returns only the allowed public fields', () => {
  const [job] = normalize([active({
    creator: { id: 'private-user-id', name: { zh_cn: '个人姓名' } },
    min_salary: '999', max_salary: '1000', headcount: 200,
    customized_data_list: [{ value: { content: 'private-note' } }],
    applyUrl: 'https://unverified.example.com/apply',
  })])
  assert.deepEqual(job, {
    id: 'public-post-1', title: '产品工程师', department: '产品研发',
    location: '深圳', employmentType: '全职', summary: '理解用户的问题。',
    responsibilities: ['理解用户的问题。', '借助 AI 完成交付。'],
    requirements: ['能够验证和迭代。'], status: 'open',
  })
  assert.doesNotMatch(JSON.stringify(job), /private|个人姓名|salary|headcount|internal-job|unverified/)
})

test('excludes disabled, expired and exactly-expiring records', () => {
  assert.deepEqual(normalize([
    { job_active_status: 2 },
    active({ id: 'expired', job_expire_time: String(NOW - 1) }),
    active({ id: 'boundary', job_expire_time: String(NOW) }),
  ]), [])
  assert.equal(normalize([active({ job_expire_time: String(NOW + 1) })]).length, 1)
  assert.equal(normalize([active({ job_expire_time: null })]).length, 1)
})

test('rejects unknown status and missing or malformed expiry instead of assuming open', () => {
  for (const job_active_status of [undefined, null, 0, 3, '1', true]) {
    assert.throws(() => normalize([active({ job_active_status })]), /job_active_status/)
  }
  for (const job_expire_time of [undefined, '', 'undefined', 'NULL', ' null ', '1e12', '-1', '1.5', 1800000000001, '9007199254740992', {}]) {
    assert.throws(() => normalize([active({ job_expire_time })]), /job_expire_time/)
  }
})

test('requires a title and public ID for every open job; rejects duplicate IDs', () => {
  for (const missing of [undefined, null, '', '  ', 123]) {
    assert.throws(() => normalize([active({ id: missing })]), /\.id/)
    assert.throws(() => normalize([active({ title: missing })]), /\.title/)
  }
  assert.throws(() => normalize([active(), active()]), /duplicate/)
})

test('marks unknown metadata without inventing JD content or interview steps', () => {
  const [job] = normalize([active({
    job_department: undefined, job_recruitment_type: null,
    address_list: [], description: null, requirement: undefined,
  })])
  assert.equal(job.department, '待确认')
  assert.equal(job.employmentType, '待确认')
  assert.equal(job.location, '待确认')
  assert.equal(job.summary, '岗位介绍待补充')
  assert.deepEqual(job.responsibilities, [])
  assert.deepEqual(job.requirements, [])
  assert.equal(Object.hasOwn(job, 'interviewProcess'), false)
  assert.equal(Object.hasOwn(job, 'preferredQualifications'), false)
})

test('prefers Chinese, falls back to English and preserves unique locations', () => {
  const [job] = normalize([active({
    job_department: { name: { zh_cn: '', en_us: 'Engineering' } },
    address_list: [
      { city: { name: { zh_cn: '深圳' } } },
      { city: { name: { en_us: 'Singapore' } } },
      { city: { name: { zh_cn: '深圳' } } },
    ],
    address: { name: { zh_cn: '旧地址' } },
  })])
  assert.equal(job.department, 'Engineering')
  assert.equal(job.location, '深圳 / Singapore')
  assert.equal(normalize([active({ address_list: [], address: { name: { zh_cn: '已确认地址' } } })])[0].location, '已确认地址')
})

test('rejects malformed consumed fields instead of coercing them', () => {
  for (const overrides of [
    { job_department: '研发' }, { job_department: { name: '研发' } },
    { job_department: { name: { zh_cn: 123 } } },
    { job_recruitment_type: [] }, { address_list: {} }, { address_list: [null] },
    { address_list: [{ city: '深圳' }] }, { description: [] }, { requirement: {} },
  ]) assert.throws(() => normalize([active(overrides)]), /Invalid Feishu job post/)
  for (const value of [null, [], 'post', 2]) assert.throws(() => normalize([value]), /expected an object/)
})

test('converts ordinary rich text and entities to complete plain paragraphs', () => {
  const [job] = normalize([active({
    description: '<p>理解&nbsp;<strong>真实问题</strong> &amp; 验证结果。</p><ul><li>设计&#32;产品</li><li>交付 &#x1F680;</li></ul>',
    requirement: '<div>掌握 &lt;工具&gt;<br/>能阅读 <a href="https://example.com/?a=1&amp;b=2" title="a > b">文档</a></div>',
  })])
  assert.deepEqual(job.responsibilities, ['理解 真实问题 & 验证结果。', '设计 产品', '交付 🚀'])
  assert.deepEqual(job.requirements, ['掌握 <工具>', '能阅读 文档'])
  assert.doesNotMatch(JSON.stringify(job), /href=|https:\/\/example|<p>|<strong>/)
})

test('preserves full JD content while shortening only the summary by Unicode code points', () => {
  const description = `${'🚀'.repeat(130)}\n第二段完整保留。`
  const [job] = normalize([active({ description })])
  assert.deepEqual(job.responsibilities, ['🚀'.repeat(130), '第二段完整保留。'])
  assert.equal(job.summary, `${'🚀'.repeat(120)}…`)
})

test('rejects unsupported or malformed HTML rather than publishing partial content', () => {
  for (const description of [
    '<script>alert(1)</script><p>正文</p>', '<style>p { color: red }</style>',
    '<img alt="职责图" src="x">', '<table><tr><td>职责</td></tr></table>',
    '<p><strong>未闭合</p>', '<p>未结束', '<p />', '<!-- hidden -->正文',
    '<p>未知实体 &unknown;</p>', '<p>坏字符 &#0;</p>', '<p>坏字符 &#xD800;</p>',
  ]) assert.throws(() => normalize([active({ description })]), /Invalid Feishu job post/)
  assert.deepEqual(normalize([active({ description: '性能 < 100 ms\n精度 > 90%' })])[0].responsibilities, ['性能 < 100 ms', '精度 > 90%'])
})

test('uses only explicitly mapped HTTPS application URLs keyed by public ID', () => {
  const [job] = normalizeJobPosts([active()], {
    now: NOW,
    applyUrls: {
      'public-post-1': 'https://careers.example.com/confirmed-application',
      'internal-job-1': 'https://careers.example.com/wrong-internal-id',
    },
  })
  assert.equal(job.applyUrl, 'https://careers.example.com/confirmed-application')
  assert.equal(Object.hasOwn(normalize([active()])[0], 'applyUrl'), false)
  const map = Object.create({ 'public-post-1': 'https://careers.example.com/inherited' })
  assert.equal(Object.hasOwn(normalizeJobPosts([active()], { now: NOW, applyUrls: map })[0], 'applyUrl'), false)
})

test('rejects unsafe or local application URLs, including unused map entries', () => {
  for (const url of [
    'javascript:alert(1)', 'data:text/html,test', 'http://careers.example.com',
    'https://user:secret@careers.example.com', '//careers.example.com', 'https:careers.example.com',
    'https://localhost/apply', 'https://127.0.0.1', 'https://10.0.0.1',
    'https://[::1]', 'https://company.internal', 'https://host.local',
    'https://careers.example.com\n', ' https://careers.example.com',
    'https://careers.example.com\\@elsewhere.example.com', '',
  ]) assert.throws(() => normalizeJobPosts([active()], { now: NOW, applyUrls: { unused: url } }), /HTTPS URL|string is required/)
})

test('validates normalization time and never leaks bad API values in errors', () => {
  for (const now of [NaN, Infinity, -1, 1.2]) {
    assert.throws(() => normalizeJobPosts([], { now }), /options.now/)
  }
  assert.throws(() => normalize([active({ description: { secret: 'private-value' } })]), (error: Error) => {
    assert.doesNotMatch(error.message, /private-value/)
    return true
  })
})
