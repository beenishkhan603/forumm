import { graphql } from "@graphql/__generated";

export const UPLOAD_MEDIA = graphql(`
  mutation UploadMedia($input: MediaUploadInput!) {
    uploadMedia(input: $input) {
      preSignedUrl
      uploadedFileUrl
    }
  }
`);
