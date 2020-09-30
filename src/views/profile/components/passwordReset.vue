<template>
  <el-form ref="passwordForm" :model="psdForm"  :rules="rules">

    <el-form-item label="旧密码" prop="oldpwd">
      <el-input type="password" v-model.trim="psdForm.oldpwd" />
    </el-form-item>
    <el-form-item label="新密码" prop="newpwd">
      <el-input type="password" v-model.trim="psdForm.newpwd" />
    </el-form-item>
    <el-form-item label="确认密码" prop="checkpwd">
      <el-input type="password" v-model.trim="psdForm.checkpwd" />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import avatarupload from './components/AvatarUpload'
// import avatarupload from './components/AvatarUpload'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { validPhone,validUsername,validatePassword,validatePass2 } from "@/utils/validate";
import { updatePwd} from "@/api/profile";
import store from '@/store'


export default {
  components: { ImageCropper, PanThumb },



  data() {
    

    return {
     
     psdForm:{
      oldpwd: '',
      newpwd: '',
      checkpwd:'',
     },
     

      rules: {
          oldpwd: [
            {  requried:true,validator: validatePassword, trigger: 'blur' }
          ],
          newpwd: [
            {  requried:true,validator: validatePassword, trigger: 'blur' }
          ],
          checkpwd:[
            { requried:true, validator:validatePass2,trigger: 'blur'}
          ]
          
        },
        
      // imagecropperShow: false,
      // imagecropperKey: 0,
      // image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    }
  },
  methods: {
    submit() {
      console.log(this.psdForm)
      this.$refs['passwordForm'].validate((valid) => {
          if (valid) {
           
             updatePwd(this.psdForm).then(response =>{

              if(response.code != '0'){
                  this.$message.error(response.msg)
               }else{
                //  let cuuser = store.getters.user
                //  cuuser.username = para.name
                //  cuuser.phone = para.phone
                //  cuuser.remark = para.remark
                // //  console.log(this.$store)
                //   this.$store.commit('user/SET_USER', cuuser);
                //   this.$store.commit('user/SET_NAME', para.name);
                  this.$message.success('修改成功！')
                  this.psdForm.oldpwd = ''
                  this.psdForm.newpwd = ''
                  this.psdForm.checkpwd = ''
                // this.$store.dispatch("user/updateUserInfo");
               }
             })

            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
     
    }


  }
}
</script>
