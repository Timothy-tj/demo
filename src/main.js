import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

Vue.config.productionTip = false    //阻止显示生产模式的消息

// 导入nprogress进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 全局引入css
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/'   //指定基础路径 ; 全局的 axios 默认值
Vue.prototype.$http = axios     //指定一个http属性指向axios ; $ 是在Vue 所有实例中都可用的属性的一个简单约定。这样做会避免与已被定义的数据、方法、计算属性产生冲突 ; 原型上定义它使其在每个Vue实例中可用
// 请求拦截器 ; 为所有请求头添加token认证传到后端认证
axios.interceptors.request.use( config => {
	// 请求开始时开启进度条
	Nprogress.start()
	const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
	config.headers.Authorization = userInfo ? userInfo.token : '';   //登录时有无userInfo
	return config;
})
// 响应拦截器 ; 响应结束进度条
axios.interceptors.response.use(config => {
	Nprogress.done()
	return config
})

// 全局注册第三方表格组件
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)	//第一个参数(组件别名)

//全局导入工具库中的工具函数
import utils from './libs/utils'  //起个别名为utils
Vue.prototype.$utils = utils	//后续只需 $utils 即可使用

//导入富文本编辑器 
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)

new Vue({
	router,
	render: h => h(App)   //render: function (createElement) { return createElement(App)}; createElement(h) 函数是用来生成 HTML DOM 元素的

}).$mount('#app')
