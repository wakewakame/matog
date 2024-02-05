import { UndoManager, type Operation } from './undo'

class Count {
  private _count: number
  private hook?: (count: number) => void
  constructor () {
    this._count = 0
  }

  get count (): number {
    return this._count
  }

  set count (c: number) {
    this._count = c
    this.hook?.(this._count)
  }

  setHook (hook: (count: number) => void): void {
    this.hook = hook
    this.hook(this._count)
  }
}

export default class {
  private readonly scene: UndoManager<Count>
  constructor () {
    this.scene = new UndoManager(new Count(), 1024)
  }

  countUp (): void {
    this.scene.do(async (state: Count): Promise<Operation<Count>> => {
      state.count += 1
      return {
        redo: (state: Count) => { state.count += 1 },
        undo: (state: Count) => { state.count -= 1 }
      }
    }).catch(console.error)
  }

  redo (): void {
    this.scene.redo()
  }

  undo (): void {
    this.scene.undo()
  }

  setHook (callback: (count: number) => void): void {
    this.scene.state.setHook(callback)
  }
}
