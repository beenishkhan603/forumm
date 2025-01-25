const Chart = {
  register({ children, ...rest }: any) {},
}

function ArcElement({ children, ...rest }: any) {
  return <div {...rest}>{children}</div>
}

function Tooltip({ children, ...rest }: any) {
  return <div {...rest}>{children}</div>
}

function Legend({ children, ...rest }: any) {
  return <div {...rest}>{children}</div>
}

export { Chart, ArcElement, Tooltip, Legend }
