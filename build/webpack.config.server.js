const path=require('path')
const webpack = require('webpack')
/*-----合并webpack配置----*/
const webpackMerge = require('webpack-merge')
const webpackBase = require('./webpack.base')

module.exports= webpackMerge ( webpackBase, {
	target:"node",
	/*入口*/
	entry:{
		app:path.join(__dirname,'../client/views/server-entry.js')
	},
	externals: Object.keys(require('../package').dependencies),//指定的这些包不打包到最终的js里面
	/*打包输出位置*/
	output:{
		filename:'server-entry.js',
		/*打包出的模块规范*/
		libraryTarget:'commonjs2'
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.API_BASE': '"http://127.0.0.1:3000"'
		})
	]
})