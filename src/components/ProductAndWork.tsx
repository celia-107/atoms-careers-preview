import { useRef, useState, type KeyboardEvent } from 'react'
import { careerStory } from '../data/careerStory'
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

export function ProductSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activityPreviewed, setActivityPreviewed] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const content = careerStory.product
  const active = content.demos[activeIndex]
  const preview = content.preview
  const toggleTask = (id: string) => setCompletedTasks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const selectDemo = (index: number) => {
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

      <div className="pw-product-layout">
        <div className="pw-product-copy">
          <div className="pw-product-kicker"><Spark /> <span>{content.demosLabel}</span></div>
          <div className="pw-tabs" role="tablist" aria-label={content.demosLabel}>
            {content.demos.map((demo, index) => (
              <button
                key={demo.id}
                ref={(element) => { tabsRef.current[index] = element }}
                className={`pw-tab${activeIndex === index ? ' is-active' : ''}`}
                id={`product-tab-${demo.id}`}
                role="tab"
                type="button"
                aria-selected={activeIndex === index}
                aria-controls={`product-panel-${demo.id}`}
                tabIndex={activeIndex === index ? 0 : -1}
                onClick={() => selectDemo(index)}
                onKeyDown={(event) => moveTab(event, index, content.demos.length, selectDemo)}
              >
                <span>{demo.label}</span><Arrow />
              </button>
            ))}
          </div>
          <p className="pw-product-note">{content.note}</p>
        </div>

        <article className={`pw-product-demo pw-${active.tint}`} id={`product-panel-${active.id}`} role="tabpanel" aria-labelledby={`product-tab-${active.id}`}>
          <div className="pw-demo-topline"><span>{active.label}</span><span className="pw-demo-status">{content.demoStatus}</span></div>
          <div className="pw-demo-main">
            <div className="pw-demo-text">
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <p className="pw-demo-audience">{active.audience}</p>
            </div>
          </div>
          <div className="pw-preview-window">
            <div className="pw-preview-bar"><div aria-hidden="true"><i /><i /><i /></div><span>{preview.browserLabel}</span><span>{preview.badge}</span></div>
            {active.id === 'launch-page' ? (
              <div className="pw-activity-preview">
                <div className="pw-activity-copy">
                  <span className="pw-preview-eyebrow">{preview.activity.eyebrow}</span>
                  <h4>{preview.activity.title}</h4>
                  <p>{preview.activity.description}</p>
                  <div className="pw-activity-tags">{preview.activity.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <button type="button" className="pw-preview-cta" onClick={() => setActivityPreviewed(!activityPreviewed)} aria-expanded={activityPreviewed} aria-controls="activity-preview-feedback">{activityPreviewed ? preview.activity.close : preview.activity.action}<Arrow /></button>
                </div>
                <div className="pw-activity-art" aria-hidden="true"><div className="pw-art-circle" /><span className="pw-art-star">✦</span><span className="pw-art-plus">+</span><img src={active.mascot} alt="" /></div>
                {activityPreviewed && <p id="activity-preview-feedback" className="pw-preview-feedback" role="status">{preview.activity.confirmation}</p>}
              </div>
            ) : (
              <div className="pw-task-preview">
                <div className="pw-task-heading"><div><span className="pw-preview-eyebrow">{preview.tasks.eyebrow}</span><h4>{preview.tasks.title}</h4><p>{preview.tasks.description}</p></div><img src={active.mascot} alt="" aria-hidden="true" /></div>
                <div className="pw-task-list">
                  {preview.tasks.items.map((task) => {
                    const checked = completedTasks.includes(task.id)
                    return <button className={`pw-task-item${checked ? ' is-complete' : ''}`} type="button" key={task.id} aria-pressed={checked} onClick={() => toggleTask(task.id)}><span className="pw-task-check" aria-hidden="true">{checked ? '✓' : ''}</span><span><b>{task.label}</b><small>{task.meta}</small></span><span className="pw-task-dot" aria-hidden="true" /></button>
                  })}
                </div>
                <div className="pw-task-footer"><span aria-live="polite">{completedTasks.length} / {preview.tasks.items.length} {preview.tasks.progressLabel}</span><button type="button" onClick={() => setCompletedTasks([])} disabled={!completedTasks.length}>{preview.tasks.reset}</button></div>
              </div>
            )}
          </div>
          <p className="pw-demo-result">{active.result}</p>
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

          <article className="pw-work-panel" id={`work-panel-${active.id}`} role="tabpanel" aria-labelledby={`work-tab-${active.id}`}>
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
