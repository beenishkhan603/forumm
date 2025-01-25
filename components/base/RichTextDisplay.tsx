import React from 'react'
import { EditorState, convertFromRaw, ContentState } from 'draft-js'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

const RichTextDisplay: React.FC<{ descriptionJson: string }> = ({
  descriptionJson,
}) => {
  let editorState

  const isJson =
    descriptionJson &&
    typeof descriptionJson === 'string' &&
    descriptionJson.startsWith('{') &&
    descriptionJson.endsWith('}')
  if (!isJson) return <span>{descriptionJson}</span>

  try {
    const parsedJson = JSON.parse(descriptionJson)
    const contentState = convertFromRaw(parsedJson)
    editorState = EditorState.createWithContent(contentState)
  } catch (e) {
    console.error('Error creating editor state from descriptionJson', e)
    const contentState = ContentState.createFromText('Error displaying content')
    editorState = EditorState.createWithContent(contentState)
  }

  const customWrapperStyle = {
    margin: 0,
    padding: 0,
    border: 'none',
  }

  return (
    <Editor
      editorState={editorState}
      readOnly={true}
      toolbarHidden={true}
      wrapperStyle={customWrapperStyle}
    />
  )
}

export default RichTextDisplay
