import { useMutation } from '@apollo/client'
import { UPLOAD_MEDIA } from '@graphql/media/uploadMedia'
import { v4 } from 'uuid'

const useFileUploader = () => {
  const [uploadMedia] = useMutation(UPLOAD_MEDIA)

  const generateSafeFileName = (name: string) => {
    return v4()
  }

  const uploadFile = async (file: File) => {
    const response = await uploadMedia({
      variables: {
        input: {
          contentType: 'application/x-www-form-urlencoded',
          filename: generateSafeFileName(file.name),
        },
      },
    })
    const preSignedUrl = response.data?.uploadMedia.preSignedUrl
    const uploadedFileUrl = response.data?.uploadMedia.uploadedFileUrl

    await fetch(preSignedUrl!, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    return uploadedFileUrl ?? ''
  }

  return uploadFile
}

export default useFileUploader
