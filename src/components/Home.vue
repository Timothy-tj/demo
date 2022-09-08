<template>
    <el-container>
        <!-- 头部 -->
        <el-header>
            <div class="left">
                <img
                    src="../assets/imgs/shop.png"
                    alt=""
                >
                <span>电商后台管理系统</span>
            </div>
            <div class="right">
                <span>欢迎您：{{userInfo.username}}</span>
                <el-button
                    type="danger"
                    size="small"
                    @click="logout"
                >退出登录</el-button>
            </div>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 左侧 -->
            <el-aside :width="isCollapse ? '65px' : '200px'">
                <!-- 折叠 -->
                <div
                    class="toggle-button"
                    @click="isCollapse=!isCollapse"
                >|||</div>
                <!-- 侧菜单 -->
                <el-menu
                    :default-active="$route.path"
                    unique-opened
                    router
                    :collapse='isCollapse'
                    :collapse-transition='false'
                >
                    <!-- 一级菜单循环 -->
                    <el-submenu
                        :index=" item.id+'' "
                        v-for="item in menuList"
                        :key="item.id"
                    >
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单循环 -->
                        <el-menu-item
                            :index=" '/'+subItem.path "
                            v-for="subItem in item.children"
                            :key="subItem.id"
                        >
                            <i class="el-icon-menu"></i>
                            {{subItem.authName}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 中间 -->
            <el-main>
                <!-- Home组件的子路由出口 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            isCollapse: false, //是否折叠侧边栏
            userInfo: null, //存储用户信息对象
            menuList: [], //菜单列表
            iconObj: {
                //一级图标对象
                201: 'iconfont icon-shouye',
                125: 'iconfont icon-users',
                103: 'iconfont icon-tijikongjian',
                101: 'iconfont icon-shangpin',
                102: 'iconfont icon-danju',
            },
        }
    },
    created() {
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.getMenuList()
    },
    methods: {
        // 退出登录
        logout() {
            this.$confirm('此操作退出登录, 是否继续?', '提示', {
                confirmButtonText: '确定', //执行then()
                cancelButtonText: '取消', //执行catch()
                type: 'warning',
            })
                .then(() => {
                    sessionStorage.clear()
                    this.$router.push('/login')
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出',
                    })
                })
        },
        // 获取左侧菜单列表
        async getMenuList() {
            //async 会将其后的函数的返回值封装成一个 Promise 对象 ； async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行
            const { data: res } = await this.$http.get('menus') //重命名为res ；  await 会等待这个 Promise 完成，并将其 resolve 的结果返回出来
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.menuList = res.data
            // console.log(this.menuList);
            
        },
    },
}
</script>

<style lang='less' scoped>
.el-container {
    height: 100%;
}
.el-header {
    background: url('../assets/imgs/header_bg.gif') repeat-x center;
    height: 50px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    .left {
        display: flex;
        align-items: center;
        img {
            width: 40px;
            margin-right: 20px;
        }
        span {
            font-size: 20px;
        }
    }
    .right {
        span {
            margin-right: 10px;
        }
    }
}
.el-aside {
    .toggle-button {
        background: #60779d;
        font-size: 10px;
        line-height: 20px;
        text-align: center;
        color: white;
        letter-spacing: 0.2rem;
        cursor: pointer; //箭头变手
    }
    .el-menu {
        border-right: 0px;
        .iconfont {
            //自带基础样式
            margin-right: 10px;
        }
    }
}
.el-main {
    background: #eaedf1;
}
</style>