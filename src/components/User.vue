<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="resetForm()">
      <el-form
        :model="addUser"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input  v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input  v-model="addUser.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input  v-model="addUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="addUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editUserDialog" width="50%" @close="resetEditForm()">
      <el-form
        :model="editUser"
        :rules="editUserRules"
        ref="editUserRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input  v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input  v-model="editUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="xiugai()">修 改</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="20">
        <!-- :gutter设置每个el-col的彼此间隔 -->
        <el-col :span="8">
          <!-- :span设置每个el-col占据的宽度 -->
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="search()"
            @keyup.enter.native="search()"
          >
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="80">
          <!--
                        在该处要显示多条记录的不同状态，有的是激活的，有的是未激活的
                        我们需要在此处把每条用户的记录信息都获取到，然后获取每个用户的状态信息
                        现在难在我们看不到v-for遍历的机制代码
                        具体语法为：<标签  slot-scope="xxxx"></标签>
                        xxxx就是代表当前el-table遍历出来的，每个用户的对象信息，但是需要xxxx.row的方式获取
                        是作用域插槽的用法
          -->
          <!-- <span slot-scope="info">
                        {{info.row}} { "id": 500, "role_name": "超级管理员", "username": "admin", "create_time": 1486720211, "mobile": "12345678", "email": "adsfad@qq.com", "mg_state": true }
          </span>-->
          <!--
                        上述span是要给当前组件el-table-column的插槽中填充的
                        el-table-column组件中又给自己的插槽丁义要是用的数据
                        <slot row="当前每条记录信息的对象"></slot>
          -->
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="300">
            <template slot-scope="info">
                <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(info.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="delUser(info.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3,5,10,20]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getUserList()
  },
  methods: {
    //   显示修改用户的对话框
    // @param id 被修改用户的id
    async showEditDialog(id){
        const {data:dt}=await this.$http.get('users/'+id)
        // console.log(dt);
        if(dt.meta.status!==200){
            return this.$message.error(dt.meta.msg)
        }
        // 把获取到的修改用户信息赋予给editUser表单数据对象
        this.editUser=dt.data

        // 显示对话框
        this.editUserDialog=true
    },
    //   修改用户
    xiugai(){
        // 校验form表单
        // async:需要设置到异步调用挨着最近的包围函数
        this.$refs.editUserRef.validate(async valid=>{
            if(valid===true){
                // axios获得并传递数据到服务器端
                const {data:dt}=await this.$http.put('users/'+this.editUser.id,this.editUser)
                // console.log(dt);
                // 修改失败处理
                if(dt.meta.status!==200){
                    return this.$message.error(dt.meta.msg)
                }
                // 数据修改成功
                // 关闭Dialog，成功提示，刷新数据
                this.editUserDialog=false
                this.$message.success(dt.meta.msg)
                this.getUserList()
            }
        })
    },
    //   重置form表单
    resetEditForm(){
        // 具备校验条件的表单域才重置
        this.$refs.editUserRef.resetFields()
    },
    //   删除用户
    delUser(id){
        this.$confirm('是否删除该用户?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
        //   服务器端实现删除数据逻辑，具体通过axios实现
        const {data:dt}=await this.$http.delete('users/'+id)
        console.log(dt);
        // 删除判断和提示
        if(dt.meta.status!=200){
            return this.$message.error(dt.meta.msg)
        }
        // 删除成功
        this.$message.success(dt.meta.msg)
        
        // 如果当前页只有一条数据，那么给页码做减一操作（前提是当前页码>1)
        if(this.userList.length===1 && this.querycdt.pagenum>1){
            this.querycdt.pagenum--
        }
        // 刷新数据
        this.getUserList()
        }).catch(() => {
                   
        });
    },
    //   添加用户
    tianjia(){
        // 校验form表单
        // async:需要设置到异步调用挨着最近的包围函数
        this.$refs.addUserRef.validate(async valid=>{
            if(valid){
                // 获取各个表单域信息
                // 利用axios把表单域信息传递到后端储存
                const {data:dt}=await this.$http.post('users',this.addUser)
                console.log(dt);
                
                // 添加失败处理
                if(dt.meta.status!==201){
                    return this.$message.error(dt.meta.msg)
                }
                // 数据添加成功
                // 关闭Dialog，成功提示，刷新数据
                this.addUserDialog=false
                this.$message.success(dt.meta.msg)
                this.getUserList()
            }
        })
    },
    //   重置form表单
    resetForm(){
        // 具备校验条件的表单域才重置
        this.$refs.addUserRef.resetFields()
    },
    // 数据检索
    search() {
      this.getUserList()
    },
    // 当前页码变化处理
    handleCurrentChange(val) {
      // val变化后的当前页码
      // 把变化后页码赋予给querycdt.pagenum
      this.querycdt.pagenum = val
      // 根据变化页码重新获取数据
      this.getUserList()
    },
    // 每页数据显示条数变化的处理
    handleSizeChange(val) {
      // val：代表当前改变后每页显示的条数
      // 把变化后的显示条数直接赋予给querycdt.pagesize
      this.querycdt.pagesize = val
      // 根据变化后的每页条数重新获取数据
      this.getUserList()
    },

    // 获取用户列表推荐
    async getUserList() {
      const { data: dt } = await this.$http.get('/users', {
        params: this.querycdt
      })
      // console.log(dt);
      // 获取数据失败处理
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获取到的数据总条数赋予给tot存储
      this.tot = dt.data.total
      // 把获得到的数据传递给userList成员
      this.userList = dt.data.users
    }
  },
  data() {
    // 自定义表单校验规则
    // @param value:被校验的数据
    // @param callback:回调函数，校验无论成功或失败都执行
    var checkMobile=(rule,value,callback)=>{
        // 手机号码规则  数字的，11位，1开头，第二位3456789
        var reg=/^1[3456789]\d{9}$/
        if(!reg.test(value)){
            // 校验失败
            return callback(new Error('手机号码格式不正确'))
        }
        // 校验成功，继续
        callback()
    }
    return {
        // 表单校验
        editUserRules:{
            mobile:[
                {required:true,message:'手机号必填',trigger:'blur'},
                {validator:checkMobile,trigger:'blur'}// 应用自定义校验规则
            ],
        },
        // 对话框显示标志
        editUserDialog:false,
        // 表单数据对象
        editUser:{
            username:'',
            mobile:'',
            email:''
        },
        // 给表单域做校验
        addUserRules:{
            username:[
                {required:true,message:'用户名必填',trigger:'blur'}
            ],
            password:[
                {required:true,message:'密码必填',trigger:'blur'}
            ],
            mobile:[
                {required:true,message:'手机号必填',trigger:'blur'},
                {validator:checkMobile,trigger:'blur'}// 应用自定义校验规则
            ],
        },
        addUser:{
            username:'',
            password:'',
            email:'',
            mobile:'',
        },
      // 对话框是否显示
      addUserDialog: false,
      // 数据记录总条数
      tot: 0,
      // 用户列表数据成员
      userList: [],
      // 获取用户列表需要的参数部分
      // 该参数在做数据检索和分页的时候都需要使用
      querycdt: {
        query: '', // 被查询的关键字【数据检索】
        pagenum: 1, // 被查询的页码，默认查询第一页数据[分页]
        pagesize: 3 // 每页显示的记录条数[分页]
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
