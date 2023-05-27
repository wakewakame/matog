export interface Operation<State> {
  redo: (state: State) => void
  undo: (state: State) => void
}
export class UndoManager<State> {
  private readonly _state: State
  private history: Array<Operation<State>>
  private readonly maxHistory: number
  private undoCount: number
  private isLocked: boolean
  constructor (state: State, maxHistory?: number) {
    // 現在の状態
    this._state = state

    // 操作履歴
    this.history = []

    // 記録可能な最大操作履歴数 (1 <= this.maxHistory <= Infinity)
    this.maxHistory =
      (typeof (maxHistory) === 'number' && Number.isFinite(maxHistory))
        ? Math.max(Math.floor(maxHistory), 1)
        : Infinity

    // 現時点での undo 回数
    // (新たな操作が行われると 0 にリセットされる)
    this.undoCount = 0

    // do 関数が実行中に true となる
    this.isLocked = false
  }

  get state (): State {
    return this._state
  }

  async do (callback: (state: State) => Promise<Operation<State> | null>): Promise<boolean> {
    // この関数は async のため、2 つ以上の操作が並行して実行される可能性がる。
    // しかし、同時に 2 つ以上の操作ができてしまうと操作履歴が破綻しうるため、これを防ぐ。
    // また、 callback 内でさらに do を呼ぶとデッドロックするため注意する。
    while (this.isLocked) { await new Promise(resolve => setTimeout(resolve, 0)) }
    this.isLocked = true

    // 操作の実行
    // MEMO:
    //   この方法は少し危険で、 callback が state を編集したにもかかわらず null を返してしまうと操作履歴が破綻する。
    //   ぱっと思いつく対策案としては lodash などで state のディープコピーを作って state のバックアップを作る方法がある。
    //   しかし、この方法はあまり深く理解できておらず、安全性が気になる。
    //   例えば state のメンバに this をキャプチャしているアロー関数があったとき、その this はコピー前のインスタンスを指す。
    //   このような罠になりうる挙動が他にもありそうなので、ここでは callback に生の this.state を渡すことにする。
    const operation = await callback(this._state)
    if (operation === null) {
      this.isLocked = false
      return false
    }

    // 操作履歴の追加
    if (this.undoCount !== 0) {
      this.history = this.history.slice(0, this.history.length - this.undoCount)
      this.undoCount = 0
    }
    if (this.history.length + 1 > this.maxHistory) {
      this.history = this.history.slice(this.history.length + 1 - this.maxHistory)
    }
    this.history.push(operation)
    this.isLocked = false
    return true
  }

  redo (): void {
    if (this.history.length === 0 || this.undoCount === 0) { return }
    const operation = this.history[this.history.length - this.undoCount]
    operation.redo(this._state)
    this.undoCount -= 1
  }

  undo (): void {
    if (this.history.length === 0 || this.undoCount === this.history.length) { return }
    const operation = this.history[this.history.length - 1 - this.undoCount]
    operation.undo(this._state)
    this.undoCount += 1
  }
}
