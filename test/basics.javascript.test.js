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
