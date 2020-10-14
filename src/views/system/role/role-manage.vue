   
<template>
  <div class="app-container">
      <div class="filter-container" >
        <el-input v-model="listQuery.keywords" placeholder="角色名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        
      
        <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select> -->
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
      </div>

       <div class="button-container" style="margin:20px 0 5px 0;">
       
        <el-button  type="primary" style="background:rgb(17, 218, 118);border-color:rgb(17, 218, 118)" size="small" icon="el-icon-plus"   @click="handleAddOne">
          新增
        </el-button>

         <el-button type="primary" :disabled="modifybutton" size="small" icon="el-icon-edit" @click="handleModifyOne">
          修改
        </el-button>

         <el-button  type="danger" :disabled="deletebutton" size="small" icon="el-icon-delete"  @click="handleDeleteBatch">
          删除
        </el-button>
      
        <!-- <el-button size="small" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
        </el-button> -->
    
      </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="rolelist"
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

      <el-table-column label="角色名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色代码"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ctime" label="创建时间" :formatter="formatTimeRemoveT" width="160px" align="center">
  
      </el-table-column>
     
       <el-table-column label="禁用"  width="100"  align="center">
           <template slot-scope="{row}">
            <el-switch 
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=0
                :inactive-value=1
                @change="changeSingleRoleStatus(row)"
            >
            </el-switch>
        </template>
      </el-table-column>
 
      <el-table-column label="操作" align="center" width="400"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)" >分配用户</el-button> -->
          <el-button type="primary" size="mini" @click="handleUpdatedataScope(row)" >数据权限</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)" >修改</el-button>
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
      @pagination="getData"
    />
    <el-dialog :title="textMap[dialogType]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="80px"
        style="width: auto; margin-left:50px;"
      >
        <el-form-item style="width:70%;" label="角色名称" prop="roleName">
           <el-input v-model.trim="dataForm.roleName"/>
        </el-form-item>
        <el-form-item  style="width:70%;" label="角色代码" prop="roleCode">
          <el-input v-model.trim="dataForm.roleCode"/>
        </el-form-item>
        <el-form-item label="菜单权限" style="width:100%;" prop="menuList">
            <template>
              <!-- <el-checkbox-group > -->
                <el-checkbox v-model="treeExpand" @change="changeTreeNodeStatus" label="全部展开/全部折叠"></el-checkbox>
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange" label="全选/全不选"></el-checkbox>
                <el-checkbox v-model="checkstrictly"  label="父子关联"></el-checkbox>
              <!-- </el-checkbox-group> -->
            </template>

            <el-tree
              :data="menuTree"
              show-checkbox
              node-key="menuId"
              ref="menus"
              :check-strictly="!checkstrictly"
              :props="menuProps" style="margin-top:5px;">
            </el-tree>
        </el-form-item>
        
        <!-- <el-form-item label="数据范围" prop="dataRange">
           <el-select v-model="dataForm.dataRange" placeholder="请选择">
            <el-option
              v-for="item in rangeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item> -->
        
        <el-form-item label="禁用" prop="status">
           <el-switch 
                :active-value=0
                :inactive-value=1
                v-model="dataForm.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
            >
            </el-switch>
        </el-form-item>
       
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogType==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    

     <el-dialog title="修改数据权限" :visible.sync="dataScopedialogFormVisible">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="roleName">
           <el-input :disabled="inputDisabled" v-model.trim="dataForm.roleName"/>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input :disabled="inputDisabled" v-model.trim="dataForm.roleCode"/>
        </el-form-item>
       
        
        <el-form-item label="数据范围" prop="dataRange">
           <el-select @change="handleRangeOptionschange" v-model="dataForm.dataRange" placeholder="请选择">
            <el-option
              v-for="item in rangeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>

         <el-form-item v-show="deptTreeVisible" label="权限范围" prop="menuList">
         
            <el-tree
              :data="deptTree"
              show-checkbox
              node-key="deptId"
              ref="depts"
              :props="deptProps" style="margin-top:5px;">
            </el-tree>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataScopedialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatedataScope()">确定</el-button>
      </div>
    </el-dialog>
   
  </div>
</template>
<script>

import { getRoles, addRole,updateRole,deleteRole,getMenus,deleteRoleBatch
        ,getMenusSelected,getDeptTree,getSelectedDeptTree,updateRoleDataRange,updateRoleStatus} from "@/api/role"
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { MessageBox, Message } from 'element-ui'
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { reject } from 'q';
import { validName } from "@/utils/validate";


export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
   
  },

  data() {
    
    return {

        listQuery: {
            page: 1,
            limit: 20,
            ascKeys: [],
            descKeys: [],
            keywords:undefined
        },
        tableKey: 0,
        total:0,
        rolelist:[],
        menuTree:[],
        deptTree:[],
        deptTreeVisible:false,
        menuProps: {
          children: 'children',
          label: 'menuName'
        },
        deptProps:{
          children: 'children',
          label: 'deptName'
        },
        modifybutton:true,
        deletebutton:true,
        inputDisabled:true,
        checkboxSelected:[],

        textMap: {
            update: "修改",
            create: "新增"
        },
        rangeOptions:[
          {label:"仅本人数据",value:0},
          {label:"仅本部门范围",value:1},
          {label:"所在部门及以下数据",value:2},
          {label:"自定义",value:3},
          {label:"全部数据",value:4},
        ],
        dialogPvVisible: false,
        dialogFormVisible: false,
        dialogType:'',

        dataScopedialogFormVisible:false,

        dataForm: {
          roleId:undefined,
          roleName:'',
          ctime: undefined,
          status:'1',
          dataRange:2,
          roleType:undefined,
          menuIds:[]
        },

        treeExpand:false,
        checkAll:false,
        checkstrictly:false,
      
        statusOptions: ["启用", "禁用"],

         rules:{
          roleName:[
            {validator:validName,trigger: 'blur' }
          ],
          roleCode:[
            {required:true,message:'请输入角色代码',trigger:'blur'},
          
          ]
        },
    };
  },

  created() {
    this.getData();
    this.getDepartmentTree();
    this.getMenusForSelect();
  },


  methods: {


      getData(){
        this.listLoading = true
        let data = this.listQuery
        getRoles(data).then(response => {
            // console.log(response.data)
            this.rolelist = response.data.roles
            this.total = response.data.total
            this.listLoading = false
        })
      },
      getMenusForSelect(){
            getMenus().then(response => {
              // console.log(response.data)
                this.menuTree = response.data
            })
      },

      formatTimeRemoveT(row, column, cellValue, index){
        const time = row[column.property]
        if(('' + time).length === 0){
          return ''
        }
        let timeString = ('' + time).replace('T', ' ')
        return timeString
      },

      handleSearch(){
        this.getData()
      },
      handleAddOne(){
        this.resetDataForm()
        this.dialogType = "create";
        this.dialogFormVisible = true;
        this.$refs.menus.setCheckedKeys([])
        this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
        });
      },

      handleUpdate(row) {
        if(row.roleType == 1){
          this.$message.error('您不具有操作超级管理员的权限！')
          return 
        }
        this.dataForm = Object.assign({}, row); // copy obj
        // console.log(this.dataForm)
     
        getMenusSelected(row.roleId).then(response =>{
            
            let selectedMenus = response.data
            // console.log("选中的"+  response.data)
           
               this.$refs.menus.setCheckedKeys(selectedMenus)
            // selectedMenus.forEach(ele =>{
            //       let node = this.$refs.menus.getNode(ele)
            //       this.$refs.menus.setChecked(node)
            //       // if(node.isLeaf){
            //       //   this.$refs.menus.setChecked(ele,true)
            //       // }
            // })
          })
       
        this.dialogType = "update";
        this.dialogFormVisible = true;

         this.$nextTick(() => {
              this.$refs["dataForm"].clearValidate();
          });
        
     },

     getDepartmentTree(){
     
        getDeptTree().then(response =>{
              // console.log(response)
              this.deptTree = response.data
        })
        
     },
     getSelectedDepartmentTree(param){

       getSelectedDeptTree(param).then(response =>{
          
          let selectedIds = response.data
          selectedIds.forEach(ele =>{
            let node = this.$refs.depts.getNode(ele)
             if(node.isLeaf){
               this.$refs.depts.setChecked(ele,true)
             }
          })
        })
     },

   

     handleUpdatedataScope(row){
         if(row.roleType == 1){
          this.$message.error('您不具有操作超级管理员的权限！')
          return 
        }
        this.dataForm = Object.assign({}, row); // copy obj
        // console.log(this.dataForm)
        // if(this.menuTree === null || this.menuTree.length <=0){
        //     getMenus().then(response => {
        //         this.menuTree = response.data
        //     })
        // }
       
        this.dataScopedialogFormVisible = true
        // console.log(row)
        this.handleRangeOptionschange(row.dataRange)
        
     },

      handleRangeOptionschange(val){
      
        if(val == 3){
          
         let roleId  = this.dataForm.roleId
          this.getSelectedDepartmentTree(roleId)
          this.deptTreeVisible = true
        }else{
           this.deptTreeVisible = false
        }

     },


     handleModifyOne(){
      //  console.log(this.checkboxSelected)
       let checkedNode = this.checkboxSelected[0]
       this.handleUpdate(checkedNode)
     },

      handleDelete(row){
        if(row.roleType == 1){
          this.$message.error('您不具有操作超级管理员的权限！')
          return 
        }
        MessageBox.confirm('是否确定删除该角色? ', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(row.roleType == 1 ){
              this.$message.error('您不具有删除超级管理员的权限！')
              return 
            }
            deleteRole(row.roleId).then(response =>{
                if(response.code === '0'){
                  this.getData()
                  this.$message.success('删除成功！')
                }else{
                   this.$message.error('' + response.msg)
                }
            })
        })
        
    },

    handleDeleteBatch(){
         MessageBox.confirm('是否确定删除所选角色? ', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let roleIdArray = []
            if(this.checkboxSelected.length<1){
               this.$message.error('请选择要删除的角色！')
               return
            }
            // console.log(this.checkboxSelected)
            let adminArray = this.checkboxSelected.filter( ele =>{
               return ele.roleType == 1;
            })
                 
            // console.log(adminArray.length)
            if(adminArray.length>0){
              this.$message.error('您不具有操作超级管理员的权限！')
              return 
            }

            this.checkboxSelected.forEach( ele => {
              roleIdArray.push(ele.roleId)
            })
            let para = {roleIds:roleIdArray}
            deleteRoleBatch(para).then(response =>{
                if(response.code === '0'){
                  this.getData()
                  this.$message.success('删除成功！')
                }else{
                   this.$message.error('' + response.msg)
                }
            })
        })
        
    },
    
    resetDataForm(){
         this.dataForm = {
          roleId:undefined,
          roleName:'',
          ctime: undefined,
          status:'1',
          dataRange:2,
          roleType:undefined,
          menuIds:[]
        }
    },

     createData(){
       
      //  console.log(this.$refs.menus.getCheckedKeys());
        let menuNodes =  this.$refs.menus.getCheckedNodes(false,true);
        let menuIds = new Array()

        menuNodes.forEach(ele =>{
            menuIds.push(ele.menuId)
          })
        this.dataForm.menuIds = menuIds
        
        this.$refs.dataForm.validate(valid => {
        if(valid){
          addRole(this.dataForm).then(response => {
                
                if(response.code != '0'){
                  this.$message.error('添加角色失败！')
                 
                  return
                }else{
                  this.getData()
                  this.dialogFormVisible = false
                  
                  this.$message.success('添加角色成功！')
                }
              })
           }
      })
    
     },

     updateData(){

        let selectMenus = this.$refs.menus.getCheckedNodes(false,true);
        let menuArray = new Array()

        selectMenus.forEach(ele =>{
            menuArray.push(ele.menuId)
          })

        this.dataForm.menuIds = menuArray
        this.$refs.dataForm.validate(valid => {
        if(valid){
          updateRole(this.dataForm).then(response => {
                
                if(response.code != '0'){
                  this.$message.error('修改角色失败！')
                 
                  return
                }else{
                  this.getData()
                  this.dialogFormVisible = false
                  
                  this.$message.success('修改角色成功！')
                }
              })
        }else {
          console.log("error submit!!")
          return false
        }
      })

      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
     },

     updatedataScope(){
       
       let nodeArray = this.$refs.depts.getCheckedNodes(false,true)

       let deptArray = new Array()

       nodeArray.forEach(ele =>{
          deptArray.push(ele.deptId)
       })

      //  console.log(deptArray)
      //  let halfArray = this.$refs.depts.getHalfCheckedKeys()
      
      // halfArray.forEach(ele =>{
      //   deptArray.push(ele)
      // })
       let roledata = this.dataForm
       let pararm = {role:roledata,depts:deptArray}

       updateRoleDataRange(pararm).then(response =>{
          
                if(response.code != '0'){
                  this.$message.error('修改失败！')
                 
                  return
                }else{
                  this.getData()
                  this.dataScopedialogFormVisible = false
                  
                  this.$message.success('修改成功！')
                }
       })

      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.depts.setCheckedKeys([]);
      });
       
     },

      //权限树 全选
      handleCheckAllChange(val) {

        console.log("全选")
          if (this.checkAll) {
              this.$refs.menus.setCheckedNodes(this.menuTree);
          } else {
              this.$refs.menus.setCheckedKeys([]);
          }
      },

  
    //改变节点的状态
    changeTreeNodeStatus(val) {
      
      this.expandedMenuTreeOrNot(this.$refs.menus.root)
      
    },

    //递归改变 状态
    expandedMenuTreeOrNot(node){
      // console.log(this.treeExpand)
      for(let i = 0; i < node.childNodes.length; i++ ) {
       //改变节点的自身expanded状态
        node.childNodes[i].expanded = this.treeExpand;
       //看看他孩子的长度，有的话就调用自己往下找
        if(node.childNodes[i].childNodes.length > 0) {
          this.expandedMenuTreeOrNot(node.childNodes[i]);
        }
      }
      
    },


     changeSingleRoleStatus(row){

        if(row.status == 1){
         row.status = 0
          str = '是否确定启用该角色?'
         strtitle = '确认启用'
       }else{
         row.status = 1
       }

      if(row.roleType == 1){
        this.$message.error('您不具有操作超级管理员的权限！')
        return 
      }

      let str = '是否确定禁用该角色?'
      let strtitle = '确认禁用'

       MessageBox.confirm(str, strtitle, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

           if(row.status == 1){
              row.status = 0
            }else{
              row.status = 1
            }
            updateRoleStatus(row).then(response =>{
              if(response.code != '0'){
                  this.$message.error('修改失败！')

                   if(row.status == 1){
                      row.status = 0
                    }else{
                      row.status = 1
                    }

                  return
                }else{
                  // this.dataScopedialogFormVisible = false
                  this.$message.success('修改成功！')
                }
            })

        }).catch(() => {
            
        });
     },
    
    //**表格的checkbox */
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