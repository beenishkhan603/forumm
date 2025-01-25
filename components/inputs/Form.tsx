import Box from '@components/base/Box'
import Accordion from '@components/event/Accordion'
import { TextInput } from '@components/inputs/TextInput'
import { isArray } from 'lodash'
import React, {
  cloneElement,
  createElement,
  JSXElementConstructor,
  useEffect,
  useState,
} from 'react'
import voca from 'voca'
import { BaseInputProps } from './BaseInputProps'
import { ColorPicker } from './ColorPicker'
import { DateTimeInput } from './DateTimeInput'
import { DropdownInput } from './DropdownInput'
import { FileInput } from './FileInput'
import { PriceInput } from './PriceInput'
import { TextAreaInput } from './TextAreaInput'

interface FormProps {
  children: React.ReactElement[]
  onSubmit?: (e: { [label: string]: any }) => Promise<string | void>
  initialFormData?: { [label: string]: string }
  clearFormOnSubmit?: boolean
  error?: string
  className?: string
}

const formElements: { [elementName: string]: any } = {
  FileInput: FileInput,
  DateTimeInput: DateTimeInput,
  TextInput: TextInput,
  PriceInput: PriceInput,
  TextAreaInput: TextAreaInput,
  DropdownInput: DropdownInput,
  ColorPicker: ColorPicker,
}

const INPUT_ELEMENTS: string[] = ['CheckboxInput', 'DropdownInput']

const isProtectedInput = (
  element: React.ReactElement<any, string | JSXElementConstructor<any>>
) => {
  // if ((element.type as any).name === 'CheckboxInput') console.log({ element })
  if (element.props?.isProtected) return true
  if ((element.type as JSXElementConstructor<any>)?.name) {
    return INPUT_ELEMENTS.includes(
      (element.type as JSXElementConstructor<any>).name
    )
  }
}

const getFormData = (
  children: React.ReactElement[],
  formData: any,
  setFormData: any,
  initialFormData = {}
) => {
  children.forEach((element, i) => {
    if (element?.props?.children && !isProtectedInput(element)) {
      const { children: childElements } = element.props as {
        children: React.ReactElement[]
      }
      if (childElements) {
        const newChildren = isArray(childElements)
          ? [...childElements]
          : [childElements]

        initialFormData = {
          ...initialFormData,
          ...getFormData(newChildren, formData, setFormData, initialFormData),
        }

        children[i] =
          children[i].type == Accordion ? (
            <Accordion key={i} {...element.props}>
              {newChildren}
            </Accordion>
          ) : (
            <Box key={i} {...element.props}>
              {newChildren}
            </Box>
          )
      }
    } else {
      if (!element?.props?.label) return
      const {
        label,
        required,
        onChange: existingOnChange,
      } = element.props as BaseInputProps
      const camelCaseLabel = voca.camelCase(label)

      if (camelCaseLabel == null || camelCaseLabel === '') {
        children[i] = cloneElement(element, { ...element.props, key: i })
      } else {
        children[i] = cloneElement(element, {
          ...element.props,
          key: i,
          value: formData.hasOwnProperty(camelCaseLabel ?? '')
            ? formData[camelCaseLabel ?? '']?.value
            : undefined,
          onChange: (value: any, invalidData?: boolean) => {
            const isInvalid = [
              required && value === undefined,
              invalidData,
            ].some((val) => val === true)

            setFormData({
              ...formData,
              [camelCaseLabel!]: { value: value, invalid: isInvalid },
            })
            existingOnChange && existingOnChange(value, invalidData)
          },
        })
        initialFormData = {
          ...initialFormData,
          [camelCaseLabel!]: { value: undefined, invalid: required === true },
        }
      }
    }
  })

  return initialFormData
}

/**
 * Primary UI component for Forms
 */
export const Form = ({
  className,
  children,
  onSubmit,
  initialFormData,
  error,
  clearFormOnSubmit = false,
  ...rest
}: FormProps) => {
  let modifiedChildren = [...children]

  const getInitialFormData = () => {
    if (initialFormData) {
      const normalizedFormData = Object.keys(initialFormData).reduce(
        (acc: any, key) => {
          acc[key] = { value: initialFormData[key], invalid: false }
          return acc
        },
        {}
      )
      getFormData(modifiedChildren, normalizedFormData, () => {})
      return normalizedFormData
    } else {
      return getFormData(modifiedChildren, {}, () => {})
    }
  }

  const [formData, setFormData] = useState<{
    [label: string]: {
      value: any
      invalid: boolean
    }
  }>(getInitialFormData())

  useEffect(() => {
    setFormData(getInitialFormData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setErrorMessage(error || '')
  }, [error])

  getFormData(modifiedChildren, formData, setFormData)

  const [errorMessage, setErrorMessage] = useState('')
  const invalidForm = Object.values(formData).some(
    (element) => (element as any).invalid
  )
  return (
    <form
      {...rest}
      className={className ?? ''}
      onSubmit={async (e) => {
        e.preventDefault()
        if (invalidForm) {
          setErrorMessage('One or more fields are invalid or missing')
          return
        }
        if (onSubmit) {
          const formDataValues = Object.entries(formData).reduce(
            (acc, [key, value]) => {
              return { ...acc, [voca.camelCase(key)]: value.value }
            },
            {}
          )

          const errorMessage = await onSubmit(formDataValues)
          if (errorMessage) {
            setErrorMessage(errorMessage)
          }
        }
        if (clearFormOnSubmit) {
          setFormData(getInitialFormData())
        }
      }}
    >
      {modifiedChildren}
      {errorMessage && (
        <Box
          ignoreTheme
          className={`flex justify-center items-center text-center transition-all ${
            errorMessage || invalidForm ? 'opacity-100' : 'opacity-0'
          } text-red-500 text-sm font-bold mb-6 sm:mt-0 md:mt-8`}
        >
          {errorMessage ?? 'One or more fields are invalid'}
        </Box>
      )}
    </form>
  )
}
