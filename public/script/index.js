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

  get text() {return this.#text}
  set text(text) {this.#text = text; this.#bake()}

  get cursor() {
    if (!this.#isFocused)
      return null
    return this.#cursor
  }
  set cursor(cursor) {
    if (!this.#isFocused)
      return;
    this.#cursor =
      Math.max(0,
        Math.min(this.#text.length,
          cursor))
    this.#bake()
  }

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

  withText(text) {
    if (!this.#isFocused)
      return;
    this.#text =
      this.#text.substring(0, this.#cursor) +
      text +
      this.#text.substring(this.#cursor)
    this.#cursor += text.length
    this.#bake()
    return this
  }

  withoutText(length = 1) {
    if (!this.#isFocused)
      return;
    this.#text =
      this.#text.substring(0, this.#cursor - length) +
      this.#text.substring(this.#cursor)
    this.#cursor = length > this.#cursor ? 0 : this.#cursor - length
    this.#bake()
    return this
  }

  on(eventType, handler, options) {
    this.#eventTarget.addEventListener(eventType, handler, options)
    return this
  }

  off(eventType, handler, options) {
    this.#eventTarget.removeEventListener(eventType, handler, options)
    return this
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
        this.withoutText()
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
        e.preventDefault()
        this.withText('\t')
        return;
    }
  }

  #onKeyPress(e) {
    if (this.#dispatch(e).defaultPrevented)
      return;
    if (PRINTABLE.test(e.key)) {
      this.withText(e.key)
      return;
    }
    switch (e.key) {
      case 'Enter':
        this.withText('\n')
        return;
    }
  }

}
