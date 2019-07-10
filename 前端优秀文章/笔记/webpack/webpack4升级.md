1. 升级webpack4
2. 升级babel及[babel-loader](https://www.npmjs.com/package/babel-loader)
3. 升级eslit
4. 由于升级webpack4，所以vue-loader要升级至最新版，导致vue-template-compiler和vue都要升级
5. 升级vue，vue-loader，vue-style-loader，其中新的vue-loader需要引入一个VueLoaderPlugin
   ```js
    // webpack.config.js
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    module.exports = {
      // ...
      plugins: [
        new VueLoaderPlugin()
      ]
    }
   ```
   由于webpack4不再使用extract-text-webpack-plugin，替换为mini-css-extract-plugin，但是它并不能与vue-style-loader共存，因此它俩要根据环境区分
   ```js
    // webpack.config.js
    var MiniCssExtractPlugin = require('mini-css-extract-plugin')
    module.exports = {
      // other options...
      module: {
        rules: [
          // ... other rules omitted
          {
            test: /\.css$/,
            use: [
              process.env.NODE_ENV !== 'production'
                ? 'vue-style-loader'
                : MiniCssExtractPlugin.loader,
              'css-loader'
            ]
          }
        ]
      },
      plugins: [
        // ... Vue Loader plugin omitted
        new MiniCssExtractPlugin({
          filename: 'style.css'
        })
      ]
    }
   ```
6. 新版webpack-dev-middleware中隐藏log信息不能再用quite: ture，而要使用logLevel: 'slient'
7. watchpack(webpack内部使用的一个监听文件变化的库)会对所有监听的文件的最后修改时间加上一个FS_ACCURACY(watchpack内部定义的常量)，因此如果项目内有文件在启动webpack之前很短的时间(FS_ACCURACY)内生成或修改，就会导致webpack在启动后多次rebuild。解决方法有两种：
   a. 延迟webpack的启动
   b. 将webpack内部变量startTime增加FS_ACCURACY, FS_ACCURACY在webpack4中是1000ms，之前版本是10000ms
   ```js
    function TimeFixPlugin (watchOffset = 11000) {
      this.watchOffset = watchOffset
    }
    TimeFixPlugin.prototype.apply = function (compiler) {
      const context = this
      const watch = compiler.watch
      let watching
      compiler.watch = function () {
        watching = watch.apply(this, arguments)
        watching.startTime += context.watchOffset
        return watching
      }
      compiler.hooks.done.tap('time-fix-plugin', stats => {
        if (watching) {
          // watching.startTime -= this.watchOffset
          stats.startTime -= this.watchOffset
        }
      })
    }
   ```
8. 利用SingleEntryPlugin和MultiEntryPlugin实现动态entry，优化开发过程，提高效率
   ```js
    // DynamicEntry.js
    const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
    const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')
    const hotMiddleware = require('webpack-hot-middleware')
    const entryMap = {}
    module.exports = function ({ app, middleware, entry, hot = false, hotOptions = {}, match }) {
      const compiler = middleware.context.compiler
      const existEntry = compiler.options.entry
      const context = compiler.context
      // 设置hot-middleware
      if (hot) {
        hml = hotMiddleware(compiler, hotOptions)
        app.use(hml)
      }
      let handler = (app, key, cb) => {
        app.use(`/${key}.html`, (req, res, next) => {
          cb()
          next()
        })
      }
      if (typeof match === 'function') {
        handler = match
      }
      // 记录已有的entry
      Object.keys(existEntry).forEach(key => {
        entryMap[key] = existEntry[key]
      })
      Object.keys(entry).forEach(key => {
        handler(app, key, () => {
          // 如果此entry已存在则不再重新apply
          if (entryMap[key]) return
          let e = entry[key]
          if (hot) {
            e = ['webpack-hot-middleware/client'].concat(e)
          }
          (Array.isArray(e) ? new MultiEntryPlugin(context, e, key) : new SingleEntryPlugin(context, e, key)).apply(compiler)
          middleware && middleware.invalidate()
          entryMap[key] = entry[key]
          console.log('apply entry:', key)
        })
      })
    }
    /*
	    app为Server实例，比如const app = express()
      middleware为webpack-dev-middleware的实例，比如const middleware = require('webpack-dev-middleware')(compiler, options)，devServer可以在devServer.before的参数中获取到，第二个参数server.middleware获取middleware实例
      entry是所有的入口集合(保证初始webpackconfig中的entry配置中不要有这些入口，否则webpack会处理这些entry，这样就失去动态entry的意义了，但是webpack的entry配置又不能为空，所以需要初始填一个entry，建议填一个很小的js文件)
      hot代表是否开启HMR，为true时会自动引入webpack-hot-middleware，所以如果设置为true就不需要使用者自己引入webpack-hot-middleware了
      hotOptions同webpack-hot-middleware的options
      match是一个方法，如果用的不是express需要自行传入server匹配路由的中间件方法，如上默认是使用express
    */
   ```