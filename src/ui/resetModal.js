// "Reset all progress?": Cancel, or erase the save and start over. Sound and visual settings stay.
import { $ } from './dom.js'
import { closeModal } from './modal.js'
import { wipeSave } from '../save.js'

const modal = $('#reset-modal'), confirm = $('#reset-confirm')

$('#reset-cancel').addEventListener('click', () => closeModal(modal))
confirm.addEventListener('click', async () => {
  confirm.disabled = true
  confirm.textContent = 'Resetting…'
  await wipeSave()
  location.reload()
})
