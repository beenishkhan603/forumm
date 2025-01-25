// eslint-disable-next-line react/display-name
const svgMock = (input: { className: string; 'data-testid': string }) => (
  <svg className={input.className} data-testid={input['data-testid']}></svg>
)

export default svgMock
