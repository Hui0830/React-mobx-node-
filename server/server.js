const express=require('express')
const fs=require('fs')
const path=require('path')

/*-----处理图标.icon-----*/
const favicon = require('serve-favicon')

const bodyParser = require('body-parser')
const session = require('express-session');

const serverRender = require('./until/server-render')


/*开发环境判断*/
const isDev = process.env.NODE_ENV === 'development'
const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extend: false}))

app.use (session({
	maxAge: 10*60*1000,
	name: 'tid',
	resave: false,
	saveUninitialized: false,
	secret: 'react cnode class'
}))

/*需要在服务器渲染之前处理图标*/
app.use(favicon(path.join(__dirname,"../favicon.ico")));

/*-----请求URL跳转到对应模块处理-----*/
app.use('/api/user', require('./until/hander-login'))
app.use('/api', require('./until/proxy'))


/*可不是开发环境是*/
if(!isDev){
	const serverEntry=require('../dist/server-entry')
	/*默认require出来的是export的整个内容*/
		/*同步读取模板文件，用于插入服务端生成的内容，指定编码，默认为Bufft*/
	const template=fs.readFileSync(path.join(__dirname,"../dist/server.ejs"),'utf8');

	console.log(isDev);

	/*区分请求，什么时候使用静态内容什么时候使用服务端渲染的内容*/
	app.use('/public',express.static(path.join(__dirname,'../dist')));


	console.log(serverEntry);
	app.get('*',function(req,res, next){
		
		serverRender(serverEntry, template, req, res).catch(next)

	});
}else{
	const devStatic = require('./until/devStatic.js');
	devStatic(app)
}

/*express全局处理个模块中的next抛出错误，四个参数必须都写，应为express是根据参数的长度判断错误处理机制的*/
app.use(function(error, req, res, next) {
	console.log(error)
	res.status(500).send(error)
})

app.listen(3330,function(){
	console.log("server is listening in 3333")
});