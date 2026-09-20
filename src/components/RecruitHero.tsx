import { useState } from 'react'
import { heroCharacters, characterStyle, mascots } from '../data/mascots'

export function RecruitHero() {
  const [paused, setPaused] = useState(false)
  return <section className={`recruit-hero section-shell${paused ? ' motion-paused' : ''}`} aria-labelledby="hero-title">
    <div className="recruit-hero-copy">
      <p className="eyebrow"><span className="status-dot" /> HELLO, VIBE CODERS.</p>
      <h1 id="hero-title">好想法，<br /><span>一起做出来。</span></h1>
      <p className="recruit-intro">和 AI 一起，把灵感变成可用的产品。<br />带着好奇心，也带着你的作品。</p>
      <div className="recruit-actions"><a href="#jobs" className="button button-dark">查看岗位 <span aria-hidden="true">↗</span></a><a href="#product" className="recruit-secondary">先认识我们 <span aria-hidden="true">↓</span></a></div>
      <p className="recruit-byline">HUMAN IMAGINATION. AI POSSIBILITY.</p>
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
