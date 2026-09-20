import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { getJobs, jobsPresentation } from './services/jobs'
import type { Job } from './types/jobs'
import { RecruitHero } from './components/RecruitHero'
import { ProductSection, WorkSection } from './components/ProductAndWork'
import { ProcessSection, FaqSection } from './components/ProcessAndFaq'
import { jobMascot, mascots } from './data/mascots'
import { applicationPath, siteHref } from './routing'
import './careers.css'

type IconName = 'arrow' | 'arrow-up' | 'spark' | 'pin' | 'briefcase' | 'code' | 'layers' | 'people' | 'close' | 'menu' | 'check' | 'search' | 'refresh' | 'globe'

function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
    'arrow-up': <><path d="M6 18 18 6M6 6h12v12" /></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="3" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12c5 4 13 4 18 0M12 12v4" /></>,
    code: <><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-9 10 9 5 9-5M3 18l9 5 9-5" /></>,
    people: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 5a5 5 0 0 1 3 4v2" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    check: <path d="m5 12 4 4L19 6" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    refresh: <><path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
  }
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function AtomMark() {
  return <span className="atom-mark" aria-hidden="true"><i /><i /><i /></span>
}

function readLocation() {
  return { path: applicationPath(window.location.pathname), search: window.location.search }
}

function useLocation() {
  const [location, setLocation] = useState(readLocation)
  useEffect(() => {
    const onPop = () => setLocation(readLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return location
}

function jobsReturnHref() {
  const returnTo = window.history.state?.jobsReturnTo
  return typeof returnTo === 'string' && /^\/(?:careers)?(?:\?[^#]*)?#jobs$/.test(returnTo) ? returnTo : '/#jobs'
}

function navigate(href: string) {
  const currentPath = applicationPath(window.location.pathname)
  const fromList = currentPath === '/' || currentPath === '/careers'
  const state = href.startsWith('/jobs/')
    ? { jobsReturnTo: fromList ? `${currentPath}${window.location.search}#jobs` : jobsReturnHref() }
    : {}
  window.history.pushState(state, '', siteHref(href))
  window.dispatchEvent(new PopStateEvent('popstate'))
  if (!href.includes('#')) window.scrollTo({ top: 0, behavior: 'instant' })
  else requestAnimationFrame(() => document.getElementById(href.split('#')[1])?.scrollIntoView({ behavior: 'smooth' }))
}

function RouteLink({ href, children, className = '', onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.()
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(href)
  }
  return <a href={siteHref(href)} className={className} onClick={handleClick}>{children}</a>
}

function Header({ home }: { home: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const close = () => setMobileOpen(false)
  return <header className="site-header">
    <div className="header-inner">
      <RouteLink href="/" className="brand" onClick={close}><AtomMark /><span>Atoms</span><span className="brand-divider" /><span className="brand-sub">Careers</span></RouteLink>
      <nav className={mobileOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主导航">
        <a href={home ? '#product' : siteHref('/#product')} onClick={close}>为什么 Atoms</a>
        <a href={home ? '#work' : siteHref('/#work')} onClick={close}>工作方式</a>
        <a href={home ? '#process' : siteHref('/#process')} onClick={close}>招聘流程</a>
        <a href={home ? '#faq' : siteHref('/#faq')} onClick={close}>常见问题</a>
        <a href="https://atoms.dev/zh/dashboard" target="_blank" rel="noreferrer" onClick={close}>探索 Atoms <Icon name="arrow-up" size={14} /></a>
      </nav>
      <a className="button button-small button-dark header-cta" href={home ? '#jobs' : siteHref('/#jobs')}>查看岗位 <Icon name="arrow-up" size={16} /></a>
      <button className="icon-button mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? '关闭导航' : '打开导航'} aria-expanded={mobileOpen}><Icon name={mobileOpen ? 'close' : 'menu'} /></button>
    </div>
  </header>
}

function JobCard({ job }: { job: Job }) {
  const presentation = jobMascot(job.department)
  return <article className={`job-card mascot-job-card tint-${presentation.tint}`}>
    <div className="job-card-top"><span className="job-mascot"><img src={presentation.src} alt="" loading="lazy" /></span>{jobsPresentation.isMock && <span className="sample-tag">{jobsPresentation.itemLabel}</span>}</div>
    <span className="job-department">{job.department}</span>
    <h3><RouteLink href={`/jobs/${encodeURIComponent(job.id)}`}>{job.title}</RouteLink></h3>
    <p className="job-summary">{job.summary}</p>
    <div className="job-meta"><span><Icon name="pin" size={14} />{job.location}</span><span><Icon name="briefcase" size={14} />{job.employmentType}</span></div>
    <RouteLink href={`/jobs/${encodeURIComponent(job.id)}`} className="job-card-link"><span>查看详情</span><span className="job-arrow"><Icon name="arrow-up" size={18} /></span></RouteLink>
  </article>
}

function StatePanel({ type, onRetry }: { type: 'loading' | 'empty' | 'error'; onRetry?: () => void }) {
  if (type === 'loading') return <div className="jobs-grid" aria-label="正在加载岗位" aria-busy="true">{[1, 2, 3, 4].map((key) => <div className="job-skeleton" key={key}><span /><i /><i /><b /><b /></div>)}</div>
  return <div className="state-panel" role="status"><span className="state-icon"><Icon name={type === 'error' ? 'refresh' : 'search'} size={28} /></span><h3>{type === 'error' ? '岗位暂时没有加载出来' : '暂时没有符合条件的岗位'}</h3><p>{type === 'error' ? '请稍后重试，我们会继续为你寻找好机会。' : '试试其他分类或地点，也许你的下一站就在那里。'}</p><button className="button button-outline" onClick={onRetry}>{type === 'error' ? '重新加载' : '清空筛选'} <Icon name={type === 'error' ? 'refresh' : 'arrow'} size={16} /></button></div>
}

function JobsSection({ jobs, loading, error, reload, query }: { jobs: Job[]; loading: boolean; error: boolean; reload: () => void; query: string }) {
  const params = new URLSearchParams(query)
  const department = params.get('department') || '全部岗位'
  const location = params.get('location') || '全部地点'
  const employment = params.get('employment') || '全部类型'
  const search = params.get('q') || ''
  const departments = ['全部岗位', ...new Set(jobs.map((job) => job.department))]
  const locations = ['全部地点', ...new Set(jobs.flatMap((job) => job.location.split(' / ')))]
  const employmentTypes = ['全部类型', ...new Set(jobs.flatMap((job) => job.employmentType.split(' / ')))]
  const updateFilters = (values: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search)
    Object.entries(values).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key))
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${next.size ? `?${next}` : ''}${window.location.hash}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  const filtered = jobs.filter((job) =>
    (department === '全部岗位' || job.department === department) &&
    (location === '全部地点' || job.location.split(' / ').includes(location)) &&
    (employment === '全部类型' || job.employmentType.split(' / ').includes(employment)) &&
    `${job.title} ${job.summary} ${job.department}`.toLowerCase().includes(search.toLowerCase().trim()))
  const hasFilters = department !== '全部岗位' || location !== '全部地点' || employment !== '全部类型' || Boolean(search)
  const reset = () => updateFilters({ department: null, location: null, employment: null, q: null })
  return <section className="jobs-section" id="jobs"><div className="section-shell">
    <div className="section-heading"><div><p className="eyebrow">04 / FIND YOUR NEXT</p><h2>找到你的位置，<br />一起把事情做成。</h2></div><p>找到适合你的方向。<br />带着好奇心，也带着你的作品。</p></div>
    <div className="jobs-toolbar">
      <div className="filter-tabs" role="group" aria-label="按岗位分类筛选">{departments.map(name => <button className={department === name ? 'active' : ''} key={name} onClick={() => updateFilters({department: name === '全部岗位' ? null : name})} aria-pressed={department === name}>{name}</button>)}</div>
      <div className="filter-fields">
        <label className="search-field"><Icon name="search" size={16} /><input value={search} onChange={event => updateFilters({q:event.target.value})} placeholder="搜索岗位" aria-label="搜索岗位" /></label>
        <label className="location-field"><Icon name="pin" size={16} /><select aria-label="工作地点" value={location} onChange={event => updateFilters({location:event.target.value === '全部地点' ? null : event.target.value})}>{locations.map(name => <option key={name}>{name}</option>)}</select></label>
        <label className="location-field employment-field"><Icon name="briefcase" size={16} /><select aria-label="岗位类型" value={employment} onChange={event => updateFilters({employment:event.target.value === '全部类型' ? null : event.target.value})}>{employmentTypes.map(name => <option key={name}>{name}</option>)}</select></label>
      </div>
    </div>
    <div className="jobs-summary"><span aria-live="polite">{loading ? '正在加载岗位…' : error ? '加载遇到问题' : `${filtered.length} 个${jobsPresentation.isMock ? '示例' : '招聘中'}岗位`}</span>{jobsPresentation.listNote && <span>{jobsPresentation.listNote}</span>}{hasFilters && <button className="clear-filters" onClick={reset}>清空筛选 ×</button>}</div>
    {loading ? <StatePanel type="loading" /> : error ? <StatePanel type="error" onRetry={reload} /> : filtered.length ? <div className="jobs-grid">{filtered.map(job => <JobCard job={job} key={job.id} />)}</div> : !hasFilters ? <div className="state-panel" role="status"><img className="empty-mascot" src={mascots.snow} alt="" /><h3>新机会，正在路上。</h3><p>目前暂无可展示的开放岗位，可以稍后再来看看。</p><button className="button button-outline" onClick={reload}>刷新岗位 <Icon name="refresh" size={16} /></button></div> : <StatePanel type="empty" onRetry={reset} />}
    <div className="jobs-footnote"><Icon name="spark" size={17} /><p>你的价值，不只在简历里。<span> 一个有判断、有完成度的作品，同样能让我们认识你。</span></p></div>
  </div></section>
}

function Footer() {
  return <footer className="site-footer section-shell"><div><RouteLink href="/" className="brand"><AtomMark /><span>Atoms</span></RouteLink><p>Make something that matters.</p></div><div className="footer-right"><a href="https://atoms.dev/zh/dashboard" target="_blank" rel="noreferrer">访问 Atoms <Icon name="arrow-up" size={15} /></a><span>{jobsPresentation.isMock ? '招聘页面前端预览 · 示例内容' : '岗位来源：飞书招聘；其他内容仍在完善'}</span></div></footer>
}

function ApplicationModal({ job, onClose, jobs, loading, error, onRetry }: { job: Job | null; onClose: () => void; jobs: Job[]; loading: boolean; error: boolean; onRetry: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selectedId, setSelectedId] = useState(job?.id || '')
  const selectedJob = jobs.find((item) => item.id === selectedId)
  useEffect(() => {
    const dialog = dialogRef.current
    const activeElement = document.activeElement as HTMLElement
    dialog?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { if (dialog?.open) dialog.close(); document.body.style.overflow = previousOverflow; activeElement?.focus() }
  }, [])
  const realApplyUrl = selectedJob?.applyUrl && /^https:\/\//.test(selectedJob.applyUrl) ? selectedJob.applyUrl : undefined
  return <dialog className="application-dialog" ref={dialogRef} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose() } }} aria-labelledby="apply-title">
    <button className="icon-button modal-close" onClick={onClose} aria-label="关闭投递入口"><Icon name="close" /></button>
    <img className="dialog-mascot" src={mascots.explorer} alt="" /><p className="eyebrow">LET’S BUILD SOMETHING.</p><h2 id="apply-title">从一个作品，认识你。</h2><p className="dialog-description">选择你感兴趣的岗位，查看对应的投递信息。</p>
    <label className="dialog-label">感兴趣的岗位<select value={selectedId} disabled={loading || error || !jobs.length} onChange={(event) => setSelectedId(event.target.value)}><option value="">{loading ? '正在加载岗位…' : error ? '岗位暂时无法加载' : jobs.length ? '请选择一个岗位' : '暂无开放岗位'}</option>{jobs.map((item) => <option key={item.id} value={item.id}>{item.title}{jobsPresentation.isMock ? '（示例）' : ''}</option>)}</select></label>
    <div className="application-checklist"><h3>你可以提前准备</h3><p><Icon name="check" size={17} /> 一份简历，或关于你的简短介绍</p><p><Icon name="check" size={17} /> 一个可体验的作品 / Demo / GitHub 链接</p><p><Icon name="check" size={17} /> 你的判断、AI 的参与，以及如何验证结果</p></div>
    {loading ? <div className="demo-application" role="status"><p>正在加载岗位，请稍候…</p></div> : error ? <div className="demo-application" role="alert"><p>岗位暂时无法加载，请重试。</p><button type="button" className="text-link dialog-back" onClick={onRetry}>重新加载岗位</button></div> : !jobs.length ? <div className="demo-application" role="status"><p>暂无开放岗位，欢迎稍后再来看看。</p></div> : realApplyUrl ? <a className="button button-dark dialog-action" href={realApplyUrl} target="_blank" rel="noreferrer">{jobsPresentation.isMock ? '前往正式投递' : '前往飞书投递'} <Icon name="arrow-up" size={18} /></a> : <div className="demo-application" role="status"><span className="sample-tag">{jobsPresentation.isMock ? '演示入口' : selectedJob ? '投递链接待补充' : '选择岗位'}</span><p>{selectedJob ? `已选择「${selectedJob.title}」${jobsPresentation.isMock ? '示例' : ''}岗位。` : jobsPresentation.isMock ? '正式投递通道尚未开放。' : '请选择岗位，查看对应的投递信息。'}<br />{jobsPresentation.isMock || selectedJob ? `${jobsPresentation.defaultApplyNote}；` : ''}此处不会收集或发送个人信息。</p></div>}
    <button className="text-link dialog-back" onClick={onClose}>返回继续了解 <Icon name="arrow" size={16} /></button>
  </dialog>
}

function DetailSection({ title, label, items }: { title: string; label: string; items: string[] }) {
  return <section className="detail-section"><p className="eyebrow">{label}</p><h2>{title}</h2>{items.length ? <ul>{items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul> : <p className="detail-note">待补充，请以正式岗位说明或招聘团队确认为准。</p>}</section>
}

function JobDetail({ job, onApply }: { job: Job; onApply: () => void }) {
  const returnHref = jobsReturnHref()
  return <main className="detail-page section-shell"><RouteLink href={returnHref} className="back-link"><span>←</span> 返回岗位列表</RouteLink>
    <div className="detail-hero"><div><div className="detail-tags"><span>{job.department}</span>{jobsPresentation.isMock && <span className="sample-tag">{jobsPresentation.itemLabel} · 待确认</span>}</div><h1>{job.title}</h1><p>{job.summary}</p><div className="job-meta"><span><Icon name="pin" size={17} />{job.location}</span><span><Icon name="briefcase" size={17} />{job.employmentType}</span></div></div><button className="button button-dark detail-mobile-apply" onClick={onApply}>立即投递 <Icon name="arrow-up" size={17} /></button><div className="detail-character"><span>LET’S BUILD TOGETHER</span><img src={jobMascot(job.department).src} alt="" /></div></div>
    <div className="detail-layout"><div className="detail-content"><div className="detail-mission"><p className="eyebrow">YOUR MISSION</p><h2>这个岗位，为怎样的改变而存在？</h2><p>{job.summary}</p>{jobsPresentation.isMock && <span className="sample-tag">岗位使命示例</span>}</div><DetailSection title="你会参与的工作" label="WHAT YOU’LL DO" items={job.responsibilities} /><DetailSection title="我们期待你带来的能力" label="WHAT YOU’LL BRING" items={job.requirements} />{job.preferredQualifications?.length ? <DetailSection title="如果你还有这些，会很棒" label="NICE TO HAVE" items={job.preferredQualifications} /> : null}{job.interviewProcess?.length ? <section className="detail-section"><p className="eyebrow">HOW WE MEET</p><h2>让我们这样认识彼此</h2><ol className="interview-list">{job.interviewProcess.map((step, index) => <li key={step}><span>0{index + 1}</span><p>{step}</p></li>)}</ol>{jobsPresentation.detailNote && <p className="detail-note">{jobsPresentation.detailNote}</p>}</section> : null}</div><aside className="apply-sidebar"><img className="sidebar-mascot" src={mascots.explorer} alt="" /><h2>让你的下一个作品，<br />从这里开始。</h2><p>我们期待看见你的思考，<br />以及你把想法做成的过程。</p><button className="button button-dark" onClick={onApply}>立即投递 <Icon name="arrow-up" size={18} /></button><span className="sidebar-note">{job.applyUrl ? '前往岗位的公开投递入口' : jobsPresentation.isMock ? '当前为演示投递入口' : '该岗位的投递链接待补充'}</span><div className="sidebar-rule" /><h3>带上作品，一起聊聊</h3><p className="sidebar-small">可体验的 Demo、GitHub，或一次真实的问题解决经历，都可以成为对话的开始。</p></aside></div><div className="detail-bottom"><RouteLink href={returnHref} className="back-link">← 返回所有岗位</RouteLink><span>Make something that matters.</span></div>
  </main>
}

export default function App() {
  const { path, search } = useLocation()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [application, setApplication] = useState<{ job: Job | null } | null>(null)
  const home = path === '/' || path === '/careers'
  let jobId: string | null = null
  try { jobId = /^\/jobs\/[^/]+\/?$/.test(path) ? decodeURIComponent(path.split('/')[2]) : null } catch { /* Invalid encoded paths render the unavailable state. */ }
  const job = jobs.find((item) => item.id === jobId)
  useEffect(() => {
    let active = true
    setLoading(true); setError(false)
    getJobs().then((data) => { if (active) setJobs(data) }).catch(() => { if (active) setError(true) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [attempt])
  useEffect(() => {
    document.title = job ? `${job.title} · Atoms Careers` : '加入 Atoms · 把想法变成可用产品'
    if (window.location.hash && !loading) requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView())
  }, [job, path, loading])
  return <div className="careers-site"><a className="skip-link" href="#main-content">跳到主要内容</a><Header home={home} />
    {home ? <main id="main-content"><RecruitHero onApply={() => setApplication({ job: null })} /><ProductSection jobs={jobs} /><WorkSection /><JobsSection query={search} jobs={jobs} loading={loading} error={error} reload={() => setAttempt(attempt + 1)} /><ProcessSection onApply={() => setApplication({ job: null })} /><FaqSection onApply={() => setApplication({ job: null })} /></main> : jobId && loading ? <main id="main-content" className="route-state section-shell"><StatePanel type="loading" /></main> : jobId && error ? <main id="main-content" className="route-state section-shell"><StatePanel type="error" onRetry={() => setAttempt(attempt + 1)} /></main> : job ? <div id="main-content"><JobDetail job={job} onApply={() => setApplication({ job })} /></div> : <main id="main-content" className="not-found section-shell"><p className="eyebrow">LOOKING FOR SOMETHING?</p><h1>这个岗位暂时不在这里。</h1><p>岗位可能已关闭，或链接有误。去看看其他方向吧。</p><RouteLink className="button button-dark" href="/#jobs">返回岗位列表 <Icon name="arrow" size={18} /></RouteLink></main>}
    <Footer />{application && <ApplicationModal jobs={jobs} job={application.job} loading={loading} error={error} onRetry={() => setAttempt(attempt + 1)} onClose={() => setApplication(null)} />}
  </div>
}
