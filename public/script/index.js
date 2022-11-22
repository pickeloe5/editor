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
  #eventTarget = new EventTarget()

  #text = ''
  #textNodes = [document.createTextNode(''), document.createTextNode('')]
  #isFocused = false
  #cursor = 0
  #cursorNode = document.createElement('span')

  constructor($) {
    super($)

    this.#cursorNode.classList.add('editor-cursor')
    $.appendChild(this.#textNodes[0])

    this.#element = $
    this.#bake()
    $.addEventListener('keydown', _=>{this.#onKeyDown(_)})
    $.addEventListener('keypress', _=>{this.#onKeyPress(_)})
    $.addEventListener('blur', _=>{this.#onBlur(_)})
    $.addEventListener('focus', _=>{this.#onFocus(_)})
    $.setAttribute('tabindex', '0')
    $.focus()
  }

  insertCharacter(character) {
    if (!this.#isFocused)
      return;
    this.#text =
      this.#text.substring(0, this.#cursor) +
      character +
      this.#text.substring(this.#cursor)
    this.#cursor++
    this.#bake()
  }

  removeCharacter() {
    if (!this.#isFocused)
      return;
    this.#text =
      this.#text.substring(0, this.#cursor - 1) +
      this.#text.substring(this.#cursor)
    this.#cursor--
    this.#bake()
  }

  #bake() {
    if (this.#isFocused) {
      this.#textNodes[1].textContent = this.#text.substring(this.#cursor + 1)
      this.#cursorNode.textContent = this.#text[this.#cursor] || ' '
      this.#textNodes[0].textContent = this.#text.substring(0, this.#cursor)
      if (!this.#cursorNode.parentNode) {
        this.#element.appendChild(this.#cursorNode)
        this.#element.appendChild(this.#textNodes[1])
      }
      return;
    }
    if (this.#cursorNode.parentNode) {
      this.#element.removeChild(this.#textNodes[1])
      this.#element.removeChild(this.#cursorNode)
    }
    this.#textNodes[0].textContent = this.#text
  }

  #dispatch(nativeEvent) {
    const e = new Event(nativeEvent.type, {nativeEvent})
    this.#eventTarget.dispatchEvent(e)
    return e
  }

  #onFocus(e) {
    if (this.#dispatch(e).defaultPrevented)
      return;
    if (this.#isFocused)
      return;
    this.#isFocused = true
    this.#bake()
  }

  #onBlur(e) {
    if (this.#dispatch(e).defaultPrevented)
      return;
    if (!this.#isFocused)
      return;
    this.#isFocused = false
    this.#bake()
  }

  #onKeyDown(e) {
    if (this.#dispatch(e).defaultPrevented)
      return;
    switch (e.key) {
      case 'Backspace':
        this.removeCharacter()
        return;
      case 'ArrowLeft':
        if (!this.#isFocused || !this.#cursor)
          return;
        this.#cursor--
        this.#bake()
        return;
      case 'ArrowRight':
        if (!this.#isFocused || this.#cursor >= this.#text.length)
          return;
        this.#cursor++
        this.#bake()
        return;
      case 'Tab':
        this.insertCharacter('\t')
        e.preventDefault()
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
