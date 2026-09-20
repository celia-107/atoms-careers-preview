import { useState } from 'react'
import { careerStory } from '../data/careerStory'
import { heroCharacters, characterStyle, mascots } from '../data/mascots'

export function RecruitHero({ onApply }: { onApply: () => void }) {
  const [paused, setPaused] = useState(false)
  const content = careerStory.hero
  return <section className={`recruit-hero section-shell${paused ? ' motion-paused' : ''}`} aria-labelledby="hero-title">
    <div className="recruit-hero-copy">
      <p className="eyebrow"><span className="status-dot" /> {content.eyebrow}</p>
      <h1 id="hero-title">{content.title}<br /><span>{content.titleAccent}</span></h1>
      <div className="recruit-intro">
        <p className="recruit-product">{content.product}</p>
        <p className="recruit-invitation">{content.invitation}</p>
      </div>
      <div className="recruit-actions"><a href="#jobs" className="button button-dark">{content.jobsAction} <span aria-hidden="true">↗</span></a><button type="button" onClick={onApply} className="recruit-secondary">{content.applyAction} <span aria-hidden="true">↗</span></button></div>
      <p className="recruit-byline">{content.byline}</p>
    </div>
    <div className="mascot-ensemble" aria-label="七位蛋仔伙伴一起迎接新的创造者">
      <div className="ensemble-orbit" /><div className="ensemble-stage" />
      <span className="ensemble-bubble bubble-idea">一个好想法 ✦</span><span className="ensemble-bubble bubble-hello">Hello, you!</span>
      <span className="ensemble-spark spark-left" aria-hidden="true">✦</span><span className="ensemble-spark spark-right" aria-hidden="true">✧</span>
      {heroCharacters.map(character => <img key={character.name} className="ensemble-character" src={mascots[character.name]} style={characterStyle(character)} alt="" fetchPriority="high" />)}
      <button className="motion-toggle" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? '播放首屏动画' : '暂停首屏动画'} aria-pressed={paused}><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>
    </div>
    <div className="recruit-hero-foot"><div><span>01</span> 理解真实问题</div><div><span>02</span> 借助 AI 交付</div><div><span>03</span> 主动验证迭代</div><a href="#product">往下了解 <span aria-hidden="true">↓</span></a></div>
  </section>
}
