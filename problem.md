##1、使用mobx observer引发的React Route路由失效##
- 因为mobx针对ComponentDidMount, componentWillUnmount, componentDidUpdate(mixinLifecicleEvents)三个接口进行了修改，同时如果用户没有重写shouldComponentUpdate, 也会优化shouldeComponentUpdate
- 问题产生
	- 因为组件外层封装了observer，而observer又会重写shouldComponentUpdate，shouldComponentUpdate拦截了后续render过程，导致没有触发到后续Route组件的shouldComponentUpdate过程。
- 问题解决
	- 总体解法思路：通过传入props绕过shouldComponentUpdate触发render。
	- 对于Router来说，路由的变化会反应在location的变化，所有将location传入props中，会是不错的绕过shouldComponentUpdate触发render的方式。那获取location的方法目前有两种:
	1. Route如果匹配到路由，会注入location到待渲染组件的props中。所以我们可以直接将组件封装到Route中；
	2. React Router提供了一个Hoc组件withRouter，利用此组件可以将location注入到组件中:
	```
	@observer class App extends React.Component{

		render(){
		return[
			<nav key = "nav">
				<Link to = "/" >首页</Link>
				<Link to = '/detail' >详情页</Link>
			</nav>,
			<Routes key = "router" />,	
			]
		}
	}
	const AppRouter = withRouter (App)
	export default  AppRouter
	```
- 其他
	- react-redux中的connect存在同样的问题


##2 、运行服务端报错

###1. `there are multiple mobx instances active. This might lead to unexpected results.`存在两个mobx实例，
- 问题产生原因
	- 重复打包,使用webpack打包的，打包是没有吧node_modules中安装的库分离出来，导致每一次打包的内容（包括node_modules）都包含在一个bundle.js中，每一次代码更新的时候webpack从新打包编译文件之后，前一份和当前bundle都含有mobx实例
- 解决方案：
	- 在服务端编译配置`	externals: Object.keys(require('../package').dependencies),//指定的这些包不打包到最终的js里面
`，将node_moudles中的库不打包进bundle中，因为在node环境中对于node_modules中安装的包可以使用require直接引用.
	- 引发问题：`Cannot find module 'react'`
	- 解决方案：
	**获取**
	```
	const NativeModule = require('module');
	const vm = require ('vm');
	const getMouduleFromString = (bundle, filename) => {
		const m = { exports: {} }
		//包装可执行代码
		//包装为(function(exports,require,module,__filname,__dirname){...bundle code})
		const wrapper = NativeModule.wrap(bundle)
		//运行包装的JavaScript代码
		const script = new vm.Script(wrapper, {
			filename:filename,
			displayErrors: true,
		})
		//指定js执行环境上下文为当前环境
		const result = script.runInThisContext()
		
		result.call(m.exports, m.exports, require, m)
		return m
	}
	//使用
	const m = getMouduleFromString(bundle, 'server-entry.js')
	serverBundle = m.exports.default;
	```



- 问题产生原因
	- mobx是React框架，每一次数据变换都会引发其他方法的调用，使用服务端渲染得时候如果使用正常的客服端代码，会有BUG：一次渲染导致一些方法（如computer）执行比较多的次数，而且如果改的变量比较多的时候会造成重复引用，重复调用，产生内存溢出
- 解决方案：使用mobx服务端渲染专有工具useStaticRendering（让mobx在服务端渲染的时候不会重复数据交换）