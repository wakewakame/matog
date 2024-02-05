import Model from './model'
import wasmMVG, { type Module } from 'wasmMVG'

class MatogRoot extends HTMLElement {
  constructor () {
    super()
    const model = new Model()
    this.style.display = 'block'
    const shadow = this.attachShadow({ mode: 'closed' })

    shadow.appendChild((() => {
      const style = document.createElement('style')
      style.textContent = `
        .root {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
      `
      return style
    })())

    let text: HTMLHeadingElement
    shadow.appendChild((() => {
      const root = document.createElement('div')
      root.classList.add('root')
      root.appendChild((() => {
        const center = document.createElement('div')
        center.classList.add('center')
        center.appendChild((() => {
          text = document.createElement('h1')
          return text
        })())
        center.appendChild((() => {
          const button = document.createElement('button')
          model.setHook((count: number) => {
            button.textContent = `count ${count}`
          })
          button.addEventListener('click', () => {
            model.countUp()
          })
          return button
        })())
        center.appendChild((() => {
          const button = document.createElement('button')
          button.textContent = 'undo'
          button.addEventListener('click', () => {
            model.undo()
          })
          return button
        })())
        center.appendChild((() => {
          const button = document.createElement('button')
          button.textContent = 'redo'
          button.addEventListener('click', () => {
            model.redo()
          })
          return button
        })())
        return center
      })())
      return root
    })())

    wasmMVG()
      .then((mvg: Module) => {
        text.textContent = mvg.hello('world')
      })
      .catch((e: any) => {
        console.error(e)
      })
  }
}
customElements.define('matog-root', MatogRoot)
