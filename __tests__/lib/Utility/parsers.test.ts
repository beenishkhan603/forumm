import {
  getFileTypeFromS3URL,
  getVimeoVideoId,
  getYoutubeVideoId,
  isYoutubeUrl,
  parseHoldingVideoURL,
} from '@libs/Utility/parsers'

export interface TestData {
  testCase: string | undefined | null
  expected: string | number | undefined | null
}

describe('Utility > Parsers', () => {
  it('SHOULD return correct true/false for each URL senario', () => {
    const input = [
      'http://www.yotube.com/watch?v=VIDEO_ID',
      'http://youtue.com/watch?v=VIDEO_ID',
      'https://www.youube.com/watch?v=VIDEO_ID',
      'https://outube.com/watch?v=VIDEO_ID',
      'www.youtue.com/watch?v=VIDEO_ID',
      'youtub.com/watch?v=VIDEO_ID',
      'https://youtu.b/VIDEO_ID',
      'http://youtu.e/VIDEO_ID',
      'yutu.be/VIDEO_ID',
      'http://www.youtube.com/watch?v=VIDEO_ID',
      'http://youtube.com/watch?v=VIDEO_ID',
      'https://www.youtube.com/watch?v=VIDEO_ID',
      'https://youtube.com/watch?v=VIDEO_ID',
      'www.youtube.com/watch?v=VIDEO_ID',
      'youtube.com/watch?v=VIDEO_ID',
      'https://youtu.be/VIDEO_ID',
      'http://youtu.be/VIDEO_ID',
      'youtu.be/VIDEO_ID',
      undefined,
      null,
      '',
      'https://www.youtube.com/embed/PyohMzdKnnY?si=Q4gtwtneQc_6e42q',
      'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/fda5515b-791f-4102-a345-06a061f44f9b.mov',
      'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/2264684_1.jpg',
    ]

    const expectedOutput = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
    ]

    const output: boolean[] = []

    input.forEach((url) => output.push(isYoutubeUrl(url as string)))

    expect(output).toEqual(expectedOutput)
  })

  it('Should return VIDEO_ID for each valid Youtube url provided.', () => {
    const data: TestData[] = [
      {
        testCase: 'http://www.youtube.com/watch?v=Kv9C9ZVdeM8',
        expected: 'Kv9C9ZVdeM8',
      },
      {
        testCase: 'http://www.youtube.com/watch?v=-wtIMTCHWuI',
        expected: '-wtIMTCHWuI',
      },
      {
        testCase:
          'https://m.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index',
        expected: '0zM3nApSvMg',
      },

      {
        testCase: 'http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s',
        expected: '0zM3nApSvMg',
      },

      {
        testCase: 'http://youtube.com/watch?v=0zM3nApSvMg',
        expected: '0zM3nApSvMg',
      },

      {
        testCase:
          'http://www.youtube.com/watch?v=lalOy8Mbfdc&playnext_from=TL&videos=osPknwzXEas&feature=sub',
        expected: 'lalOy8Mbfdc',
      },

      {
        testCase:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player',
        expected: 'dQw4w9WgXcQ',
      },

      {
        testCase:
          'http://www.youtube.com/watch?v=ishbTyLs6ps&list=PLGup6kBfcU7Le5laEaCLgTKtlDcxMqGxZ&index=106&shuffle=2655',
        expected: 'ishbTyLs6ps',
      },

      {
        testCase: 'https://m.youtube.com/watch?app=desktop&v=dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ',
      },

      {
        testCase: 'https://m.youtube.com/v/-wtIMTCHWuI?version=3&autohide=1',
        expected: '-wtIMTCHWuI',
      },

      {
        testCase:
          'http://youtube.com/v/dQw4w9WgXcQ?feature=youtube_gdata_player',
        expected: 'dQw4w9WgXcQ',
      },

      {
        testCase: 'https://youtu.be/-wtIMTCHWuI',
        expected: '-wtIMTCHWuI',
      },

      // {
      //   testCase:
      //     'http://www.youtube.com/oembed?url=http%3A//www.youtube.com/watch?v%3D-wtIMTCHWuI&format=json',
      //   expected: '-wtIMTCHWuI',
      // },

      // {
      //   testCase:
      //     'http://www.youtube.com/attribution_link?a=JdfC0C9V6ZI&u=%2Fwatch%3Fv%3DEhxJLojIE_o%26feature%3Dshare',
      //   expected: 'EhxJLojIE_o',
      // },

      // {
      //   testCase:
      //     'https://m.youtube.com/attribution_link?a=8g8kPrPIi-ecwIsS&u=/watch%3Fv%3DyZv2daTWRZU%26feature%3Dem-uploademail',
      //   expected: 'yZv2daTWRZU%',
      // },

      {
        testCase: 'https://m.youtube.com/embed/lalOy8Mbfdc',
        expected: 'lalOy8Mbfdc',
      },

      {
        testCase: 'https://m.youtube.com/embed/nas1rJpm7wY?rel=0',
        expected: 'nas1rJpm7wY',
      },

      {
        testCase: 'https://www.youtube-nocookie.com/embed/lalOy8Mbfdc?rel=0',
        expected: 'lalOy8Mbfdc',
      },

      {
        testCase: 'http://www.youtube.com/e/dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ',
      },

      {
        testCase: 'http://youtue.com/watch?v=Vcvdb1J2t34',
        expected: 'Vcvdb1J2t34',
      },
      {
        testCase: 'https://www.youube.com/watch?v=hpwpVAicXCk',
        expected: 'hpwpVAicXCk',
      },
      {
        testCase: 'https://outube.com/watch?v=VIDEO_ID::1',
        expected: 'VIDEO_ID::1',
      },
      {
        testCase: 'www.youtue.com/watch?v=VIDEO_ID::2',
        expected: 'VIDEO_ID::2',
      },
      {
        testCase: 'youtub.com/watch?v=VIDEO_ID::3',
        expected: 'VIDEO_ID::3',
      },
      {
        testCase: 'https://youtu.b/VIDEO_ID::4',
        expected: '',
      },
      {
        testCase: 'http://youtu.e/VIDEO_ID::5',
        expected: '',
      },
      {
        testCase: 'yutu.be/VIDEO_ID::6',
        expected: '',
      },
      {
        testCase: 'http://www.youtube.com/watch?v=VIDEO_ID::7',
        expected: 'VIDEO_ID::7',
      },
      {
        testCase: 'http://youtube.com/watch?v=VIDEO_ID::8',
        expected: 'VIDEO_ID::8',
      },
      {
        testCase: 'https://www.youtube.com/watch?v=VIDEO_ID::9',
        expected: 'VIDEO_ID::9',
      },
      {
        testCase: 'https://youtube.com/watch?v=VIDEO_ID:10',
        expected: 'VIDEO_ID:10',
      },
      {
        testCase: 'www.youtube.com/watch?v=VIDEO_ID:11',
        expected: 'VIDEO_ID:11',
      },
      {
        testCase: 'youtube.com/watch?v=VIDEO_ID:12',
        expected: 'VIDEO_ID:12',
      },
      {
        testCase: 'https://youtu.be/VIDEO_ID:13',
        expected: 'VIDEO_ID:13',
      },
      {
        testCase: 'http://youtu.be/VIDEO_ID:14',
        expected: 'VIDEO_ID:14',
      },
      {
        testCase: 'youtu.be/VIDEO_ID:15',
        expected: 'VIDEO_ID:15',
      },
      {
        testCase: 'https://youtu.be/PyohMzdKnnY',
        expected: 'PyohMzdKnnY',
      },
      {
        testCase: undefined,
        expected: '',
      },
      {
        testCase: null,
        expected: '',
      },
      {
        testCase: '',
        expected: '',
      },
      {
        testCase:
          'https://www.youtube.com/embed/PyohMzdKnnY?si=Q4gtwtneQc_6e42q',
        expected: 'PyohMzdKnnY',
      },
    ]

    data.forEach(({ testCase, expected }) => {
      expect(getYoutubeVideoId(testCase as string)).toEqual(expected)
    })
  })

  it('Should return VIDEO_ID for each valid Vimeo url provided.', () => {
    const data: TestData[] = [
      {
        testCase: 'https://vimeo.com/624953317',
        expected: '624953317',
      },
      {
        testCase: 'https://www.vimeo.com/624953317',
        expected: '624953317',
      },
      {
        testCase: 'http://vimeo.com/624953317',
        expected: '624953317',
      },
      {
        testCase: 'www.vimeo.com/624953317',
        expected: '624953317',
      },
      {
        testCase: 'vimeo.com/624953317',
        expected: '624953317',
      },
      {
        testCase: 'vimeo.com/5',
        expected: '5',
      },
      {
        testCase: 'https://vimeo.com/',
        expected: '',
      },
      {
        testCase: '',
        expected: '',
      },
      {
        testCase: undefined,
        expected: '',
      },
      {
        testCase:
          'https://www.youtube.com/embed/PyohMzdKnnY?si=Q4gtwtneQc_6e42q',
        expected: '',
      },
    ]

    data.forEach(({ testCase, expected }) => {
      expect(getVimeoVideoId(testCase as string)).toEqual(expected)
    })
  })

  it('SHOULD return correct file type for all S3 URLs', () => {
    const testURlPrefix =
      'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/'
    const data: TestData[] = [
      { testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.txt', expected: 'TXT' },
      {
        testCase: 'asdgidkdke12kk2jdickdksjis-3iekfdsak.docx',
        expected: 'DOCX',
      },
      { testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.csv', expected: 'CSV' },
      { testCase: 'test.doc', expected: 'DOC' },
      {
        testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.webp',
        expected: 'WEBP',
      },
      { testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.gif', expected: 'GIF' },
      { testCase: 'test.tif', expected: 'TIF' },
      { testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.bmp', expected: 'BMP' },
      { testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.mp3', expected: 'MP3' },
      { testCase: 'test ing.wma', expected: 'WMA' },
      { testCase: '1234.wav', expected: 'WAV' },
      { testCase: 'test_file_name.avi', expected: 'AVI' },
      { testCase: '26468558468459654975452466754894_8.zip', expected: 'ZIP' },
      { testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.pdf', expected: 'PDF' },
      {
        testCase: 'fda5515b-791f-4102-a345-06a061f44f9b.mov',
        expected: 'MOV',
      },
      {
        testCase: '22646asdfasrfteaadf__84_8.mp4',
        expected: 'MP4',
      },
      {
        testCase: '2264684_1.jpg',
        expected: 'JPEG',
      },
      {
        testCase: '26468558468459654975452466754894_8.png',
        expected: 'PNG',
      },
      {
        testCase: '22646855846845965497545254894_6.test',
        expected: 'Unhandled file type: .test',
      },
    ]

    data.forEach(({ testCase, expected }) => {
      expect(getFileTypeFromS3URL(`${testURlPrefix}${testCase}`)).toEqual(
        expected
      )
    })
  })
})
