import { ReactNode } from 'react'

export const Tab = ({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) => {
  return <>{children}</>
}

export const Tabs = ({
  activeTitle,
  children,
  stickyHeader = false,
}: {
  activeTitle: string
  children: (React.ReactElement | false)[]
  stickyHeader?: boolean
}) => {
  const activeTab: ReactNode | null = children
    .filter((c) => c !== false)
    .find((c) => (c as React.ReactElement).props.title === activeTitle)
  return <>{activeTab}</>
}
