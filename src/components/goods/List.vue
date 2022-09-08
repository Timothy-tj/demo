<template>
  <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索、添加 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入商品名称"
                        class="input-with-select"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getGoodsList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getGoodsList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button
                        type="primary"
                        @click="goAddPage"
                    >添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格展示商品 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price" width="80px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="170px"></el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="goEditPage(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
                
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
  </div>
</template>

<script>
export default {
    // 数据
    data() {
        return {
            queryInfo:{
                query:'',   //搜索框输入的内容通过v-model绑定到query
                pagenum:1,
                pagesize:10
            },
            goodsList:[],
            total:0
        }
    },
    // 钩子
    created() {
        this.getGoodsList()
    },
    // 方法
    methods: {
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{
                params:this.queryInfo
            })
            if(res.meta.status !== 200){
                return this.$message.error('获取商品失败')
            }
            // 对返回的时间进行处理
            for(let item of res.data.goods){
                item.add_time = this.$utils.formatToTime(item.add_time)
            }
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        handleSizeChange(pagesize){
            this.queryInfo.pagesize = pagesize
            this.getGoodsList()
        },
        handleCurrentChange(pagenum){
            this.queryInfo.pagenum = pagenum
            this.getGoodsList()
        },
        removeById(id){
            this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                    const {data:res} = await this.$http.delete(`goods/${id}`)
                    if(res.meta.status !== 200){
                        return this.$message.error('删除失败')
                    }
                    this.getGoodsList()
                    this.$message.success('删除成功')
                }).catch(() => {
                    this.$message.info('已取消删除');          
            });
        },
        // 跳转到添加商品  ;  函数式路由跳转
        goAddPage(){
            this.$router.push('/goods/add')
        },
        // 跳转到修改商品页面
        goEditPage(id){
            this.$router.push(`/goods/edit?id=${id}`)
        }
    },
}
</script>

<style lang="less" scoped>

</style>