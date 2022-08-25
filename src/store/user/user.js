export default {
	state: {
		"isLogin" : false,
		"userInfo": {'userName':'游客' ,'photo':'/static/missing-face.png'},
	},
	getters: {
		
	},
	mutations: {
		//设置登入状态
		seIsLogin(state,is) {
			console.log('触发了seIsLogin')
			state.isLogin = is;
		},
		//设置登入信息
		setUser(state,info) {
			console.log('触发了setUser')
			state.userInfo = info;
		},
		//推出登入
		logout(state){
			state.isLogin = false;
			state.userInfo = {'userName':'游客' ,'photo':'/static/missing-face.png'};
		}
	},
	actions: {

	}
}
 