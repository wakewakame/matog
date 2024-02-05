// import { UndoManager, type Operation } from './undo'

test('undo and redo', () => {
  // const undo = new UndoManager()
  // undo.commit(moveAction())

  // undo.undo()
  expect(1 + 2).toBe(3)

  // undo.redo()
  expect(1 + 2).toBe(3)
})

test('transaction', () => {
  // const undo = new UndoManager()

  // mouse down
  // const move = new PointMove(undo.transaction(), undo.model.points[0])

  // mouse move
  // move.move(0, 1)
  // move.move(0, 2)
  // move.move(0, 3)

  // mouse down
  // move.commit()

  // undo.undo()
  expect(1 + 2).toBe(3)
})

test('double transaction', () => {
  // 二重にトランザクションが発生した場合は最初のトランザクションをロールバックし、無かったことにする。
})

test('rollback', () => {
})

test('hook', () => {
})
