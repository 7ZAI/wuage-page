<template>
 <div class="app-container">
   <div class="filter-container">
      <el-input  placeholder="部门名称" v-model="listQuery.keywords" style="width: 200px;" class="filter-item"  />
     
      <el-button v-waves  @click="search()" class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>
   
      <!-- <el-button  class="filter-item" type="primary" icon="el-icon-download" >
        导出
      </el-button> -->
      
    </div>
  <el-table
    :data="deptList"
   
     v-loading="listLoading"
    style="width: 100%;margin-top:1.5rem;"
    row-key="deptId"
    border
    :tree-props="{children: 'children'}" 
     :default-expand-all="isExpand"
    >
    <el-table-column
      prop="deptName"
      label="部门名称"

     >
    </el-table-column>
    <el-table-column
      prop="leader"
      label="部门负责人"
      width="160">
    </el-table-column>
    
    <el-table-column
      prop="phone"
      label="部门电话"   align="center">
    </el-table-column>
     <!-- <el-table-column
      prop="type"
      label="部门电话"  width="100" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type === 1" type="success" disable-transitions>目录</el-tag>
        <el-tag v-if="scope.row.type === 2"  disable-transitions>菜单</el-tag>
        <el-tag v-if="scope.row.type === 3" type="warning" disable-transitions>按钮</el-tag>
      </template>
    </el-table-column> -->
    
    <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
           <el-button type="success" size="mini" @click="handleCreate(row)">新增</el-button>

          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
  </el-table>

   <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center width="30%;">
      <el-form
        ref="deptForm"
        :rules="deptRules"
        :model="deptForm"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
       
      >
      <el-form-item  v-if="false"  label="上级部门ID" prop="deptParentId">
             <el-input name="deptParentId"  v-model="deptForm.deptParentId"/>
      </el-form-item>
       <el-form-item label="上级部门" prop="parentName">
            <el-input name="parentName" @focus="selectParent()" v-if="deptForm.parentName != null && deptForm.parentName != undefined" v-model="deptForm.parentName"/>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
            <el-input name="deptName" v-model="deptForm.deptName"/>
        </el-form-item>
         <el-form-item label="部门领导" prop="leader">
          <el-input name="leader" v-model="deptForm.leader"/>
        </el-form-item>
        <el-form-item label="部门电话" prop="phone">
          <el-input name="phone" v-model="deptForm.phone"/>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    
    </el-dialog>


    <el-dialog :visible.sync="dialogDeptTreeVisible" width="30%" top="20vh" title="选择上级部门">
         <div :class="topmenucss" @click="selectTop">顶层部门</div>
        <el-tree class="efg" :data="deptList"  :highlight-current="highlight" :props="defaultProps"  @node-click="handleNodeClick" @node-collapse="canceltop" @node-expand="canceltop">

        </el-tree>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeptTreeVisible = false">取消</el-button>
        <el-button type="primary" @click="conmfirmSelected()">确定</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>

import waves from "@/directive/waves"
import { getDepts, addDept,updateDept,deleteDept} from "@/api/department"
import { MessageBox, Message } from 'element-ui'
import svgIcons from '../../icons/svg-icons'
import { validPhone,validUsername } from "@/utils/validate";

export default {

  directives: { waves },
   
    data() {

      return {
        listLoading: true,
        svgIcons,

        listQuery: {
          page: 1,
          limit: 20,
          keyword:undefined,
          type:undefined,
          status:undefined
        },

        deptList:[],

        deptForm: {
          deptId:undefined,
          deptName:'',
          parentName:undefined,
          leader: undefined,
          phone: undefined,
          deptParentId:undefined,
        },
       isExpand:true,

        deptRules:{
          deptName:[
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            {min:2,max:12,message:'长度范围为2~12个字符',trigger:'blur'}
          ],
          leader:[
            {required:true,message:'请输入部门领导名称',trigger:'blur'},
            {min:2,max:12,message:'长度范围为2~12个字符',trigger:'blur'}
          ],
          phone:[
            { required: true, validator:validPhone, trigger: "blur" }
          ]
        },
                
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        highlight:true,
        nodeselected:undefined,
        topmenucss:'topmenu',
      
       
        dialogFormVisible: false,
      
        dialogStatus: "",
        textMap: {
          update: "修改",
          create: "新增"
        },
        dialogPvVisible: false,
        dialogDeptTreeVisible:false,
        }
      },

    created() {
      this.getDepartments()
    },
    mounted(){
    
    },

    methods: {
      getDepartments(){
        this.listLoading = true
        let data = this.listQuery
        getDepts(data).then(response => {
            // console.log(response.data)
            this.deptList = response.data
            this.listLoading = false

            
        }).then(response=>{
          this.$nextTick(()=>{
					    document.getElementsByClassName('el-table__expand-icon')[0].click();
					});
        })
     
      },

      search(){
         this.getDepartments()
      },
       resetTemp() {
        this.deptForm = {
            deptId:undefined,
            deptName:undefined,
            leader: undefined,
            phone: undefined,
        }
    },
    
     generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },

      handleCreate(row){
        this.resetTemp()
        this.deptForm.parentName = row.deptName
        this.deptForm.deptParentId = row.deptId // copy obj
        this.dialogStatus = "create"
        this.dialogFormVisible = true
        this.$nextTick(() => {
                this.$refs["deptForm"].clearValidate();
        });
      },

      handleUpdate(row) {
        // var aData = new Date()
        this.deptForm = Object.assign({}, row) 
        delete this.deptForm['updateTime'] 
        if(typeof(this.deptForm.parentName) === undefined || this.deptForm.parentName === null){
          this.deptForm.parentName = '无'
        }
        this.dialogStatus = "update"
        this.dialogFormVisible = true
         this.$nextTick(() => {
                this.$refs["deptForm"].clearValidate();
        });
    },



    handleNodeClick(data) {
        // console.log(data)
        
        this.topmenucss = 'topmenu'
        this.nodeselected = Object.assign({}, data)
    },
    canceltop(){
      this.topmenucss = 'topmenu'
    },
    chooseIcons(){
      this.dialogPvVisible= true
    },

    selectParent(){
      
      this.dialogDeptTreeVisible = true
    },

    selectTop(){
      this.topmenucss = 'topmenu topmenuBg' 
      this.nodeselected = {deptId:0,deptName:'无'}
    },

    conmfirmSelected(){
        if(typeof(this.nodeselected)==undefined || this.nodeselected == null){

        }else{
            this.deptForm.deptParentId = this.nodeselected.deptId
            this.deptForm.parentName = this.nodeselected.deptName
        }
        this.dialogDeptTreeVisible = false
    },

    selectOne(obj){
        // console.log(obj);
         this.deptForm.icon = obj;
         this.dialogPvVisible= false;
    },

    createData(){
      this.$refs.deptForm.validate(valid => {
        if(valid){
          addDept(this.deptForm).then(response => {
                
                if(response.code != '0'){
                  this.$message.error('添加部门失败！')
                  return
                }else{
                  this.getDepartments()
                  this.dialogFormVisible = false
                  this.$message.success('添加部门成功！')
                }
              })
        }else {
          console.log("error submit!!")
          return false
        }
      })
    },

    handleDelete(row){

        MessageBox.confirm('是否确定删除该部门? ', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteDept(row.deptId).then(response =>{
                if(response.code === '0'){
                  this.getDepartments()
                  this.$message.success('删除成功！')
                }else{
                   this.$message.error('' + response.msg)
                }
            })
        })
        
    },

    updateData(){
      
      this.deptForm.children = undefined
      // delete this.deptForm.updateTime
      // console.log(this.deptForm)
      this.$refs.deptForm.validate(valid => {
        if(valid){
          updateDept(this.deptForm).then(response => {
                    if(response.code != '0'){
                      this.$message.error('修改部门失败！')
                      return
                    }else{
                      this.getDepartments()
                      this.dialogFormVisible = false
                      this.$message.success('修改成功！')
                    }
                  })
              }else {
                    console.log("error submit!!")
                    return false
              }
        })
      }
    }

  }
</script>

<style>

.topmenu{
 
  height: 26px;
  cursor: pointer;
  font-size: 14px;
  line-height: 26px;

}

.topmenuBg{
   background-color: rgb(6, 162, 235) ;
}
.efg .el-tree-node:focus > .el-tree-node__content {
  background-color: rgb(6, 162, 235) !important;
}
</style>

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