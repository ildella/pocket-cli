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

test('object assign with null and undefined', () => {
  expect(Object.assign({a: 1}, null)).toEqual({a: 1})
  expect(Object.assign({a: 1}, undefined)).toEqual({a: 1})
})
