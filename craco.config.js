const CracoLessPlugin = require('craco-less');
const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.join(__dirname, 'src'),
      "~":path.join(__dirname, 'public')
    }
  },

  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#faad14",
              "@link-color":"#faad14"
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};