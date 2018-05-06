const path = require('path')
module.exports = {
	/*文件入口*/
	entry:{
		app:path.join(__dirname,'../client/views/app.js')
	},

	/*打包文件输出位置*/
	output:{
		path:path.join(__dirname,'../dist'),
		/*发布时给输出位置添加前缀用于区分静态资源*/
		publicPath:'/public/'
	},

	resolve: {
		extensions: [".js", ".jsx"]
	},
	module:{
		rules:[
			{
				test:/.jsx$/,
				loaders:['babel-loader']
			},
			{
				test:/.js$/,
				loaders:['babel-loader'],
				exclude:[
					path.join(__dirname,'../node_modules')
				]
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]'
				}
			}
		]
	},
}