const environment = process.env.ENVIRONMENT_NAME ?? 'dev'
const isDev = environment === 'dev'

console.log(`isDevelopment : ${isDev}`)
const version = process.env.BUILD_VERSION ?? 'Development'
console.log(`BUILD VERSION: ${version}`)

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false,
  webpack(config, options) {
    const { isServer } = options
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g|webm)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('file-loader'),
          options: {
            publicPath: isDev
              ? `http://localhost:3000/_next/static/images/`
              : `https://images-${environment}.forumm.to/${version}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    })

    return config
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  assetPrefix: isDev
    ? undefined
    : `https://images-${environment}.forumm.to/${version}`,
  images: {
    unoptimized: true,
  },
  compress: false,
  headers: async () => [
    {
      source: '/.well-known/apple-developer-merchantid-domain-association',
      headers: [
        {
          key: 'Content-Type',
          value: 'text/plain',
        },
        {
          key: 'Content-Transfer-Encoding',
          value: 'base64',
        },
      ],
    },
  ],
  /*redirects: async () => [
    {
      source: '/',
      has: [
        {
          type: 'header',
          key: 'authorization',
        },
      ],
      permanent: false,
      destination: '/dashboard',
    },
  ],*/
}

module.exports = nextConfig
