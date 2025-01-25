const LoadingBar = () => {
  const shimmerStyle = {
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  }

  return (
    <div className="w-full h-2 bg-blue-100 overflow-hidden relative">
      <div
        className="w-full h-full absolute transform translate-x-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        style={shimmerStyle}
      />
    </div>
  )
}

export default LoadingBar
