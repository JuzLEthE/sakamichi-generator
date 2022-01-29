const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      // 排除一些包，不会打包进vendor中
      // 左侧为我们在业务中引入的包名， 右侧 为对应库提供给外部引用的名字
      vue: 'Vue',
      'vue-router': 'VueRouter',
      twemoji: 'twemoji'
    },
    plugins: [new BundleAnalyzerPlugin()]
  }
}
