const router =require('express').Router()
const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
	axios.post(`${baseUrl}/accesstoken`, {
		accesstoken: req.body.accessToken
	}).then(resq => {

	if(resq.status === 200 && resq.data.success) {

		req.session.uesr = {
			accessToken: req.body.accessToken,
			loginName: resq.data.loginName,
			id: resq.data.id,
			avatarUrl: resq.data.avatar_url
		}

		res.json({
			success: true,
			data: resq.data
		})
	}
})
.catch(err => {
	if (err.response) {
		res.json({
			success: false,
			data: err.response.data
		})
	}else {
		next(err)
	}
  })
})
module.exports = router