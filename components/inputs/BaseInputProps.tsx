export interface BaseInputProps<T = any> {
  /**
   * The label for the input.
   */
  label?: string
  /**
   * The placeholder text for the input.
   */
  placeholder?: string
  /**
   * Class name to apply to the outer wrapper.
   */
  className?: string
  /**
   * The value of the input.
   */
  value?: T
  /**
   * Callback with value when the input value changes.
   */
  onChange?: (value: T, isInvalid?: boolean | undefined) => void
  /**
   * Input required for form submission
   */
  required?: boolean
  /**
   * Show hint next to input label
   */
  hint?: string
  /**
   * Validation rules for the input
   */
  validations?: Validations
  filterDate?: (date: Date) => boolean
  filterTime?: (date: Date) => boolean
  disabled?: boolean
  testid?: string
  show?: boolean
  labelBgColour?: string
  textColour?: string
  border?: string
  isProtected?: boolean
  tooltip?: string
}

export type Validations = {
  minLength?: {
    value: number
    message: string
  }
  maxLength?: {
    value: number
    message: string
  }
  pattern?: {
    value: RegExp
    message: string
  }
  isURL?: boolean
}
