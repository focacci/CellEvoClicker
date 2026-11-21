// One shared audio engine. Browsers keep it paused until the player first clicks or presses a key.
export const audio = new (window.AudioContext || window.webkitAudioContext)()

export function resumeAudio() {
  if (audio.state === 'suspended') audio.resume()
}

addEventListener('pointerdown', resumeAudio)
addEventListener('keydown', resumeAudio)
