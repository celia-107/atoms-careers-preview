import { useRef, useState, type KeyboardEvent } from 'react'
import { careerStory } from '../data/careerStory'
import type { Job } from '../types/jobs'
import { siteHref } from '../routing'
import './ProductAndWork.css'

function Arrow({ direction = 'right' }: { direction?: 'right' | 'up' }) {
  return (
    <svg className="pw-arrow" viewBox="0 0 24 24" aria-hidden="true">
      {direction === 'up' ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h16M14 6l6 6-6 6" />}
    </svg>
  )
}

function Spark() {
  return <span className="pw-spark" aria-hidden="true">✦</span>
}

function moveTab(event: KeyboardEvent<HTMLButtonElement>, current: number, count: number, select: (index: number) => void) {
  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
  if (!keys.includes(event.key)) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (current + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + count) % count
  select(next)
}

export function ProductSection({ jobs }: { jobs: Job[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const content = careerStory.product
  const active = content.tasks[activeIndex]
  const relatedJob = jobs.find((job) => job.id === active.sourceJobId && job.status === 'open')
  const selectTask = (index: number) => {
    setActiveIndex(index)
    requestAnimationFrame(() => tabsRef.current[index]?.focus())
  }

  return (
    <section className="pw-product section-shell" id="product" aria-labelledby="product-title">
      <div className="section-heading pw-heading">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="product-title">{content.title}</h2>
        </div>
        <p>{content.description}</p>
      </div>

      <div className="pw-context-grid">
        {content.context.map((item, index) => <article className="pw-context-card" key={item.label}>
          <div className="pw-context-label"><span>0{index + 1}</span>{item.label}</div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>)}
      </div>

      <div className="pw-product-layout">
        <div className="pw-product-copy">
          <div className="pw-product-kicker"><Spark /><span>{content.tasksLabel}</span></div>
          <div className="pw-tabs" role="tablist" aria-label={content.tasksLabel}>
            {content.tasks.map((task, index) => <button
              key={task.id}
              ref={(element) => { tabsRef.current[index] = element }}
              className={`pw-tab${activeIndex === index ? ' is-active' : ''}`}
              id={`product-tab-${task.id}`}
              role="tab"
              type="button"
              aria-selected={activeIndex === index}
              aria-controls={`product-panel-${task.id}`}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => selectTask(index)}
              onKeyDown={(event) => moveTab(event, index, content.tasks.length, selectTask)}
            ><span>{task.label}</span><Arrow /></button>)}
          </div>
          <p className="pw-product-note">{content.sourceNote}</p>
        </div>

        <article className={`pw-task-panel pw-${active.tint}`} id={`product-panel-${active.id}`} role="tabpanel" aria-labelledby={`product-tab-${active.id}`} tabIndex={0}>
          <div className="pw-task-intro">
            <div><p className="pw-task-label">{active.label}</p><h3>{active.title}</h3><p>{active.description}</p></div>
            <div className="pw-demo-mascot" aria-hidden="true"><div className="pw-mascot-halo" /><img src={active.mascot} alt="" /></div>
          </div>
          <div className="pw-task-delivery">
            <h4>{content.taskListLabel}</h4>
            <ol>{active.tasks.map((task, index) => <li key={task}><span aria-hidden="true">0{index + 1}</span><p>{task}</p></li>)}</ol>
          </div>
          <div className="pw-task-outcome"><span>{content.outcomeLabel}</span><p>{active.outcome}</p></div>
          <a className="pw-job-link" href={relatedJob ? siteHref(`/jobs/${relatedJob.id}`) : '#jobs'}>
            <span>{relatedJob ? content.jobAction : content.fallbackAction}</span><Arrow />
          </a>
        </article>
      </div>
    </section>
  )
}

export function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const content = careerStory.work
  const active = content.steps[activeIndex]
  const selectStep = (index: number) => {
    setActiveIndex(index)
    requestAnimationFrame(() => tabsRef.current[index]?.focus())
  }

  return (
    <section className="pw-work section-shell" id="work" aria-labelledby="work-title">
      <div className="section-heading pw-heading">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="work-title">{content.title}</h2>
        </div>
        <p>{content.description}</p>
      </div>

      <div className="pw-work-card">
        <div className="pw-work-topline"><span>{content.caseLabel}</span><span className="pw-work-live"><i /> {content.stepHint}</span></div>
        <div className="pw-work-grid">
          <div className="pw-step-tabs" role="tablist" aria-label={content.caseLabel}>
            {content.steps.map((step, index) => (
              <button
                key={step.id}
                ref={(element) => { tabsRef.current[index] = element }}
                className={`pw-step-tab${activeIndex === index ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`work-panel-${step.id}`}
                id={`work-tab-${step.id}`}
                tabIndex={activeIndex === index ? 0 : -1}
                onClick={() => selectStep(index)}
                onKeyDown={(event) => moveTab(event, index, content.steps.length, selectStep)}
              >
                <span className="pw-step-number">{step.number}</span>
                <span className="pw-step-label"><small>{step.label}</small><b>{step.title}</b></span>
                <Arrow />
              </button>
            ))}
          </div>

          <article className="pw-work-panel" id={`work-panel-${active.id}`} role="tabpanel" aria-labelledby={`work-tab-${active.id}`} tabIndex={0}>
            <div className="pw-work-panel-head"><span>{active.label}</span><span>{active.number} / {String(content.steps.length).padStart(2, '0')}</span></div>
            <div className="pw-work-panel-body">
              <div>
                <h3>{active.title}</h3>
                <p>{active.description}</p>
                <p className="pw-work-detail">{active.detail}</p>
              </div>
              <div className="pw-work-mascot" aria-hidden="true"><div className="pw-mascot-halo" /><img src={active.mascot} alt="" /></div>
            </div>
            <div className="pw-work-line" aria-hidden="true">{content.steps.map((step, index) => <span key={step.id} className={index === activeIndex ? 'is-active' : undefined} />)}</div>
          </article>
        </div>
        <div className="pw-vibe-closing"><Spark /><p>{content.closing}</p></div>
      </div>
    </section>
  )
}
