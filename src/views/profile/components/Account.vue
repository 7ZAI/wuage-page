<template>
  <el-form ref="profileForm" :model="user" :rules="rules">
     <!-- <el-form-item >
      <pan-thumb :image="image" />

      <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
        更换头像
      </el-button>

      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="300"
        :height="300"
        url="https://httpbin.org/post"
        lang-type="en"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
      
    </el-form-item> -->
    <el-form-item label="用户名" prop="name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model.number="user.phone" />
    </el-form-item>
    <!-- <el-form-item label="旧密码" prop="phone">
      <el-input v-model.number="user.phone" />
    </el-form-item>
    <el-form-item label="新密码" prop="phone">
      <el-input v-model.number="user.phone" />
    </el-form-item>
     <el-form-item label="新密码" prop="phone">
      <el-input v-model.number="user.phone" />
    </el-form-item> -->
    <el-form-item label="备注" prop="remark">
     <el-input
            v-model.trim="user.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入"
          />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import avatarupload from './components/AvatarUpload'
// import avatarupload from './components/AvatarUpload'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { validPhone,validUsername } from "@/utils/validate";
import { updateProfile} from "@/api/profile";
import store from '@/store'


export default {
  components: { ImageCropper, PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          phone: '',
          remark:''
          
        }
      }
    }
  },

  data() {

    return {
    

      rules: {
          phone: [
            { validator: validPhone, trigger: 'blur' }
          ],
          name: [
            { validator: validUsername, trigger: 'blur' }
          ]
          
        },
        
      // imagecropperShow: false,
      // imagecropperKey: 0,
      // image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    }
  },
  methods: {
    submit() {

      this.$refs['profileForm'].validate((valid) => {
          if (valid) {
            let para ={name:this.user.name,phone:this.user.phone,remark:this.user.remark}
             updateProfile(para).then(response =>{

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
                this.$store.dispatch("user/updateUserInfo");
               }
             })

            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
     
    }

    // cropSuccess(resData) {
    //   this.imagecropperShow = false
    //   this.imagecropperKey = this.imagecropperKey + 1
    //   this.image = resData.files.avatar
    // },
    // close() {
    //   this.imagecropperShow = false
    // }
  }
}
</script>
