import { flatten } from '@libs/Utility/util'

describe('Utility Green Test Suite', () => {
  it('Flatten should return a flattened object', () => {
    const testObj = {
      a: {
        b: 21,
        c: {
          d: 81,
        },
        e: 99,
      },
    }
    const result = flatten(testObj)
    expect(result).toEqual({ a_b: 21, a_c_d: 81, a_e: 99 })
    expect(true).toBeTruthy()
  })
})
