export default class {
  private count: number
  private hook?: (count: number) => void
  constructor () {
    this.count = 0
  }

  setHook (hook: (count: number) => void): void {
    this.hook = hook
    this.hook(this.count)
  }

  countUp (): void {
    this.count += 1
    this.hook?.(this.count)
  }
}
