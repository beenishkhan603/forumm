import React, { useState, useEffect, useRef } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { validate } from './Validations'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'
import { BaseInputProps } from './BaseInputProps'
import Resizeable from '@libs/Utility/resizeable'
import Tooltip from '@components/tootilp/Tooltip'

const DynamicEditor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

const RichTextEditor: React.FC<BaseInputProps> = ({
  label,
  placeholder,
  className,
  validations,
  required,
  hint,
  testid,
  onChange,
  value,
  show = true,
  textColour,
  labelBgColour,
  tooltip,
}) => {
  const { theme } = useTheme()
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )
  const [error, setError] = useState('')

  const [showTooltip, setShowTooltip] = useState(true)
  useEffect(() => {
    // Autohide tooltip if the input is not required.
    if (tooltip?.toLowerCase().includes('require') && !required)
      setShowTooltip(false)
  }, [tooltip, required])

  const backgroundColour = theme.editorBackgroundColour

  useEffect(() => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      try {
        const rawContentFromProps = JSON.parse(value)
        const contentState = convertFromRaw(rawContentFromProps)
        setEditorState(EditorState.createWithContent(contentState))
      } catch (error) {
        console.error(
          'Error to convert the initial value to EditorState: ',
          error
        )
      }
    }
  }, [])

  if (!show) return <></>

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState)

    const plainText = newEditorState.getCurrentContent().getPlainText('')

    const errorMessage = validate(plainText, validations)

    setError(errorMessage)

    if (!errorMessage) {
      const rawContentState = convertToRaw(newEditorState.getCurrentContent())
      const jsonString = JSON.stringify(rawContentState)

      if (onChange) {
        onChange(jsonString)
      }
    }
  }

  const isDarkTheme = theme.type === 'DARK'

  return (
    <label
      className={['flex flex-col my-4', className].join(' ')}
      style={{ color: textColour }}
    >
      {label && (
        <span
          className={`absolute text-sm mb-2 ml-2 z-10 ${backgroundColour} ${
            required ? 'pl-2' : 'px-2'
          } transition-all ${error ? 'text-red-500' : ''}`}
          style={{
            background: backgroundColour,
            transform: 'translateY(-50%)',
          }}
        >
          <Tooltip
            show={showTooltip}
            tooltip={tooltip}
            className={`flex flex-col`}
          >
            <span
              className={`z-10 ${
                required
                  ? "after:content-['*'] after:mx-2 after:text-red-500"
                  : ''
              }`}
            >
              {label}
            </span>
          </Tooltip>
        </span>
      )}
      {typeof window === 'object' && (
        <Resizeable initalSize={{ height: 200 }}>
          <DynamicEditor
            spellCheck
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName="size-full flex flex-col !box-border"
            editorClassName={`editor-class ${
              error ? 'text-red-500 border-red-500' : ''
            }`}
            toolbarClassName={`flex flex-wrap justify-center gap-2 p-2 border-b border-gray-300 ${
              isDarkTheme ? 'text-blue-700 ' : 'text-black'
            }`}
            toolbar={{
              options: ['inline', 'list', 'textAlign', 'remove', 'history'],
              inline: {
                options: [
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  'monospace',
                  'superscript',
                  'subscript',
                ],
                bold: {},
                italic: {},
                underline: {},
                strikethrough: {},
                monospace: {},
                superscript: {},
                subscript: {},
              },
              list: {
                options: ['unordered', 'ordered'],
                unordered: {},
                ordered: {},
              },
              textAlign: {
                options: ['left', 'center', 'right'],
                left: {},
                center: {},
                right: {},
              },

              remove: {},
              history: {
                options: ['undo', 'redo'],
                undo: {},
                redo: {},
              },
            }}
            placeholder={placeholder}
            data-testid={testid ?? undefined}
          />
        </Resizeable>
      )}
      {hint && <span className="mt-1 mb-4 text-xs">{hint}</span>}
      <Box
        ignoreTheme
        className={`mt-1 transition-all ${
          error ? 'opacity-100 text-red-500' : 'opacity-0'
        }`}
      >
        {error || '-'}
      </Box>
    </label>
  )
}

export default RichTextEditor
