Page({
	onShow() {
		// this.init()
	},
	async init(){
		const res = await wx.cloud.callFunction({
			name: 'urlhttp',
			data: {
				page: '/pages/index/index',
				query: 'name=2',
				name:'test'
			}
		})
		console.log(res.result)
	}
})