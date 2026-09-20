import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeActiveJobs } from './normalizeActiveJobs.ts'

const active = (overrides: Record<string, unknown> = {}) => ({
  id: 'stable-job-1', title: '产品工程师', active_status: 1,
  department: { zh_name: '产品研发', en_name: 'Product Engineering' },
  city: { zh_name: '深圳', en_name: 'Shenzhen' },
  recruitment_type: { zh_name: '正式', en_name: 'Full time' },
  description: '理解真实问题。\n用 AI 完成交付。',
  requirement: '主动验证结果。\n能持续迭代。',
  ...overrides,
})

test('publishes every active job regardless of website publication or expiry', () => {
  const jobs = normalizeActiveJobs([
    active({ website_status: 'offline', job_expire_time: '1' }),
    { active_status: 2 }, { active_status: 0 }, { active_status: '1' }, {},
  ])
  assert.equal(jobs.length, 1)
  assert.equal(jobs[0].id, 'stable-job-1')
  assert.equal(jobs[0].status, 'open')
})

test('maps only public JD fields and never infers an application URL', () => {
  const [job] = normalizeActiveJobs([active({
    creator: { id: 'private-user', name: 'private-name' },
    min_salary: 'private-salary', headcount: 200,
    customized_data_list: [{ value: 'private-note' }],
    applyUrl: 'https://unverified.example.com/apply',
    department: { zh_name: '产品研发', en_name: 'Engineering', private_note: 'private-department' },
  })])
  assert.deepEqual(job, {
    id: 'stable-job-1', title: '产品工程师', department: '产品研发',
    location: '深圳', employmentType: '正式', summary: '理解真实问题。',
    responsibilities: ['理解真实问题。', '用 AI 完成交付。'],
    requirements: ['主动验证结果。', '能持续迭代。'], status: 'open',
  })
  assert.doesNotMatch(JSON.stringify(job), /private|salary|headcount|unverified/)
})

test('preserves complete rich-text JD while shortening only the summary', () => {
  const first = '🚀'.repeat(130)
  const [job] = normalizeActiveJobs([active({
    description: `<p>${first}</p><ul><li>设计 &amp; 交付</li><li>验证结果</li></ul>`,
    requirement: '<p>产品意识</p><p>工程判断<br>持续迭代</p>',
  })])
  assert.deepEqual(job.responsibilities, [first, '设计 & 交付', '验证结果'])
  assert.deepEqual(job.requirements, ['产品意识', '工程判断', '持续迭代'])
  assert.equal(job.summary, `${'🚀'.repeat(120)}…`)
})

test('keeps unique city-list locations, localized names and formal/internship labels', () => {
  const jobs = normalizeActiveJobs([
    active({ city_list: [
      { name: { zh_cn: '北京', en_us: 'Beijing' } },
      { name: { en_us: 'Singapore' } },
      { name: { zh_cn: '北京' } },
    ] }),
    active({ id: 'internship', city_list: [], recruitment_type: { zh_name: '实习', en_name: 'Intern' } }),
    active({ id: 'english', department: { en_name: 'Engineering' },
      city: { en_name: 'London' }, recruitment_type: { en_name: 'Full time' } }),
  ])
  assert.equal(jobs[0].location, '北京 / Singapore')
  assert.equal(jobs[0].employmentType, '正式')
  assert.equal(jobs[1].location, '深圳')
  assert.equal(jobs[1].employmentType, '实习')
  assert.equal(jobs[2].location, 'London')
  assert.equal(jobs[2].department, 'Engineering')
  assert.equal(jobs[2].employmentType, 'Full time')
})

test('marks missing metadata and content without inventing requirements or process', () => {
  const [job] = normalizeActiveJobs([active({
    department: undefined, city: null, recruitment_type: undefined,
    description: null, requirement: undefined,
  })])
  assert.equal(job.location, '待确认')
  assert.equal(job.department, '待确认')
  assert.equal(job.employmentType, '待确认')
  assert.deepEqual(job.responsibilities, [])
  assert.deepEqual(job.requirements, [])
  assert.equal(Object.hasOwn(job, 'interviewProcess'), false)
})

test('accepts only separately verified application links keyed by stable job ID', () => {
  const [job] = normalizeActiveJobs([active()], {
    applyUrls: { 'stable-job-1': 'https://careers.example.com/verified' },
  })
  assert.equal(job.applyUrl, 'https://careers.example.com/verified')
  assert.throws(() => normalizeActiveJobs([active()], {
    applyUrls: { 'stable-job-1': 'javascript:alert(1)' },
  }), /HTTPS URL/)
})

test('rejects malformed consumed fields and duplicate IDs without exposing raw values', () => {
  for (const overrides of [
    { department: 'private-value' }, { city: [] }, { recruitment_type: 1 },
    { city_list: {} }, { city_list: [null] }, { city_list: [{ name: 'private-value' }] },
    { city_list: [{ name: { zh_cn: 123 } }] }, { title: '' }, { id: '' },
    { description: '<script>private-value</script>' },
  ]) {
    assert.throws(() => normalizeActiveJobs([active(overrides)]), (error: Error) => {
      assert.doesNotMatch(error.message, /private-value/)
      return true
    })
  }
  assert.throws(() => normalizeActiveJobs([active(), active()]), /duplicate/)
  assert.throws(() => normalizeActiveJobs([null]), /expected an object/)
})
