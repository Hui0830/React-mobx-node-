/*----------------react-dom/server服务端渲染API--------------------*/
const reactDomServer = require('react-dom/server')

/*异步包*/
const asyncBootstrap = require('react-async-bootstrapper')

/*----ejs-------*/
const ejs = require('ejs')

/*----序列化js对象为string------*/
const serialize = require('serialize-javascript')

/*-----需要加载页面前就将SEO相关渲染出来-----*/
const Helmet = require('react-helmet').default

/*-----------material-ui样式服务端渲染---------------*/
const SheetsRegistry = require('react-jss/lib/jss').SheetsRegistry
const create = require('jss').create
const preset =require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default
const colors = require('material-ui/colors')


console.log(new SheetsRegistry())
const getStoreState = (stores) => {
	return Object.keys(stores).reduce((result, storeName) => {
		result[storeName] = stores[storeName].toJson;
		return result;
	},{})
}

module.exports = (bundle, template, req, res) => {

	return new Promise((resolve, reject) => {

		 console.log(bundle.createStoreMap)
		if (!bundle.createStoreMap) {
			const createStoreMap = () => {}
		}
		const createStoreMap = bundle.createStoreMap;
		const createApp = bundle.default;

		const routerContext = {};
		const stores = createStoreMap();
		const sheetsRegistry = new SheetsRegistry();
		const jss = create(preset());
		jss.options.createGenerateClassName = createGenerateClassName;
		const theme = createMuiTheme ({
			palette: {
				primary: colors.lightBlue,
				accent: colors.pink,
				type: "light"
			}
		});

		const app = createApp(stores,routerContext,sheetsRegistry,jss,theme,req.url);

		asyncBootstrap(app).then(() => {
			if (routerContext.url) {
				res.status(304).setHeader('Location', routerContext.url)
				res.end()
				return
			}
			const helmet = Helmet.rewind();

			const state =getStoreState(stores);

			// console.log(stores.appState.count);
			const contend = reactDomServer.renderToString(app);
		
		
			// res.send(template.replace('<!-- app -->',contend));
			const html = ejs.render(template, {
				appString: contend,
				initialState: serialize(state),
				meta: helmet.meta.toString(),
				title: helmet.title.toString(),
				materialCss: sheetsRegistry.toString(),
			});
			res.send(html);
			resolve()
		}).catch(reject)
	})
}