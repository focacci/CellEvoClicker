// Settings → Game: Export copies the save as a text code; Import loads a pasted code (and replaces this game)
import { $ } from './dom.js'
import { exportCode, readCode, importSave } from '../save.js'
import { game } from '../state.js'

const box = $('#save-code'), note = $('#save-note')

$('#export-save').addEventListener('click', () => {
  box.value = exportCode(game)
  box.select()
  navigator.clipboard?.writeText(box.value).then(() => { note.textContent = 'Copied! Keep it somewhere safe.' },
    () => { note.textContent = 'Select the code and copy it.' })
})

$('#import-save').addEventListener('click', () => {
  const save = readCode(box.value)
  if (!save) {
    note.textContent = "That isn't a Cellular Evolution save code."
    return
  }
  importSave(save)
  location.reload()
})
