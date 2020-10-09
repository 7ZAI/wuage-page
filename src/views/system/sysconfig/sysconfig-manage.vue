   
<template>
  <div class="app-container">
      
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="auto"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="系统模式" prop="SYSTEM_MODE">
           <el-radio-group v-model="dataForm.SYSTEM_MODE" size="medium">
              <el-radio-button :label=0 >正常模式</el-radio-button>
              <el-radio-button :label=1 >演示模式</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="登录开关" prop="LOGIN_SWITCH">
         <el-switch
          v-model="dataForm.LOGIN_SWITCH"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value=1
          :inactive-value=0>
        </el-switch>
        </el-form-item>
        
        <el-form-item label="验证码开关" prop="CAPTCHA_SWITCH">
           <el-switch
          v-model="dataForm.CAPTCHA_SWITCH"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value=1
          :inactive-value=0>
        </el-switch>
        </el-form-item>

         <el-form-item label="密码错误次数" prop="MAX_LOGIN_ERROR">
           <!-- <template> -->
             <!-- @change="handleChangePswerrorTimes"   -->
            <el-input-number v-model="dataForm.MAX_LOGIN_ERROR" :min="1" :max="10" ></el-input-number>
          <!-- </template> -->
        </el-form-item>

        <el-form-item label="冻结时间(h)" prop="FREEZE_HOUR">
            <!-- <template> -->
              <!-- @change="handleChangefreezeTime"  -->
            <el-input-number  v-model="dataForm.FREEZE_HOUR" :min="1" :max="48" ></el-input-number>
          <!-- </template> -->
        </el-form-item>


      </el-form>
    
        <!-- <el-button @click="dataScopedialogFormVisible = false">取消</el-button> -->
        <el-button type="primary" @click="updateSystemConfig()" size="small">保存</el-button>
     
  
   
  </div>
</template>
<script>

import {getSysConfig,updateSysConfig} from "@/api/systemConfig"
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { MessageBox, Message } from 'element-ui'

import { reject } from 'q';
import { validName } from "@/utils/validate";



export default {
  name: "ComplexTable",
  directives: { waves },



  data() {
   
    return {

        dataForm:{
          // SYSTEM_MODE:0,
          // LOGIN_SWITCH:0,
          // CAPTCHA_SWITCH:0,
          // MAX_LOGIN_ERROR:0,
          // FREEZE_HOUR:1

        },
     
         mode: '',
         rules:{
          SYSTEM_MODE:[
             {required:true,message:'不能为空',trigger:'blur'},
          ],
          LOGIN_SWITCH:[
            {required:true,message:'不能为空',trigger:'blur'},
          
          ],
           CAPTCHA_SWITCH:[
            {required:true,message:'不能为空',trigger:'blur'},
          
          ],
           MAX_LOGIN_ERROR:[
            {required:true,message:'不能为空',trigger:'blur'},
          
          ],
          FREEZE_HOUR:[
            {required:true,message:'不能为空',trigger:'blur'},
          ]
        },
    };
  },

  


  created() {
    this.getData();
  },
  mounted(){
    this.mode =  this.dataForm.SYSTEM_MODE === 0 ? "正常模式":"演示模式"
  },
  methods: {

     getData(){
        getSysConfig().then(response => {
            console.log("-------------"+response.data)
            
            this.dataForm = response.data
               
            
            
    
        })
      },

  

      updateSystemConfig(){

        MessageBox.confirm('您确定要保存该系统参数吗？', '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
              this.$refs["dataForm"].validate(valid => {
                      if (valid) {
                        
                        updateSysConfig(this.dataForm).then((response) => {

                          if(response.code != '0'){
                                this.$message.error('更新失败！')
                                return
                              }else{
                            
                                this.$message.success('修改成功！')
                              
                            }
                          
                          
                        });
                      }
                      });
          }).catch( () =>{

          })
    }
  }
  
};
</script>

<style lang="scss" scoped>



.icons-area{
 display: flex;
  flex-wrap: wrap;
}

.icons-container {
  overflow: hidden;
 
}
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 10px;
    height: 30px;
    text-align: center;
    width: 30px;
    float: left;
    font-size: 20px;
    color: #24292e;
    cursor: pointer;
  }


.hover:hover {
    -webkit-transform: translateY(-3px);
    -ms-transform: translateY(-3px);
    transform: translateY(-3px);
    -webkit-box-shadow: 0 0 6px #999;
    box-shadow: 0 0 6px #999;
    -webkit-transition: all .2s ease-out;
    transition: all .2s ease-out;
  }

  .disabled {
    pointer-events: none;
  }

</style>