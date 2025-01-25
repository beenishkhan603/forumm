import { tryGetReadableColour } from '@libs/useTheme'

it('SHOULD return correct color values from given input', () => {
  const input = [
    '#FFFFFF',
    '#000000',
    '#123123',
    '#F1F1F1',
    '#456ABC',
    '#ABC123',
  ]

  const expectedOutput = [
    '#000000',
    '#FFFFFF',
    '#FFFFFF',
    '#000000',
    '#FFFFFF',
    '#000000',
  ]

  const output: string[] = []

  input.forEach((color) =>
    output.push(tryGetReadableColour(color).toUpperCase())
  )

  expect(output).toEqual(expectedOutput)
})
