import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { MOCK_JOBS } from './src/data/mockJobs.ts'
import { parseJobsDocument } from './src/services/jobsContract.ts'

function staticRouteEntries(source: 'mock' | 'feishu'): Plugin {
  let outputDirectory: string
  let publicDirectory: string
  let jobIds: string[] | undefined
  return {
    name: 'static-route-entries',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
      publicDirectory = config.publicDir
    },
    async buildStart() {
      const jobs = source === 'feishu'
        ? parseJobsDocument(JSON.parse(await readFile(resolve(publicDirectory, 'data/jobs.json'), 'utf8'))).jobs
        : MOCK_JOBS
      jobIds = jobs.filter(job => job.status === 'open').map(job => job.id)
    },
    async closeBundle() {
      if (!jobIds) return
      const shell = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')
      // GitHub Pages serves these actual directories on direct visits and refresh.
      const routes = ['careers', ...jobIds.map(id => `jobs/${encodeURIComponent(id)}`)]
      await Promise.all(routes.map(async route => {
        const directory = resolve(outputDirectory, route)
        await mkdir(directory, { recursive: true })
        await writeFile(resolve(directory, 'index.html'), shell)
      }))
      await writeFile(resolve(outputDirectory, '404.html'), shell)
      await writeFile(resolve(outputDirectory, '.nojekyll'), '')
    },
  }
}

export default defineConfig(({ command, isPreview }) => {
  const source = process.env.VITE_JOBS_SOURCE || 'feishu'
  if (source !== 'mock' && source !== 'feishu') throw new Error('VITE_JOBS_SOURCE must be mock or feishu')
  return {
    base: command === 'build' || isPreview ? '/atoms-careers-preview/' : '/',
    // The browser and static route generator must use the exact same source.
    define: { 'import.meta.env.VITE_JOBS_SOURCE': JSON.stringify(source) },
    plugins: [react(), staticRouteEntries(source)],
    server: { port: 4173 },
  }
})
