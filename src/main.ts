import './style.css'
import wasmMVG, { type Module } from 'wasmMVG'

class HelloWolrd extends HTMLDivElement {
  constructor () {
    super()
    this.className = 'app'
    const text = document.createElement('h1')
    this.appendChild(text)
    wasmMVG()
      .then((mvg: Module) => {
        text.textContent = mvg.hello('world')
      })
      .catch((e: any) => {
        console.error(e)
      })
  }
}
customElements.define('hello-world', HelloWolrd, { extends: 'div' })

document.body.appendChild(document.createElement('div', { is: 'hello-world' }))
