import { useCallback, useEffect, useRef, useState } from 'react'
import { mascots } from '../data/mascots'
import {
  CAREER_FAQ_CATEGORIES,
  CAREER_FAQS,
  CAREER_INFO,
  CAREER_PROCESS,
  type FaqItem,
} from '../data/careerInfo'
import './ProcessAndFaq.css'

type ProcessSectionProps = {
  /** 由页面传入正式投递入口；省略时保持为演示页面。 */
  onApply?: () => void
}

type FaqSectionProps = {
  onApply?: () => void
}

function ProcessMascot() {
  return (
    <div className="pf-mascot-wrap" aria-hidden="true">
      <span className="pf-mascot-orbit pf-mascot-orbit-one" />
      <span className="pf-mascot-orbit pf-mascot-orbit-two" />
      <img className="pf-mascot" src={mascots.snow} alt="" />
      <span className="pf-mascot-spark pf-mascot-spark-one">✦</span>
      <span className="pf-mascot-spark pf-mascot-spark-two">·</span>
    </div>
  )
}

/** 招聘流程展示模块。步骤文案来自独立数据层，便于未来替换为已确认流程。 */
export function ProcessSection({ onApply }: ProcessSectionProps) {
  return (
    <section className="section-shell pf-process-section" id="process" aria-labelledby="pf-process-title">
      <div className="section-heading pf-section-heading">
        <div>
          <p className="eyebrow">{CAREER_INFO.process.eyebrow}</p>
          <h2 id="pf-process-title">{CAREER_INFO.process.heading[0]}<br />{CAREER_INFO.process.heading[1]}</h2>
        </div>
        <p>{CAREER_INFO.process.introduction[0]}<br />{CAREER_INFO.process.introduction[1]}</p>
      </div>

      <div className="pf-process-card">
        <ol className="pf-process-list" aria-label="招聘流程示例">
          {CAREER_PROCESS.map((step, index) => (
            <li className="pf-process-step" key={step.id}>
              <div className="pf-process-step-marker" aria-hidden="true">
                <span>{step.number}</span>
                {index < CAREER_PROCESS.length - 1 && <i />}
              </div>
              <div className="pf-process-step-copy">
                <div className="pf-process-step-title">
                  <h3>{step.title}</h3>
                  {step.status === 'example' && <span className="pf-example-tag">流程示例</span>}
                </div>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="pf-process-aside">
          <ProcessMascot />
          <p className="pf-aside-kicker">A SMALL NOTE</p>
          <h3>{CAREER_INFO.process.asideTitle}</h3>
          <p>{CAREER_INFO.process.asideDescription}</p>
          <span className="pf-confirm-note">{CAREER_INFO.process.notice}</span>
          {onApply && (
            <button className="button button-dark pf-process-cta" type="button" onClick={onApply}>
              带着作品来 <span aria-hidden="true">↗</span>
            </button>
          )}
        </aside>
      </div>
    </section>
  )
}

function FaqItemRow({ item, expanded, onToggle }: { item: FaqItem; expanded: boolean; onToggle: () => void }) {
  const answerId = `pf-answer-${item.id}`
  return (
    <article className={`pf-faq-item${expanded ? ' is-open' : ''}`}>
      <h3>
        <button
          className="pf-faq-question"
          type="button"
          aria-expanded={expanded}
          aria-controls={answerId}
          onClick={onToggle}
        >
          <span>{item.question}</span>
          <span className="pf-faq-plus" aria-hidden="true">+</span>
        </button>
      </h3>
      <div className="pf-faq-answer" id={answerId} hidden={!expanded}>
        <p>{item.answer}</p>
      </div>
    </article>
  )
}

function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!open) {
      if (dialog.open) dialog.close()
      return
    }

    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', handleCancel)
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    const focusFrame = requestAnimationFrame(() => dialog.querySelector<HTMLElement>('.pf-dialog-close')?.focus())

    return () => {
      cancelAnimationFrame(focusFrame)
      dialog.removeEventListener('cancel', handleCancel)
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      className="pf-contact-dialog"
      aria-labelledby="pf-contact-title"
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
      }}
    >
      <button className="icon-button pf-dialog-close" type="button" aria-label="关闭联系方式" onClick={onClose}>×</button>
      <p className="eyebrow">STAY IN THE LOOP</p>
      <h2 id="pf-contact-title">{CAREER_INFO.contact.title}</h2>
      <p className="pf-dialog-lead">{CAREER_INFO.contact.description}</p>
      <div className="pf-dialog-prep">
        <h3>你可以先准备</h3>
        {CAREER_INFO.contact.preparation.map((item) => <p key={item}><span aria-hidden="true">✦</span> {item}</p>)}
      </div>
      <div className="pf-dialog-actions">
        <a className="button button-outline" href="#jobs" onClick={onClose}>返回岗位</a>
      </div>
    </dialog>
  )
}

/** FAQ 模块：分类筛选、可展开回答及不收集信息的联系说明。 */
export function FaqSection({ onApply }: FaqSectionProps) {
  const [category, setCategory] = useState<(typeof CAREER_FAQ_CATEGORIES)[number]>('全部')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])

  const visibleFaqs = category === '全部' ? CAREER_FAQS : CAREER_FAQS.filter((item) => item.category === category)

  return (
    <section className="section-shell pf-faq-section" id="faq" aria-labelledby="pf-faq-title">
      <div className="section-heading pf-section-heading">
        <div>
          <p className="eyebrow">{CAREER_INFO.faq.eyebrow}</p>
          <h2 id="pf-faq-title">{CAREER_INFO.faq.heading[0]}<br />{CAREER_INFO.faq.heading[1]}</h2>
        </div>
        <p>{CAREER_INFO.faq.introduction[0]}<br />{CAREER_INFO.faq.introduction[1]}</p>
      </div>

      <div className="pf-faq-layout">
        <div className="pf-faq-main">
          <div className="pf-faq-categories" role="group" aria-label="常见问题分类">
            {CAREER_FAQ_CATEGORIES.map((name) => (
              <button
                className={category === name ? 'is-active' : ''}
                key={name}
                type="button"
                aria-pressed={category === name}
                onClick={() => { setCategory(name); setExpandedId(null) }}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="pf-faq-list">
            {visibleFaqs.map((item) => (
              <FaqItemRow
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId((current) => current === item.id ? null : item.id)}
                key={item.id}
              />
            ))}
          </div>
        </div>

        <aside className="pf-faq-contact">
          <div className="pf-faq-contact-mascot" aria-hidden="true"><img src={mascots.orange} alt="" /></div>
          <p className="pf-aside-kicker">CAN’T FIND IT?</p>
          <h3>{CAREER_INFO.faq.asideTitle[0]}<br />{CAREER_INFO.faq.asideTitle[1]}</h3>
          <p>{CAREER_INFO.faq.asideDescription}</p>
          <button className="button button-outline pf-contact-button" type="button" onClick={() => setContactOpen(true)}>联系方式待补充 <span aria-hidden="true">↗</span></button>
          {onApply && <button className="pf-apply-link" type="button" onClick={onApply}>查看投递入口 <span aria-hidden="true">→</span></button>}
        </aside>
      </div>

      <ContactDialog open={contactOpen} onClose={closeContact} />
    </section>
  )
}

export type { FaqSectionProps, ProcessSectionProps }
