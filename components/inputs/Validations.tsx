import { Validations } from './BaseInputProps'
import { isValidUrl } from '../../libs/Utility/parsers'

export const validate = (value: any, validations: Validations | undefined) => {
  if (!!value && value !== '' && validations) {
    const { minLength, maxLength, pattern, isURL } = validations

    if (minLength && value?.length < minLength.value) {
      return minLength.message
    } else if (maxLength && value?.length > maxLength.value) {
      return maxLength.message
    } else if (pattern && !pattern.value.test(value)) {
      return pattern.message
    } else if (isURL && !isValidUrl(value)) {
      return 'Invalid URL'
    }
  }
  return ''
}

// Helper function to validate URL format
/* function isValidURL(string: string): boolean { */
/*   try { */
/*     if (!string.match(/^[a-zA-Z]+:\/\//)) { */
/*       string = 'http://' + string */
/*     } */
/*     new URL(string) */
/*     const regex = */
/*       /^(https?:\/\/)?(([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$)/ */
/*     return regex.test(string) */
/*   } catch (_) { */
/*     return false */
/*   } */
/* } */
