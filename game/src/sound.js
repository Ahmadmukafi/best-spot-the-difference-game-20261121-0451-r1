// All sound is synthesized with WebAudio: no audio file is ever loaded.
// Each cue is a short oscillator phrase; the context starts on the first gesture.
let audio = null;

function context() {
  if (audio) return audio;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio = new AC();
  } catch {
    return null;
  }
  return audio;
}

function tone(freq, at, dur, type, gain) {
  const ac = context();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0.0001, ac.currentTime + at);
    amp.gain.exponentialRampToValueAtTime(gain, ac.currentTime + at + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
    osc.connect(amp);
    amp.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  } catch {
    // Sound is garnish: a failure here never breaks the game.
  }
}

/** Unlock audio on the first pointer or key gesture. */
export function unlockSound() {
  const ac = context();
  if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
}

/** A bright two-note chime when a difference is found. */
export function playFound() {
  tone(659, 0, 0.16, 'sine', 0.18);
  tone(880, 0.09, 0.24, 'sine', 0.18);
}

/** A low buzz when a click misses every difference. */
export function playWrong() {
  tone(140, 0, 0.18, 'square', 0.08);
}

/** A soft bell when the hint lantern lights. */
export function playHint() {
  tone(1047, 0, 0.3, 'sine', 0.1);
}

/** A four-note fanfare when a scene is cleared. */
export function playClear() {
  tone(523, 0, 0.18, 'triangle', 0.16);
  tone(659, 0.14, 0.18, 'triangle', 0.16);
  tone(784, 0.28, 0.18, 'triangle', 0.16);
  tone(1047, 0.42, 0.4, 'triangle', 0.18);
}
