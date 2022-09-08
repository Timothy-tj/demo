<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片 -->
		<el-card>
			<!-- 提示 -->
			<el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条 ; active接收number类型 -->
            <el-steps :active="activeIndex-0" finish-status="success" align-center :space="200">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="100px" >
                <!-- 标签页 ； activeIndex为string -->
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model.number="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model.number="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model.number="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model.number="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" >
                            <!-- 级联选择器 ； 深浅拷贝 ；addForm.goods_cat-->
                             <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cascaderProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="(value,i) in item.attr_vals" :key="i" label="value" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="upLoadUrl"
                            :headers="headerObj"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                            </el-upload>
                        </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce" />
                        <el-button type="primary" class="btn-add" @click="addGoods()">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
		</el-card>

        <!-- 图片预览对话框 -->
        <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%"
        >
            <img :src="previewPath" width="100%">
        </el-dialog>
	</div>
</template>

<script>
// 引入lodash实现深拷贝
import _ from 'lodash'

export default {
    data() {
        return {
            activeIndex:'0',
            addForm:{
                goods_name:'',
                goods_price:null,
                goods_weight:null,
                goods_number:null,
                goods_cat:[],
                pics:[],
                // 商品内容
                goods_introduce:'',
                // 商品参数数据
                attrs:[]
            },
            addFormRules:{
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
            },
            cateList:[],
            cascaderProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger:'hover'
            },
            manyData:[],
            onlyData:[],
            // 上传图片地址
            upLoadUrl:'http://www.tangxiaoyang.vip:8888/api/v2/upload',
            // 请求头属性
            headerObj:{
                Authorization: JSON.parse(sessionStorage.getItem('userInfo')).token
            },
            previewVisible:false,
            previewPath:'',
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200){
                return this.$message.error('获取失败')
            }
            this.cateList = res.data
            // this.$message.success('获取信息成功')
        },
        handleChange(){
            // 强制级联选择到第三个
            if(this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat = []
            }
        },
        // 标签页切换之前触发
        beforeTabLeave(activeName, oldActiveName){
            if(this.addForm.goods_cat.length !== 3){
                this.$message.error('请先选择分类')
                return false
            }
        },
        // tabs被点击时执行
        async tabClicked(){
            // 判断动态参数or 静态属性
            if(this.activeIndex == '1'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel: 'many'
                    }
                })
                if(res.meta.status !== 200){
                    return this.$message.error('获取动态参数失败')
                }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                })
                this.manyData = res.data
            }else if(this.activeIndex == '2'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel: 'only'
                    }
                })
                if(res.meta.status !== 200){
                    return this.$message.error('获取静态参数失败')
                }
                this.onlyData = res.data    
            }
        },
        // 预览图片的回调
        handlePreview(file){
            this.previewPath = file.url
            this.previewVisible = true
        },
        // 移除图片回调
        handleRemove(file){
            // console.log(file);
            // 1.获取临时路径
            const filePath = file.response.data.tmp_path
            // 2.picsp[]中找到图片对应的索引值
            const i = this.addForm.pics.findIndex(item => {
                item.pic === filePath
            })
            // 3.删除  ;  从i开始移除一个
            this.addForm.pics.splice(i,1)
        },
        // 图片上传成功 ; 数组里放对象
        handleSuccess(res){
            this.addForm.pics.push({
                pic: res.data.tmp_path
            })
        },
        addGoods(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                /**
                 * 发送请求前准备的数据addForm数据处理
                 */
                // 1.处理商品分类所属分类数组
                // this.addForm.goods_cat = this.addForm.goods_cat.join(',')    //修改成字符串了，导致级联选择器的goods_cat异常
                // 处理方法：定义一个新的addForm对象
                // const form = this.addForm        //浅拷贝,本质同一个对象，只是指针改变，实际未变
                // 使用lodash工具(Js库)的实现深拷贝，安装
                const form = _.cloneDeep(this.addForm)      //深拷贝（内容一样）
                form.goods_cat = form.goods_cat.join(',')
                
                // 2.处理动态参数
                this.manyData.forEach(item => {
                    form.attrs.push({
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    })
                })

                // 3.处理静态属性
                this.onlyData.forEach(item => {
                    form.attrs.push({
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    })
                })

                // 发送请求 ; 传深拷贝后的Form对象
                const {data:res} = await this.$http.post('goods',form)
                if(res.meta.status !== 201){
                    return this.$message.error('添加商品失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        }
    },

    computed: {
        cateId(){
            return this.addForm.goods_cat.length !== 3 ? this.addForm.goods_cat[2] : null
        }
    },
}
</script>

<style lang="less" scoped>
.el-checkbox{
    margin-right: 10px;
}
.btn-add{
    margin-top: 15px;
}
</style>