<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>欢迎页</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 数据统计 -->
		<el-row :gutter="10">
			<el-col :span="6">
				<div class="statistics" style="background:#409eff">
					<div class="title">
						<p>用户统计</p>
						<el-tag type="success" size="mini">实时</el-tag>
					</div>
					<div class="num">{{totalUsers}}</div>
					<div class="tip">当前总用户数量</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="statistics" style="background:#E6A23C">
					<div class="title">
						<p>商品统计</p>
						<el-tag type="warning" size="mini">实时</el-tag>
					</div>
					<div class="num">{{totalGoods}}</div>
					<div class="tip">当前总商品数量</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="statistics" style="background:#67C23A">
					<div class="title">
						<p>订单统计</p>
						<el-tag type="warning" size="mini">实时</el-tag>
					</div>
					<div class="num">{{totalOrders}}</div>
					<div class="tip">当前总订单数量</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="statistics" style="background:#909399">
					<div class="title">
						<p>销售统计</p>
						<el-tag type="primary" size="mini">实时</el-tag>
					</div>
					<div class="num">{{totalSales}}</div>
					<div class="tip">当前总销售额</div>
				</div>
			</el-col>
		</el-row>

		<!-- echarts -->
		<div class="echarts-container">
			<el-card id="chart1"></el-card>
			<el-card id="chart2"></el-card>
		</div>
	</div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'

export default {
	data() {
		return {
			totalUsers: 0,
			totalGoods: 0,
			totalOrders: 0,
			orderList: [],	// 存储所有订单
			totalSales: 0	//总销售额
		}
	},
	created() {
		this.getUserList(),
		this.getGoodsList(),
		this.getOrderList()
	},

	methods: {
		async getUserList(){
			const {data:res} = await this.$http.get('users',{
				params:{
					pagenum: 1,
					pagesize: 1
				}
			})
			if(res.meta.status !== 200){
				return this.$message.error('获取用户数据失败')
			}
			this.totalUsers = res.data.total
		},
		async getGoodsList(){
			const {data:res} = await this.$http.get('goods',{
				params:{
					pagenum: 1,
					pagesize: 1
				}
			})
			if(res.meta.status !== 200){
				return this.$message.error('获取商品数据失败')
			}
			this.totalGoods = res.data.total
		},
		async getOrderList(){
			const {data:res} = await this.$http.get('orders')
			if(res.meta.status !== 200){
				return this.$message.error('获取订单数据失败')
			}
			this.totalOrders = res.data.total
			// 计算总销售额
			this.orderList = res.data.goods
			this.orderList.forEach(item => {
				if(item.pay_status === '1'){
					this.totalSales += item.order_price
				}
			})
			// 展示图表
			this.initChart1()
			this.initChart2()
		},
		// 在getOrderList（）内执行
		initChart1(){
			// 创建echarts1实例
			var chart1 = echarts.init(document.getElementById('chart1'))
			// 配置
			var option = {
				title: {
					text: '订单趋势',
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
					},
				},
				xAxis: {
					type: 'category',
					// x轴数据
					data: [], // ['03.20', '03.21'],
				},
				yAxis: {
					type: 'value',
				},
				series: [
					{
						type: 'line',
						smooth: true,
						// y轴数据
						data: [], // [260, 406]
					},
				],
			}
			/**
			 *  对数据进行处理
			 */
			// console.log(this.orderList);
			// 升序排序时间
			this.orderList.sort((a,b) => {
				return a.create_time - b.create_time
			})

			// 获取日期及订单总额
			let data = []
			this.orderList.forEach(item => {
				if(item.pay_status === '1'){
					let key = this.$utils.formatToDate(item.create_time)
					if(!data[key]){
						data[key] = item.order_price
					}else{
						data[key] += item.order_price
					}
				}
			})
			
			//将数据导入option 
			for(var key in data){
				option.xAxis.data.push(key)		//x轴数据
				option.series[0].data.push(data[key])	//y轴数据
			}
			//载入
			chart1.setOption(option)
		},
		initChart2(){
			var chart2 = echarts.init(document.getElementById('chart2'))
			var option = {
				title: {
					text: '订单状态',
				},
				tooltip: {
					trigger: 'item',
					formatter: '{b} : {c} ({d}%)',
				},
				legend: {
					orient: 'vertical',
					left: 'right',
					data: [],
				},
				series: [
					{
						name: '订单状态',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						// data: [
						//     {value: 335, name: '直接访问'},
						//     {value: 310, name: '邮件营销'},
						//     {value: 234, name: '联盟广告'},
						//     {value: 135, name: '视频广告'},
						//     {value: 1548, name: '搜索引擎'}
						// ],
						data: [],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
					},
				],
			}
			/**
			 * 对数据进行处理
			 */
			var data=[
				{
					name:'已付款',
					value: 0
				},
				{
					name:'未付款',
					value: 0
				}
			]
			// 统计付款未付款数量
			this.orderList.forEach(item => {
				if(item.pay_status === '1'){
					data[0].value++
				}else{
					data[1].value++
				}
			})
			// 导入option需要的数据
			for(var item of data){
				option.legend.data.push(item.name)
				option.series[0].data.push(item)
			}

			chart2.setOption(option)
		}

	},
}
</script>

<style lang="less" scoped>
.el-row{
	padding: 0 10px;
	.statistics{
		color: white;
		border-radius: 5px;
		height: 100px;
		padding: 5px 10px;
		.title{
			display: flex;
			height: 20px;
			justify-content: space-between;
			align-items: center;
			.p{
				font-size: 13px;
				font-weight: bold;
			}
		}
		.num{
			font-size: 20px;
			height: 50px;
			line-height: 50px;
			font-weight: bold;
			text-align: center;
		}
		.tip{
			font-size: 12px;
			margin-top: 10px;
		}
	}
}

.echarts-container{
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
	.el-card{
		width: 50%;
		height: 300px;
		padding: 20px;
		margin: 0 8px;
	}
}
</style>
