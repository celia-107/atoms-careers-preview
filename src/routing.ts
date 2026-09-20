/** Keep application routes independent of the hosting directory. */
export function siteHref(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

export function applicationPath(pathname: string): string {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  const path = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
    ? pathname.slice(basePath.length)
    : pathname
  // Static hosts resolve directory entry points with a trailing slash.
  return path.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/'
}
