   
<template>
  <div class="app-container">
    
      <el-container style="height: auto; border: 1px solid #eee">
       <!-- <el-aside width="200px" style="background-color: rgb(238, 241, 246);"> -->
         <div style="position:relative;border:1px;">
           <div style="font-size:20px;height:30px;line-height:30px;margin:20px 0 10px 0;text-align:left;padding-left:10px;">组织机构</div>
          <el-tree 
           class="depttree"
           ref="guideDeptTree" 
           style="width:200px;" 
           :data="departmentTree" 
           :default-expand-all="true"  
           :expand-on-click-node="false"
           :props="defaultProps" 
          
            node-key="deptId" 
            @node-click="handleNodeClick"  >

        </el-tree>
       </div>
      <!-- </el-aside> -->
  
      <el-container>
   
    
    <el-main>
      <div class="filter-container" style="height:40px;">
      <el-input v-model="listQuery.keywords" size="small" placeholder="用户名或登陆名" style="width: 200px;height:40px;" class="filter-item" />
     
      <el-select v-model="listQuery.status" size="small" placeholder="状态" clearable class="filter-item" style="width: 130px;height:40px;">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    
      <el-button  class="filter-item" size="small" type="primary" icon="el-icon-search" @click="search">
        搜索
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->

       <el-button style="background-color:white;color:black;" class="filter-item" size="small" type="primary" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
    </div>
    
       <div class="button-container" style="margin:20px 0 5px 0;">
       
        <el-button  type="primary" style="background:rgb(17, 218, 118);border-color:rgb(17, 218, 118)" size="small" icon="el-icon-plus"   @click="handleCreate">
          新增
        </el-button>
           <el-button type="primary" :disabled="modifybutton" size="small" icon="el-icon-edit" @click="handleModifyOne">
          修改
        </el-button>

         <el-button  type="danger" :disabled="deletebutton" size="small" icon="el-icon-delete"  @click="handleDeleteBatch">
          删除
        </el-button>
           
      </div>


    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border=""
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >

    <el-table-column  type="selection"   width="55">
     </el-table-column>
     <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
     
      <el-table-column label="登陆名" width="auto" align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="auto" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ctime" label="创建时间" :formatter="formatTimeRemoveT" width="160" align="center">
   
      </el-table-column>
      <el-table-column label="性别" width="auto" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex == 1?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
       <el-table-column label="锁定" width="auto" align="center">
          <template slot-scope="{row}">
            <el-switch 
                  v-model="row.locked"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value=1
                  :inactive-value=0
                   @change="changeUserLockedStatus(row)"
            ></el-switch>
        </template >
      </el-table-column>
    
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
      
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        size="small"
        label-position="left"
        label-width="70px"
        style="width: 500px;"
      >
       <el-row :gutter="50">
          <el-col :span="12">
                <el-form-item label="登录名" prop="loginName">
                  <el-input v-model.trim="temp.loginName"/>
                </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model.trim="temp.username"/>
              </el-form-item>
          </el-col>
       </el-row>
        <el-row :gutter="50">
           <el-col :span="12">
            <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="temp.sex">
                          <el-radio :label=1>男</el-radio>
                          <el-radio :label=0>女</el-radio>
                        </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
                 <el-form-item label="电话" prop="phone">
                   <el-input v-model.number="temp.phone"/>
                 </el-form-item>
          </el-col>
       </el-row>
              <el-form-item v-show="false" label="创建时间" prop="ctime">
                   <el-input v-model.trim="temp.ctime"/>
                 </el-form-item>
       <el-row :gutter="50">
          <el-col :span="12">
                <el-form-item label="部门" prop="deptId">
                   <el-select v-model="textForShow" placeholder="请选择" clearable >
                    <el-option :value="temp.deptId" style="height: auto">
                      <el-tree style="width:auto;" :data="departmentTree"  :default-expand-all="true"  
                        :props="defaultProps" highlight-current  @node-click="handleTreeSelect"></el-tree>
                    </el-option>
                  </el-select>
               </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="角色" prop="roles">
                <el-select v-model="temp.roles" multiple placeholder="请选择">
                <el-option
                  v-for="item in rolesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
             </el-form-item>
          </el-col>
       </el-row>
        <!-- <el-form-item label="锁定" prop="locked">
          <el-switch
                :active-value=1
                :inactive-value=0
                v-model="temp.locked"
                active-color="#13ce66"
                inactive-color="#ff4949"
          ></el-switch>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border="" fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
     
    </el-main>
  </el-container>
</el-container>

    
  </div>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
</style>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getUserList,deleteUser,addUser,updateUser,getPreparedData,getRoles,deleteUserBatch,updateLocked} from "@/api/user";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
import { MessageBox, Message } from 'element-ui';
import { reject } from 'q';
import { validPhone,validName } from "@/utils/validate";
import { deleteRoleBatch } from '@/api/role';

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  

  data() {
    
    return {
      tableKey: "userId",
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        ascKeys: [],
        descKeys: [],
        status:undefined,
        depts:[],
        keywords:undefined
      },
      statusOptions:[
        {key:1,display_name:'封禁'},
         {key:0,display_name:'正常'},
      ],
     
      departmentTree:[],
      defaultProps: {
          children: 'children',
          label: 'deptName'
        },
      highlight:true,
      modifybutton:true,
      deletebutton:true,
      temp: {
        userId: undefined,
        username: 1,
        loginName:undefined,
        phone:undefined,
        deptId:undefined,
        roles:[],
        locked:0,
        sex:0,
        ctime:'',
        remark: "",
      },
      selectedDepts:[],
      checkboxSelected:[],
      rolesOptions:[],
      textForShow:'',
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改用户",
        create: "新增用户"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      
        loginName: [
          { required: true,validator:validName, trigger: "blur" }
        ],
        username: [
          { required: true,validator:validName, trigger: "blur" }
        ],
        
        deptId: [
          { required: true, message: "请选择部门", trigger: "change" }
        ],
         phone: [
          { required: true, validator:validPhone, trigger: "blur" }
        ]
        
        
      },
      downloadLoading: false
    };
  },
  created() {
    this.getPrepareData()
  },
  methods: {
    getList() {
      this.listLoading = true

      if(this.listQuery.depts == undefined || this.listQuery.depts.length<=0){
        if( this.departmentTree == undefined || this.departmentTree.length<=0){
           this.listQuery.depts = null
        }else{
          let node = this.departmentTree[0]
          // console.log(node)
          this.getDeptArray(node)
        }
      }
      getUserList(this.listQuery).then(response => {
        // console.log(response)
        let listData =  this.handleLockedStatus(response.data.records)
        this.list = listData;
        this.total = response.data.total;
        this.listLoading = false
      });
    },

    getPrepareData(){
        this.listLoading = true
        // let data = new Array()
        getPreparedData().then(response => {
            // console.log(response)
            this.departmentTree = response.data.depts
            let listData = this.handleLockedStatus(response.data.userData.records)
            this.list = listData
            this.total = response.data.userData.total

            let arr = response.data.rolesOptions
            arr.forEach(element => {
              let option = {value:element.roleId,label:element.roleName}
              this.rolesOptions.push(option)
            });
            this.listLoading = false
            
            this.$nextTick(() => {
              this.$refs.guideDeptTree.setCurrentKey(1)
            })
        })
        // this.$refs.guideDeptTree.setCurrentNode(this.list(0))

      },

    handleNodeClick(data,node,component){

      this.listQuery.depts = new Array()
      this.getDeptArray(data)

      this.getList()
    },
    
    /**
     * 递归处理 获得查询部门数组
     */
    getDeptArray(data){

       this.listQuery.depts.push(data.deptId)

       if(data.children != undefined && data.children != "" && data.children.length>0 ){
         let childrens = data.children
         childrens.forEach(ele =>{
             this.getDeptArray(ele)
         })
       }
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      console.log(row)
      
    },
    handleTreeSelect(data){
      // console.log(data)
      if(data.children==undefined || data.children == "" || data.children.length ==0){
         this.textForShow = data.deptName
         this.temp.deptId = data.deptId
        return 
      }
       return 
    },


    handleReset(){
       this.listQuery.status = undefined
       this.listQuery.keywords = undefined
    },

    resetTemp() {
      this.temp = {
        userId: undefined,
        username: undefined,
        loginName:undefined,
        phone:undefined,
        deptId:undefined,
        roles:[],
        locked:0,
        sex:1,
        ctime:'',
        remark: "",
      };
    },

    setTemp(row){

       this.temp = {
        userId: row.userId,
        username: row.username,
        loginName:row.loginName,
        phone:row.phone,
        deptId:row.deptId,
        roles:[],
        locked:row.locked,
        sex:row.sex,
        ctime:row.ctime,
        remark: row.remark,
      };
    },
    formatTimeRemoveT(row, column, cellValue, index){
      const time = row[column.property]
      if(('' + time).length === 0){
        return ''
      }
      let timeString = ('' + time).replace('T', ' ')
      return timeString
    },

    /**
     * 后台为 0、1、2 三个状态
     * 这里 由于el-switch 只有两个状态
     */
    handleLockedStatus(data){
       
       if(data != undefined && data.length>0){
        data.forEach(ele =>{
            if(ele.locked === 2){
              ele.locked = 1
            }
         })
       }
       return data
    },

    handleCreate() {
      this.resetTemp();
      this.textForShow = undefined
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      
     
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
         
          addUser(this.temp).then((response) => {

            if(response.code != '0'){
                  this.$message.error('添加用户失败！')
                  return
                }else{
                  let uid = response.data.uid
                   let createTime = response.data.ctime
                  this.dialogFormVisible = false
                  this.$message.success('添加用户成功！')
                  this.temp.userId = uid
                  this.temp.ctime = createTime
                  this.list.push(this.temp);
              }
            
            
          });
        }
      });
    },

    handleUpdate(row) {
      this.setTemp(row)
      // this.temp = Object.assign({}, row); // copy obj
      // console.log(this.temp)
      this.dialogStatus = "update";
     
      // let node = this.$refs.guideDeptTree.getNode(row.deptId)

      // if(node != null && this.departmentTree != null){
        
      //   this.textForShow = node.label
      // }

      getRoles(row.deptId,row.userId).then(response =>{
        // console.log(response)
         if(response.code != '0'){
                  this.$message.error(response.msg)
                  this.dialogFormVisible = false
                  return
        }else{
          let roleArr = response.data.roles
          this.textForShow = response.data.deptName
          let tempRoles = new Array()
          
          if(roleArr != undefined && roleArr.length>0){
            roleArr.forEach(element => {
              tempRoles.push(element.roleId)
            });
          
          }
          this.dialogFormVisible = true
          this.temp.roles = tempRoles
        }
       
        
      })
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {

      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateUser(this.temp).then((response) => {

            if(response.code != '0'){
                  this.$message.error('修改失败！')
                  return
              }else{
                 
                  for (const v of this.list) {
                  if (v.userId === this.temp.userId) {
                    const index = this.list.indexOf(v);
                    this.list.splice(index, 1, this.temp);
                    break;
                  }
                   this.$message.success('修改成功！')
                }
              }
            this.dialogFormVisible = false;
           
          });
        }
      });
    },
    handleDelete(row) {
        MessageBox.confirm('您确定要删除该用户吗？', '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteUser(row.userId).then(response =>{

              if(response.code != '0'){
                  this.$message.error('删除失败！')
                  return
                }else{
                 
                  this.$message.success('删除成功！')
                  const index = this.list.indexOf(row);
                  this.list.splice(index, 1);
              }
              this.dialogFormVisible = false
          }).catch( () =>{
          })
        }).catch(() => {
        })
     
    },

   
    handleDeleteBatch(){
         MessageBox.confirm('是否确定删除所选用户? ', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let userIdArray = []
            if(this.checkboxSelected.length<1){
               this.$message.error('请选择要删除的用户！')
               return
            }
            // console.log(this.checkboxSelected)
            // let adminArray = this.checkboxSelected.filter( ele =>{
            //    return ele.roleType == 1;
            // })
                 
            // console.log(adminArray.length)
            // if(adminArray.length>0){
            //   this.$message.error('您不具有操作超级管理员的权限！')
            //   return 
            // }

            this.checkboxSelected.forEach( ele => {
              userIdArray.push(ele.userId)
            })
            let param = {userIds:userIdArray}
            deleteUserBatch(param).then(response =>{
              if(response.code != '0'){
                  this.$message.error('删除失败！')
                  return
                }else{
                 
                  this.$message.success('删除成功！')
                  this.getList()
                  // let afterdeleteList = this.list.filter(ele =>{
                  //    console.log(userIdArray)
                  //    userIdArray.forEach(element =>{
                  //      if(ele.userId == element){
                  //        return false
                  //      }
                  //    })
                    
                  //   return true
                  // })

                  // this.list = afterdeleteList
              }
            })
        
        })
        
    },
     handleModifyOne(){
       let checkedNode = this.checkboxSelected[0]
       this.handleUpdate(checkedNode)
     },

     changeUserLockedStatus(row){

        let str = ''
        let strtitle = ''
        
        if(row.locked >= 1){
          row.locked = 0
            str = '是否确定锁定该用户?'
            strtitle = '确认锁定'
          
        }else{
          row.locked = 1
            str = '是否确定解除锁定?'
            strtitle = '确认解除'
        }

        // if(row.userId == 1){
        //   this.$message.error('您不具有操作超级管理员的权限！')
        //   return 
        // }
      

      MessageBox.confirm(str, strtitle, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(row.locked >= 1){
                row.locked = 0
              }else{
                row.locked = 1
              }
              let param = {userId:row.userId,lockedStatus: row.locked}
              updateLocked(param).then(res =>{
                  console.log(res)
                if(res == undefined){
                    if(row.locked >= 1){
                        row.locked = 0
                      }else{
                        row.locked = 1
                      }
                    return
                  }else{
                    // this.dataScopedialogFormVisible = false
                    this.$message.success('修改成功！')
                  }
              }).catch(error =>{
                   if(row.locked >= 1){
                        row.locked = 0
                      }else{
                        row.locked = 1
                  }
              })
          }).catch(error => {
            console.log(error)
          });
     },

     search(){
       this.getList()
     },

     handleSelectionChange(val){
         
          if(val.length>1){
            this.checkboxSelected = val
            this.modifybutton = true
            this.deletebutton = false
            return 
          }

          if(val.length == 1){
            this.checkboxSelected = val
            this.modifybutton = false
            this.deletebutton = false
            return
          }

          this.checkboxSelected = []
          this.modifybutton = true
          this.deletebutton = true

     }
  
  }
};


</script>
<style>

.depttree .el-tree-node:focus > .el-tree-node__content {
  background-color: rgb(6, 162, 235) !important;
  opacity: 0.9;
  font-weight: bold;
}

 /* .depttree .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: rgb(6, 162, 235) !important;
  opacity: 0.9;
  font-weight: bold;
 } */
</style>
