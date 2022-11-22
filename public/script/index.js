import {ComponentBase} from './fuffle.js'

const PRINTABLE = /^[a-zA-Z0-9`~!@#$%^&*()\-_=+\[\]{}\\|;:'",.<>\/?\s]$/

class EditorConsole extends ComponentBase {
  static TAG_NAME = 'editor-console'
  static create(text) {
    const instance = this.fromElement(document.createElement(this.TAG_NAME))
    return text ? instance.withText(text) : instance
  }
  static Element = EditorConsole.defineElement('editor-console')
  #element = null
  #text = ''
  #eventTarget = new EventTarget()
  constructor($) {
    super($)
    this.#element = $
    $.addEventListener('keydown', _=>{this.#onKeyDown(_)})
    $.addEventListener('keypress', _=>{this.#onKeyPress(_)})
    $.setAttribute('tabindex', '0')
    $.focus()
    this.withText()
  }
  withText(text = this.#text) {
    this.#text = text
    if (!text?.length || text.endsWith('\n'))
      text += ' '
    this.#element.textContent = text
    return this
  }
  insertCharacter(character) {
    return this.withText(this.#text + character)
  }
  removeCharacter() {
    return !this.#text.length ? this :
      this.withText(this.#text.substring(0, this.#text.length - 1))
  }
  #dispatch(nativeEvent) {
    const e = new Event(nativeEvent.type, {nativeEvent})
    this.#eventTarget.dispatchEvent(e)
    return e
  }
  #onKeyDown(e) {
    if (this.#dispatch(e).defaultPrevented)
      return;
    switch (e.key) {
      case 'Backspace':
        this.removeCharacter()
        return;
    }
  }
  #onKeyPress(e) {
    if (this.#dispatch(e).defaultPrevented)
      return;
    if (PRINTABLE.test(e.key)) {
      this.insertCharacter(e.key)
      return;
    }
    switch (e.key) {
      case 'Enter':
        this.insertCharacter('\n')
        return;
    }
  }
}
