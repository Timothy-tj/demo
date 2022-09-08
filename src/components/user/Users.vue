<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索、添加 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入搜索内容"
                        class="input-with-select"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUserList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button
                        type="primary"
                        @click="addDialogVisible = true"
                    >添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表 -->
            <el-table
                :data="userList"
                stripe
            >
                <el-table-column
                    label="序号"
                    type="index"
                ></el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                ></el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                ></el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话"
                ></el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>
                <el-table-column label="状态">
                    <!-- 自定义模板,使用作用域插槽，通过scope.row获取当前行数据 -->
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="userStateChange(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row.id)"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="removeUserById(scope.row.id)"
                        ></el-button>
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="showRoleDialog(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="70px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="用户名"
                    prop="username"
                >
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    prop="password"
                >
                    <el-input
                        v-model="addForm.password"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="邮箱"
                    prop="email"
                >
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item
                    label="手机号"
                    prop="mobile"
                >
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addUser"
                >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="70px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="用户名"
                    prop="username"
                >
                    <el-input
                        v-model="editForm.username"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="邮箱"
                    prop="email"
                >
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item
                    label="手机号"
                    prop="mobile"
                >
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editUser"
                >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色的对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="roleDialogVisible"
            width="50%"
            @close="setRoleDialogClosed"
        >
            <div>
                <p>当前用户:{{ userInfo.username }}</p>
                <p>当前角色:{{ userInfo.role_name }}</p>
                <p>
                    分配新角色：
                    <el-select
                        v-model="selectRoleId"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="roleDialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="allotRole"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询列表的参数对象
            queryInfo: {
                query: '', //搜索关键字
                pagenum: 1, //页码
                pagesize: 5, //页大小
            },
            // 用户列表数据
            userList: [],
            // 总记录条数
            total: 0,
            // 添加对话框的显示隐藏
            addDialogVisible: false,
            // 添加表单数据对象
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 添加用户的校验规则
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur',
                    },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 10,
                        message: '长度在 6 到 10 个字符',
                        trigger: 'blur',
                    },
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {
                        pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                        message: '邮箱格式有误',
                        trigger: 'blur',
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '手机号格式不正确',
                        trigger: 'blur',
                    },
                ],
            },
            // 修改用户对话框
            editDialogVisible: false,
            editForm: {},
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {
                        pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                        message: '邮箱格式有误',
                        trigger: 'blur',
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '手机号格式不正确',
                        trigger: 'blur',
                    },
                ],
            },
            // 控制用户分配对话框
            roleDialogVisible: false,
            userInfo: {}, //空对象不报错
            // 存储角色列表
            rolesList: [],
            selectRoleId: null,
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryInfo,
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList = res.data.users
            this.total = res.data.total
        },
        // 监听pagesize的改变
        handleSizeChange(pagesize) {
            this.queryInfo.pagesize = pagesize
            this.getUserList()
        },
        // 监听pagenum的改变
        handleCurrentChange(pagenum) {
            this.queryInfo.pagenum = pagenum
            this.getUserList()
        },
        // 监听switch
        async userStateChange(userInfo) {
            const { data: res } = await this.$http.put('users/' + userInfo.id + '/state/' + userInfo.mg_state)
            if (res.meta.status !== 200) {
                // 更新失败恢复原始状态
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            // 成功
            this.$message.success('更新用户状态成功')
        },
        // 监听用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields() //<el-form ref='addFormRef' 用于此处 ； 初始化表单数据
        },
        // 确定添加用户
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                // 如果失败
                if (!valid) {
                    return
                }
                // 成功
                const { data: res } = await this.$http.post('users', this.addForm) //传对象过去，参数在对象中
                if (res.meta.status !== 201) {
                    return this.$message.error('添加用户失败')
                }
                // 成功关闭对话框
                this.addDialogVisible = false
                // 刷新用户列表
                this.getUserList()
                // 提示
                this.$message.success('添加用户成功')
            })
        },
        // 显示编辑用户对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户失败')
            }
            // 成功
            this.editDialogVisible = true
            this.editForm = res.data
        },
        // 修改用户
        editUser() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile,
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('修改用户失败')
                }
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success('修改用户成功')
            })
        },
        // 修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 根据用户ID删除用户
        removeUserById(id) {
            this.$confirm('此操作删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const { data: res } = await this.$http.delete('users/' + id)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除用户失败')
                    }
                    this.getUserList()
                    this.$message.success('删除用户成功')
                })
                .catch(() => {
                    this.$message.info('已取消删除')
                })
        },
        // 显示分配角色的对话框
        async showRoleDialog(userInfo) {
            this.userInfo = userInfo
            // 从后端获取角色列表
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败')
            }
            // 成功
            this.rolesList = res.data //存储到数据仓库
            this.roleDialogVisible = true
        },
        // 分配角色
        async allotRole() {
            // 判断是否选择了某个角色
            if (!this.selectRoleId) {
                //没选择
                return this.$message.error('请选择角色')
            }
            const { data: res } = await this.$http.put('users/' + this.userInfo.id + '/role', { rid: this.selectRoleId })
            if (res.meta.status !== 200) {
                return this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            this.getUserList()
            this.roleDialogVisible = false
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClosed() {
            this.selectRoleId = null
            this.userInfo = {}
        },
    },
}
</script>

<style lang="less" scoped></style>
