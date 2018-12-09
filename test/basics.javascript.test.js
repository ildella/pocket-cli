test('this', () => {
  // console.log(this)
  const o = {
    prop: 'value',
    run: () => {
      // console.log(this)
      expect(o.prop).toBe('value')
    }
  }
  o.run()
})

test('array shift', () => {
  const a = [1, 2, 3]
  const b = a.shift()
  expect(a).toEqual([2, 3])
  expect(b).toEqual(1)
})
