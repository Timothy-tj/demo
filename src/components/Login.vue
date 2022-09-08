<template>
    <div class="login-container">
        <!-- 左 -->
        <div class="left">
            <img src="../assets/imgs/login_img.png" alt="">
        </div>
        <!-- 右 -->
        <div class="box">
            <!-- 头像 -->
            <div class="head-img">
                <img src="../assets/imgs/login_logo.png" alt="">
            </div>
            <!-- 标题 -->
            <div class="title">
                电商后台管理系统
            </div>
            <!-- 表单 -->
            <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" prefix-icon="iconfont icon-lock_fill" v-model="loginForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round class='login-btn' @click="login">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            // 表单校验规则
            loginFormRules:{
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        login(){
            //判断表单是否校验成功 ; validate(验证)
            this.$refs.loginFormRef.validate(async valid => {
                // 如果不成功
                if(!valid){
                    return
                }
                // 成功时,发送请求并回调 ; 解构赋值
                const {data:res} = await this.$http.post('login',this.loginForm);
                if(res.meta.status !== 200){
                   return this.$message.error('登录失败');     
                }
                this.$message.success('登录成功'); 
                // 保存用户信息 ； 键：值
                sessionStorage.setItem('userInfo',JSON.stringify(res.data));    //把信息转换为字符串存储
                this.$router.push('/home');
            })         
        }
    }
}
</script>

<style lang='less' scoped>
.login-container{
    background: #93defe;
    height: 100%;
    display: flex;  
    justify-content: center;    //水平居中 
    align-items: center;    //垂直居中
    .left{
        margin-right: 100px;
    }
    .box{
        width: 400px;
        height: 350px;
        background: #fff;
        padding: 50px;
        border-radius: 6px;
        box-sizing: border-box;     //怪异盒子模型（padding+border算在content中，盒子模型会自动根据padding和border的值来调整content的值）
        position: relative;     //子绝父相设置子的定位
        .head-img{
            width: 120px;
            height: 120px;
            border: 5px solid #93defe;
            border-radius: 100px; 
            text-align: center;
            line-height: 110px;
            position:absolute;
            top: -60px;
            right: 140px;
            background: #fff;
        }
        .title{
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translate(-50%);     //左平移自身的一半(实现居中)
            font-size: 18px;
            color: #444;
        }
        .login-form{
            bottom: 0px;
            position: absolute;
            left: 50%;
            transform: translate(-50%); 
            width: 80%;
            padding:10px 20px;
            box-sizing: border-box;
            .login-btn{
                width: 100%;
            }
        }
    }
}
</style>