module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        canvas: 'canvas',
      }
    }
    return config
  },
}