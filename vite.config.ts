import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { MOCK_JOBS } from './src/data/mockJobs.ts'

function staticRouteEntries(): Plugin {
  let outputDirectory: string
  return {
    name: 'static-route-entries',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const shell = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')
      // GitHub Pages serves these actual directories on direct visits and refresh.
      const routes = ['careers', ...MOCK_JOBS.filter(job => job.status === 'open').map(job => `jobs/${encodeURIComponent(job.id)}`)]
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

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/atoms-careers-preview/' : '/',
  plugins: [react(), staticRouteEntries()],
  server: { port: 4173 },
}))
