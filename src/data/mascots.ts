import type { CSSProperties } from 'react'
import { siteHref } from '../routing'

export const mascots = {
  pink: siteHref('/mascots/IP-2.png'),
  explorer: siteHref('/mascots/IP-8.png'),
  snow: siteHref('/mascots/IP-14.png'),
  scholar: siteHref('/mascots/IP-20.png'),
  blue: siteHref('/mascots/IP-26.png'),
  mint: siteHref('/mascots/IP-32.png'),
  orange: siteHref('/mascots/IP-38.png'),
} as const

export const heroCharacters = [
  { name: 'explorer', left: '17%', top: '12%', width: '32%', tilt: '-8deg', delay: '-.8s' },
  { name: 'scholar', left: '44%', top: '1%', width: '30%', tilt: '6deg', delay: '-2s' },
  { name: 'orange', left: '73%', top: '22%', width: '30%', tilt: '-8deg', delay: '-3.5s' },
  { name: 'pink', left: '-1%', top: '48%', width: '32%', tilt: '7deg', delay: '-1.6s' },
  { name: 'snow', left: '23%', top: '53%', width: '34%', tilt: '-4deg', delay: '-3s' },
  { name: 'blue', left: '47%', top: '42%', width: '39%', tilt: '7deg', delay: '-4.4s' },
  { name: 'mint', left: '74%', top: '53%', width: '31%', tilt: '-6deg', delay: '-5.1s' },
] as const

export function characterStyle(character: typeof heroCharacters[number]): CSSProperties {
  return { left: character.left, top: character.top, width: character.width, '--tilt': character.tilt, '--delay': character.delay } as CSSProperties
}

/** Decorative presentation only; job content stays in the jobs service. */
export function jobMascot(department: string) {
  if (department === '产品体验') return { src: mascots.pink, tint: 'rose' }
  if (department === '社区与增长') return { src: mascots.mint, tint: 'mint' }
  return { src: mascots.blue, tint: 'lilac' }
}
