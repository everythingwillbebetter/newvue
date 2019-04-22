<template>
    <div class="login-container">
        <!-- <h2>管理员登录系统</h2> -->
        <div class="login-box">
            <div class="logo-box">
                <img src="../assets/img/logo.png" alt="">
            </div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username">
                        <i slot="prefix" class="iconfont icon-user"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password">
                        <i slot="prefix" class="iconfont icon-3702mima"></i>
                    </el-input>
                </el-form-item>
                <el-row>
                    <el-col :push="7">
                        <el-button type="primary" @click="login()">登录</el-button>
                        <el-button type="info" @click="reset()">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loginForm:{
                username:'',
                password:''
            },
            // 对表单域项目进行校验
            loginFormRules:{
                username:[
                    {required:true,message:'用户名必填',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'密码必填',trigger:'blur'}
                ],
            }
        }
    },
    methods: {
        login(){
            // 表单校验没有问题时，页面再跳转
            this.$refs.loginFormRef.validate(async valid=>{
                // valid:校验成功/失败 的标志，true：成功，false：失败
                if(valid===true){
                    // 账号真实性校验（用户名、密码校验）
                    const {data:dt}=await this.$http.post('/login',{
                        username:this.loginForm.username,
                        password:this.loginForm.password,
                    })
                    // 登录失败提示（用户名或密码错误）
                    if(dt.meta.status!==200){
                        return this.$message.error(dt.meta.msg)
                    }
                    // 通过dt把服务器端返回的token再sessionStorage里边保存好
                    window.sessionStorage.setItem('token',dt.data.token)
                    // 编程式导航，到达后台首页
                    this.$router.push('/home')
                }
            })
        },
        reset(){
            this.$refs.loginFormRef.resetFields()
        }
    },
    
}
</script>

<style lang="less" scoped>
.login-container{
    background-color: #2b4b6b;
    height: 100%; 
    overflow: hidden;
    .login-box{
        width: 450px;
        height: 305px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border-radius: 5px;
        .logo-box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 8px;
            box-shadow: 0 0 10px #eee;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .login-form{
            width: 100%;
            position: absolute;
            bottom: 0;
            background-color: #aaa;
            padding: 20px;
            box-sizing: border-box;
            input{
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                box-sizing: border-box;
                color: #606266;
                display: inline-block;
                // font-size: inherit;
                height: 40px;
                line-height: 40px;
                // outline: 0;
                padding: 0 15px;
                width: 100%;
            }
        }
        .el-form{
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
    }
}
</style>
