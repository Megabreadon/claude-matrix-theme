import type { Register, ThemeSetArgs, ThemeSound } from 'claude-code'

import { makeColors } from './make-colors.js'

const GREEN = '#00a028'
const BLACK = '#000000'

const { theme, problems } = makeColors({
  label: 'Matrix',
  roles: { accent: '#00ff41', danger: '#ff3b3b', success: '#00d437', warning: '#d4c000', pro: '#33ccff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#000000',
        'surface-1': '#050505',
        'surface-2': '#0a0a0a',
        'surface-3': '#0f0f0f',
        'text-primary': '#f2f2f2',
        'text-secondary': '#cfcfcf',
        'text-muted': '#a0a0a0',
      },
    },
  },
  only: 'dark',
})

// What falls in the rain. The person picks one in the plugin's config.
const CHARSETS: Record<string, string> = {
  katakana: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789',
  binary: '01',
  hex: '0123456789ABCDEF',
  runes: 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ',
  math: '∑∫∂∇∞≈≠±√πΩΔΛΞΨΦ',
  symbols: '#$%&*+=<>?@~^|/\\{}[]',
}

function makeRain(chars: string): string {
  const pool = Array.from(chars)
  let seed = 7
  const pick = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return pool[seed % pool.length]
  }
  const columns = Array.from({ length: 20 }, (_, i) => {
    const x = 10 + i * 20
    const delay = -((i * 7) % 9)
    const glyphs = Array.from({ length: 14 }, (_, j) => `<text class="c" x="${x}" y="${20 + j * 18}">${pick()}</text>`).join('')
    return `<g class="d" style="animation-delay:${delay}s">${glyphs}</g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
<style>
.c{font:14px monospace;fill:#00ff41;opacity:.18}
.d{animation:fall 9s linear infinite}
@keyframes fall{from{transform:translateY(-320px)}to{transform:translateY(320px)}}
</style>
<rect width="400" height="300" fill="#000000"/>
${columns}
</svg>`
}

// Sound packs the person picks in the plugin's config. The theme can only
// synthesize tones from numbers: it cannot play mp3 files.
const SOUNDS: Record<string, ThemeSound> = {
  // Terminal blips, a data-upload send, a payphone-style ring when Claude asks.
  matrix: {
    cues: {
      // Fast rising data burst.
      send: { layers: [{ wave: 'square', notes: ['C7', 'E7', 'G7', 'C8', 'G7'], step: 0.03, gain: 0.07 }] },
      // A keystroke tick.
      tool: { layers: [{ wave: 'square', notes: ['A6'], gain: 0.035 }] },
      // Connection established: low saw sweep under a bright bell.
      done: {
        layers: [
          { wave: 'saw', notes: ['A2', 'E3'], step: 0.09, gain: 0.08 },
          { wave: 'bell', notes: ['E6', 'B6', 'E7'], step: 0.09, gain: 0.12 },
        ],
      },
      // The payphone ring: two-tone, repeated.
      ask: { layers: [{ wave: 'square', notes: ['E6', 'G6', 'E6', 'G6', 'E6', 'G6'], step: 0.07, gain: 0.09 }] },
      // A glitch: low saw dropping away.
      error: { layers: [{ wave: 'saw', notes: ['E3', 'E2', 'A1'], step: 0.06, glide: -12, gain: 0.12 }] },
      // A downward data sweep.
      compact: { layers: [{ wave: 'sine', notes: ['C7'], glide: -24, gain: 0.08 }] },
      click: { layers: [{ wave: 'square', notes: ['G6'], gain: 0.05 }] },
    },
  },
  // The first, gentler set.
  minimal: {
    cues: {
      send: { layers: [{ wave: 'square', notes: ['E5', 'B5', 'E6'], step: 0.04, gain: 0.1 }] },
      tool: { layers: [{ wave: 'sine', notes: ['C7'], gain: 0.05 }] },
      done: { layers: [{ wave: 'bell', notes: ['E5', 'G5', 'C6', 'E6'], step: 0.1, gain: 0.2 }] },
      ask: { layers: [{ wave: 'triangle', notes: ['A5', 'E6', 'A6'], step: 0.12, gain: 0.22 }] },
      error: { layers: [{ wave: 'saw', notes: ['A3', 'E3'], step: 0.12, gain: 0.15 }] },
      compact: { layers: [{ wave: 'sine', notes: ['G6', 'C6'], step: 0.08, gain: 0.1 }] },
      click: { layers: [{ wave: 'sine', notes: ['C6'], gain: 0.08 }] },
    },
  },
}

const CUE_NAMES = ['send', 'tool', 'done', 'ask', 'error', 'compact', 'click'] as const

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'matrix-rain', glass: { blur: 0, tint: '#000000', opacity: 0.55 } },
  style: {
    Text: { fontFamily: ['cursive'], fontWeight: 'bold', letterSpacing: 1 },
    UserMessage: {
      color: '#b0b0b0',
      fontFamily: ['cursive'],
      backgroundColor: BLACK,
      borderWidth: 0,
      radius: 4,
      padding: 10,
    },
    AssistantMessage: {
      color: GREEN,
      fontFamily: ['cursive'],
      backgroundColor: BLACK,
      borderWidth: 0,
      radius: 4,
      padding: 10,
    },
    ToolUse: { color: '#00d437', fontFamily: ['mono'], backgroundColor: BLACK },
  },
}

export const register: Register = (on, options) => {
  const name = String(options.charset ?? 'katakana')
  const RAIN = makeRain(CHARSETS[name] ?? CHARSETS.katakana)
  const pack = String(options.sounds ?? 'matrix')
  const chosen = SOUNDS[pack]

  // Per-cue switches: each `cue_<name>` setting set to `off` drops that cue from the pack.
  const kept = CUE_NAMES.filter(cue => String(options[`cue_${cue}`] ?? 'on') !== 'off')
  const cues = Object.fromEntries(kept.map(cue => [cue, chosen?.cues?.[cue]]).filter(([, value]) => value !== undefined))
  const sound: ThemeSound | undefined = chosen === undefined || Object.keys(cues).length === 0 ? undefined : { cues }
  const look: ThemeSetArgs = sound === undefined ? LOOK : { ...LOOK, sound }

  // Off switch: the plugin stays installed but draws nothing, and wipes its look.
  const isOff = String(options.enabled ?? 'on') === 'off'

  on('session.start', async ($, e, next) => {
    if (isOff) {
      try {
        await $.theme.clear()
      } catch (error) {
        $.ui.log(String(error))
      }

      return next(e)
    }

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    try {
      await $.theme.set(look)
    } catch (error) {
      $.ui.log(String(error))

      // An older build may refuse `sound`: set the look again without it.
      try {
        await $.theme.set(LOOK)
      } catch (retry) {
        $.ui.log(String(retry))
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (isOff || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={RAIN} alt="Falling green code" isInteractive />
  })
}
