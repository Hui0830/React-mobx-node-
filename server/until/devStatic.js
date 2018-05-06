/*-----------ajax请求库-----------------*/
const axios = require('axios')

const webpack = require('webpack')
const path = require('path')

/*-----------虚拟磁盘-----------------*/
const memoryFs = require('memory-fs')

/*-----------跨域http请求代理-----------------*/
const proxy = require('http-proxy-middleware')

const serverRender = require('./server-render')

const serverConfig = require('../../build/webpack.config.server')


/*---获取HTML模板-----*/
const getTemplate = () => {
	return new Promise((resolve,reject) => {
		axios.get('http://localhost:8888/public/server.ejs')
		.then(res => {
			resolve(res.data)
		})
		.catch(reject)
	})
}


const NativeModule = require('module');
const vm = require ('vm');
const getMouduleFromString = (bundle, filename) => {
	const m = { exports: {} }
	const wrapper = NativeModule.wrap(bundle)
	const script = new vm.Script(wrapper, {
		filename:filename,
		displayErrors: true,
	})
	const result = script.runInThisContext()

	result.call(m.exports, m.exports, require, m)
	return m
}


const mfs = new memoryFs(); //创建虚拟磁盘

/*----webpack中Node的API-----*/
const serverCompiler = webpack(serverConfig);
/*--------让webpack输出文件放置虚拟磁盘，提高访问速度------------*/
serverCompiler.outputFileSystem = mfs;

let serverBundle = () => {} ;

/*----执行并监听webpack打包------*/
serverCompiler.watch({},(err,stats) => {
	if (err) throw err
	stats = stats.toJson();
	stats.errors.forEach(err => console.log(err));
	stats.warnings.forEach(warn => console.log(warn));

	const bundlePath = path.join(serverConfig.output.path,serverConfig.output.filename);

	const bundle = mfs.readFileSync(bundlePath,'utf-8');
	const m = getMouduleFromString(bundle, 'server-entry.js')
	serverBundle = m.exports
	console.log(m.exports)

})


/*---导出开发环境配置---*/
module.exports = function (app){

	app.use('/public',proxy({
		target:'http://localhost:8888'
	}));

	app.get('*',function (req,res, next){
		if (!serverBundle) {
			return res.send(console.log("waiting for webpack compiler, refresh later"))
		}
		getTemplate().then(template => { 

			return serverRender(serverBundle, template, req, res)

		}).catch(next)
	})
}