export const topicSchema = {
	id: '1',
	author_id: '2',
	tab: 'tab',
	content: 'content',
	title: 'title',
	last_reply_at: 'last_reply_at',
	good: false,
	top: false,
	reply_count: 20,
	visit_count: 23,
	create_at: '2018-4-3',
	is_collect: 'is_collect',
	author: {
		loginname: 'loginname',
		avatar_url: '',

	},
	replies: [],
};

export const tabs = {
	all: '全部',
	share: '分享',
	job: '工作',
	ask: '问答',
	good: '精品',
	dev: '测试',
}


export const replySchema = {
  id: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
  content: '',
  ups: [],
  create_at: '',
  reply_id: null,
  is_uped: false,
}