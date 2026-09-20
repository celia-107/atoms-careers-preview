import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { normalizeActiveJobs } from './normalizeActiveJobs.ts'
import { parseJobsDocument } from '../../src/services/jobsContract.ts'

/** Import an authorized, complete job list export without storing raw API responses. */
async function main() {
  const inputPath = process.argv[2]
  if (!inputPath || process.argv.length !== 3) throw new Error('Pass one complete, approved job-list JSON file.')
  const input = JSON.parse(await readFile(resolve(inputPath), 'utf8'))
  const applyUrls = JSON.parse(await readFile(resolve('config/feishu-apply-urls.json'), 'utf8'))
  const jobs = normalizeActiveJobs(input, { applyUrls })
  if (jobs.some(job => job.location.split(' / ').some(city => city !== '深圳' && city !== '厦门'))) {
    throw new Error('Job locations must match the confirmed Shenzhen/Xiamen scope.')
  }
  const document = parseJobsDocument({ schemaVersion: 1, source: 'feishu', syncedAt: new Date().toISOString(), jobs })
  const destination = resolve('public/data/jobs.json')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(`${destination}.tmp`, `${JSON.stringify(document, null, 2)}\n`)
  await rename(`${destination}.tmp`, destination)
  console.log(`Imported ${jobs.length} active Feishu jobs with approved public fields.`)
}

main().catch(() => {
  console.error('Import failed: check the complete approved export, locations and application URL configuration. No partial data was published.')
  process.exitCode = 1
})
