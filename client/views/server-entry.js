import App from './App.jsx'
import React from 'react'
import marked from 'marked'

/*服务端路由*/
import { StaticRouter } from 'react-router-dom'

import { Provider, useStaticRendering } from 'mobx-react'

import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'

import { createStoreMap } from '../store/store'
/*让mobx在服务端渲染的时候不会重复数据交换*/
useStaticRendering(true)

/*因为服务端渲染需要处理不同的页面请求，所以store需要根据不同需求处理*/
export default  (stores, routerContext, sheetsRegistry, jss, theme, url) => {
	return (
		<Provider {...stores} >
			<StaticRouter context = {routerContext} location={url} >
				<JssProvider registry={sheetsRegistry} jss={jss}>
					<MuiThemeProvider theme={theme}>
						<App />
					</MuiThemeProvider>
				</JssProvider>
			</StaticRouter>
		</Provider>
	)
}
	
export { createStoreMap }