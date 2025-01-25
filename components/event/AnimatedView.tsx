import { motion } from 'framer-motion'

export default function AnimatedView({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={`flex-1 overflow-y-scroll outline-red-500 scrollbar-hide relative flex flex-col ${className}`}
      onClick={() => onClick?.()}
    >
      {children}
    </motion.div>
  )
}
