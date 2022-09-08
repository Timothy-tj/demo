<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 提示信息 -->
            <el-alert
                title="注意:只允许为第三级分类设置修改参数"
                type="warning"
                show-icon
                :closable="false"
            ></el-alert>
            <!-- 选择商品分类 -->
            <el-row>
                <el-col>
                    <span>选择商品分类:</span>
                    <el-cascader
                        v-model="selectedKeys"
                        :options="cateList"
                        :props="cascaderProps"
                        @change="handleChange"
                        clearable
                    ></el-cascader>
                </el-col>
            </el-row>
            <!-- 标签页 -->
            <el-tabs
                v-model="activeName"
                @tab-click="handleClick"
            >
                <!-- 动态参数 -->
                <el-tab-pane
                    label="动态参数"
                    name="many"
                >
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="btnDisabled"
                        @click="addDialogVisible = true"
                    >添加参数</el-button>
                    <el-table
                        :data="paramsDate"
                        border
                        stripe
                    >
                        <el-table-column
                            label="明细"
                            type="expand"
                        >
                            <template slot-scope="scope">
								<!-- 循环渲染明细 -->
                                <el-tag
                                    v-for="(item,i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClosed(scope.row,i)"
                                >
                                    {{ item }}
                                </el-tag>
								<!-- 新增明细 -->
                                <el-input
                                    class="input-new-tag width:200px"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
								<!-- 添加按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="序号"
                            type="index"
                        ></el-table-column>
                        <el-table-column
                            label="参数名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row.attr_id)"
                                >编辑</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="removeParams(scope.row.attr_id)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态参数 -->
                <el-tab-pane
                    label="静态属性"
                    name="only"
                >
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="btnDisabled"
                        @click="addDialogVisible = true"
                    >添加属性</el-button>
                    <el-table
                        :data="paramsDate"
                        border
                        stripe
                    >
						<el-table-column
                            label="明细"
                            type="expand"
                        >
                            <template slot-scope="scope">
								<!-- 循环渲染明细 -->
                                <el-tag
                                    v-for="(item,i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClosed(scope.row,i)"
                                >
                                    {{ item }}
                                </el-tag>
								<!-- 新增明细 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
								<!-- 添加按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="序号"
                            type="index"
                        ></el-table-column>
                        <el-table-column
                            label="属性名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row.attr_id)"
                                >编辑</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="removeParams(scope.row.attr_id)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加对话框 ； 添加参数or属性 ； 复用 -->
        <el-dialog
            :title="'添加' + title"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="100px"
            >
                <el-form-item
                    :label="title"
                    prop="attr_name"
                >
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addParams"
                >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改对话框 ； 修改静态属性or动态属性 ; 复用-->
        <el-dialog
            :title="'修改' + title"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="100px"
            >
                <el-form-item
                    :label="title"
                    prop="attr_name"
                >
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editParams"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
	// 数据仓库
	data() {
		return {
			cateList: [],
			// 级联选择器的属性配置
			cascaderProps: {
				label: 'cat_name',
				value: 'cat_id',
				children: 'children',
				expandTrigger: 'hover',
			},
			selectedKeys: [],
			activeName: 'many',
			paramsDate: [],
			addDialogVisible: false,
			addForm: {},
			addFormRules: {
				attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
			},
			editDialogVisible: false,
			editForm: {},
			editFormRules: {
				attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
			},
		}
	},
	// 钩子函数
	created() {
		this.getCateList()
	},
	// 方法
	methods: {
		// 获取分类列表数据
		async getCateList() {
			const { data: res } = await this.$http.get('categories')
			if (res.meta.status !== 200) {
				return this.$message.error('获取失败')
			}
			this.cateList = res.data
		},
		// 级联选择器状态发生改变
		handleChange() {
			this.getParamsData()
		},
		// 获取参数数据
		async getParamsData() {
			// 判断是否选择三级分类
			if (this.selectedKeys.length !== 3) {
				this.selectedKeys = []
				this.paramsDate = []
				return
			}
			// 根据所选分类，获取动态或静态属性
			const { data: res } = await this.$http.get(
				'categories/' + this.cateId + '/attributes',
				{
					params: {
						sel: this.activeName,
					},
				}
			)
			if (res.meta.status !== 200) {
				return this.$message.error('获取失败')
			}
			// 对明细处理 ； 按空格拆成数组
			res.data.forEach(item => {
				// 字符串变成数组
				item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
				item.inputVisible = false
				item.inputValue = ''
			})

			this.paramsDate = res.data
		},
		// 标签页点击事件
		handleClick() {
			this.getParamsData()
		},
		addDialogClosed() {
			this.$refs.addFormRef.resetFields()
		},
		addParams() {
			this.$refs.addFormRef.validate(async (valid) => {
				if (!valid) return
				const { data: res } = await this.$http.post(
					'categories/' + this.cateId + '/attributes',
					{
						attr_name: this.addForm.attr_name,
						attr_sel: this.activeName,
					}
				)
				if (res.meta.status !== 201) {
					return this.$message.error('添加参数失败')
				}
				this.addDialogVisible = false
				this.getParamsData()
				this.$message.success('添加参数成功')
			})
		},
		removeParams(id) {
			this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const { data: res } = await this.$http.delete(
						'categories/' + this.cateId + '/attributes/' + id
					)
					if (res.meta.status !== 200) {
						return this.$message.error('删除失败')
					}
					this.getParamsData()
					this.$message.success('删除成功')
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		async showEditDialog(id) {
			const { data: res } = await this.$http.get(
				'categories/' + this.cateId + '/attributes/' + id,
				{
					params: { attr_sel: this.activeName },
				}
			)
			if (res.meta.status !== 200) {
				return this.$message.error('查询参数失败')
			}
			this.editForm = res.data
			this.editDialogVisible = true
		},
		editDialogClosed() {
			this.$refs.editFormRef.resetFields()
		},
		editParams() {
			this.$refs.editFormRef.validate(async (valid) => {
				if (!valid) return
				const { data: res } = await this.$http.put(
					'categories/' + this.cateId + '/attributes/' + this.editForm.attr_id,
					{
						attr_name: this.editForm.attr_name,
						attr_sel: this.activeName,
						attr_vals: this.editForm.attr_vals,
					}
				)
				if (res.meta.status !== 200) {
					return this.$message.error('修改参数失败')
				}
				this.editDialogVisible = false
				this.getParamsData()
				this.$message.success('修改参数成功')
			})
		},
		// 监听tag关闭
		handleClose(){

		},
		showInput(row){
			row.inputVisible = true
			// 定位焦点
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus()
			})
		},
		// 文本框失去焦点或enter回车
		handleInputConfirm(row){
			if(row.inputValue.trim()){
				row.attr_vals.push(row.inputValue.trim())
				this.updateParamsDetail(row)
			}
			row.inputVisible = false
			row.inputValue = ''
		},
		// 更新参数明细
		async updateParamsDetail(row){
			const {data:res} = await this.$http.put('categories/'+this.cateId+'/attributes/'+row.attr_id,{
				attr_name:row.attr_name,
				attr_sel:row.attr_sel,
				attr_vals:row.attr_vals.join(' ')
			})
			if(res.meta.status !== 200){
				return this.$message.error('更新参数失败')
			}
			this.$message.success('更新参数成功')

		},
		handleClosed(row,i){
			row.attr_vals.splice(i,1)
			this.updateParamsDetail(row)
		}
	},
	// 计算属性：
	computed: {
		// 当前选择的三级分类id
		cateId() {
			return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
		},
		// 控制按钮启用
		btnDisabled() {
			return this.selectedKeys.length === 3 ? false : true
		},
		// 添加对话框的title
		title() {
			return this.activeName == 'many' ? '动态参数' : '静态属性'
		},
	},
}
</script>

<style lang="less" scoped>
.el-alert {
	margin-bottom: 15px;
}
.el-col span {
	margin-right: 15px;
}
.el-tag{
	margin: 7px;
}
.el-input{
	width: 100px;
}
.button-new-tag{
	margin-left: 10px;
}
</style>
