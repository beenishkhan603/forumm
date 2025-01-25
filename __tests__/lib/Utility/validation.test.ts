import { validate, ValidationRules } from '@libs/Utility/validation'

export const rules = [
  ['event_title', true],
  ['event_shortDescription', true],
  ['event_description', true],
  ['event_description', (field: string) => field.length > 2],
] as ValidationRules

const GREEN_TestData = {
  event: {
    title: 'test',
    description: 'test',
    shortDescription: 'test',
  },
}

const RED_TestData = {
  event: {
    title: 'test',
    description: 'test',
  },
}

it('SHOULD return true as test data meets the provided rules', () => {
  expect(validate(GREEN_TestData, rules).error).toBeUndefined()
})

it('SHOULD return true as test data meets the provided rules', () => {
  expect(
    validate({ ...GREEN_TestData, event_eventLocation: 'Home' }, rules).error
  ).toBeUndefined()
})

it("SHOULD return false as test data doesn't pass the provided rules", () => {
  expect(validate(RED_TestData, rules).error).toEqual({
    step: 'event',
    message: 'Please complete all required fields.',
  })
})

it("SHOULD return false as test data doesn't pass the provided rules", () => {
  expect(
    validate({ ...RED_TestData, event_shortDescription: '' }, rules).error
  ).toEqual({ step: 'event', message: 'Please complete all required fields.' })
})

it("SHOULD return false as test data doesn't pass the provided rules", () => {
  expect(validate({ ...GREEN_TestData, event_title: '' }, rules).error).toEqual(
    {
      step: 'event',
      message: 'Please complete all required fields.',
    }
  )
})
