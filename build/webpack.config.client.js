const path = require('path')
const HTMLPlugin=require('html-webpack-plugin')
const webpack=require('webpack')

/*-----合并webpack配置----*/
const webpackMerge = require('webpack-merge')
const webpackBase = require('./webpack.base')
/*根据输入的指令，判断webpack是否属于开发环境*/
const isDev=process.env.NODE_ENV === 'development';

const config = webpackMerge(webpackBase, {
	/*文件入口*/
	entry:{
		app:path.join(__dirname,'../client/views/app.js')
	},

	/*打包文件输出位置*/
	output:{
		filename:'[name].[hash].js',
	},

	devtool:'cheap-module-eval-source-map',

	plugins:[
		new HTMLPlugin({
			template:path.join(__dirname,'../client/views/template.html')
		}),
		new HTMLPlugin({
			template:'!!ejs-compiled-loader!'+path.join(__dirname,'../client/views/server-template.ejs'),
			filename: "server.ejs"
		}),

		new webpack.HotModuleReplacementPlugin()
	]
})


/*对不同的环境进行判断，如果为开发环境则进行如下配置*/

if(isDev){
	config.devtool = '#cheap-module-eval-source-map'
	config.entry = {
		app:[
			// 'react-hot-loader/patch',
			path.join(__dirname,'../client/views/app.js')
		]
	};
/*--webpack-dev-server自带服务器配置*/
	config.devServer = {
		host:'0.0.0.0',
		port:'8888',
		contentBase:path.join(__dirname,'../dist'),
		// hot:true,
		inline:true,
		/*出错时提醒方式*/
		overlay:{
			errors:true
		},

		publicPath:'/public/',
		historyApiFallback:{
			index:'/public/index.html'
		},

		proxy: {
			'/api': 'http://localhost:3330'
		}
	}
}

module.exports = config;