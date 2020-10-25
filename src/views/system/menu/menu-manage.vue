<template>
 <div class="app-container">
   <div class="filter-container">
      <el-input  placeholder="菜单名称" v-model="listQuery.keywords" size="small" style="width: 200px;" class="filter-item"  />
      <el-select v-model="listQuery.type" placeholder="类型" clearable style="width: 90px" size="small" class="filter-item">
         <el-option v-for="item in menuTypes" :key="item.text" :label="item.text" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" size="small" placeholder="显示状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in menustatus" :key="item.text" :label="item.text" :value="item.value" />
      </el-select>
      <el-button v-waves  @click="search()" class="filter-item" type="primary" size="small" icon="el-icon-search">
        搜索
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
      <!-- <el-button  class="filter-item" type="primary" icon="el-icon-download" >
        导出
      </el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>
  <el-table
    :data="menuList"
     v-loading="listLoading"
    style="width: 100%;margin-top:1.5rem;"
    row-key="menuId"
    border
    :tree-props="{children: 'children'}" 
    >
    <el-table-column
      prop="menuName"
      label="菜单名称"

      width="160" >
    </el-table-column>
    <el-table-column
      prop="url"
      label="请求地址"
      width="160">
    </el-table-column>
    <el-table-column
      prop="icon"
      label="图标"
      width="60" align="center">
       <template slot-scope="scope">
        <svg-icon v-if="scope.row.icon != null" :icon-class="scope.row.icon"/>
      </template>
    </el-table-column>
    <el-table-column
      prop="orderNumber"
      label="排序"  width="60" align="center">
    </el-table-column>
     <el-table-column
      prop="type"
      label="菜单类型"  width="100" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type === 1" type="success" disable-transitions>目录</el-tag>
        <el-tag v-if="scope.row.type === 2"  disable-transitions>菜单</el-tag>
        <el-tag v-if="scope.row.type === 3" type="warning" disable-transitions>按钮</el-tag>
      </template>
    </el-table-column>
      <el-table-column
      prop="status"
      label="状态" width="80" align="center">
       <template slot-scope="scope">
          <svg-icon v-if="scope.row.status === 1" icon-class="eye-open" />
           <svg-icon v-if="scope.row.status === 0" icon-class="eye" />
      </template>
    </el-table-column>
     <el-table-column
      prop="permission"
      label="权限标识" width="160">
    </el-table-column>
     <el-table-column
      prop="componentPath"
      label="组件路径" min-width="180" >
    </el-table-column>
    <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
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
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px;height:auto; margin-left:50px;"
      >
       <el-form-item label="上级菜单" v-if="temp.parentName != undefined && temp.parentName != undefined && temp.parentName != '顶层菜单'" prop="parentName">
            <el-input @focus="selectParent()"  v-model="temp.parentName"/>
        </el-form-item>
         <el-form-item label="上级菜单" v-if="temp.parentName == '顶层菜单'" prop="parentName">
            <!-- <el-input  v-show="false"  v-model="temp.parentName"/> -->
            <el-button type="primary" size="mini" @click="selectParent()">选择父菜单</el-button>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model.trim="temp.menuName"/>
        </el-form-item>
        <el-form-item v-if="temp.type != 3" label="请求地址" prop="url">
          <el-input v-model.trim="temp.url"/>
        </el-form-item>
        <el-form-item v-if="temp.type != 3" label="图标" prop="icon">
          <el-input v-model="temp.icon" @focus="chooseIcons()" />
        </el-form-item>
        <el-form-item v-if="temp.type != 1" label="权限标识" prop="permission">
          <el-input v-model.trim="temp.permission"/>
        </el-form-item>
        <el-form-item  v-if="temp.type != 3" label="组件路径" prop="componentPath">
          <el-input v-model.trim="temp.componentPath"/>
        </el-form-item>
         <el-form-item label="排列序号" prop="orderNumber">
          <el-input v-model.number="temp.orderNumber"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group @change="menuTypeChange" v-model="temp.type">
          <el-radio-button :label="1">目录</el-radio-button>
          <el-radio-button :label="2">菜单</el-radio-button>
          <el-radio-button :label="3">按钮</el-radio-button>
        </el-radio-group>
        </el-form-item>
         <el-form-item v-if="temp.type != 3" label="显示" prop="status">
          <el-radio-group v-model="temp.status">
          <el-radio :label="1"><svg-icon icon-class="eye-open" />&nbsp;&nbsp;显示</el-radio>
          <el-radio :label="0"><svg-icon icon-class="eye" />&nbsp;&nbsp;隐藏 </el-radio>
          
        </el-radio-group>
        </el-form-item>
        
         
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    
    </el-dialog>

   
    <el-dialog :visible.sync="dialogPvVisible" width="38%" top="20vh" title="选择图标">
       <div class="icons-area">
          <div class="icons-container" v-for="item of svgIcons" :key="item" >
              <div @click="selectOne(item)" class="icon-item hover">
                <svg-icon :icon-class="item" class-name="disabled" />
              </div>
          </div>
        </div>
    
    </el-dialog>

    <el-dialog :visible.sync="dialogMenuTreeVisible" width="30%" top="20vh" title="选择上级菜单">
         <div :class="topmenucss" @click="selectTop">顶层目录</div>
         
            <el-tree class="abc" :data="menuList"  :highlight-current="highlight" :props="defaultProps"  @node-click="handleNodeClick" @node-collapse="canceltop" @node-expand="canceltop">
      
        

        </el-tree>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuTreeVisible = false">取消</el-button>
        <el-button type="primary" @click="conmfirmSelected()">确定</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>

import waves from "@/directive/waves"
import { getMenus,addMenu,deleteMenu,updateMenu} from "@/api/menu"
import { MessageBox, Message } from 'element-ui'
import { validName } from "@/utils/validate";
import svgIcons from '../../icons/svg-icons'

  export default {

  directives: { waves },

 

    data() {
      return {
        listLoading: true,
        svgIcons,

        listQuery: {
          page: 1,
          limit: 20,
          keywords:undefined,
          type:undefined,
          status:undefined
      },
      
        menuList: [],

         defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        highlight:true,
        nodeselected:undefined,
        topmenucss:'topmenu',
        // 菜单类型 目录1 菜单2 按钮3
        menuTypes:[
          {text:'目录',value:1},
          {text:'菜单',value:2},
          {text:'按钮',value:3}
        ],
        menustatus:[
          {text:'显示',value:1},
          {text:'隐藏',value:0}
        ], 
        temp: {
          parentId:undefined,
          parentName:undefined,
          id: undefined,
          menuName: undefined,
          type:undefined,
          icon:undefined,
          url:undefined,
          orderNumber:undefined,
          status: undefined,
          permission:undefined,
          componentPath:undefined 
      },

     rules: {
      
        parentName: [
          { required: true,message:"请选择上级部门", trigger: "blur" }
        ],
        menuName: [
          { required: true,validator:validName, trigger: "blur" }
        ],
        
        url: [
          { required: true, message: "请填写菜单请求地址", trigger: "change" }
        ],
         icon: [
          { required: true, message:"请选择图标", trigger: "blur" }
        ],
        componentPath: [
          { required: true, message:"请填写组件路径", trigger: "blur" }
        ],
         permission: [
          { required: true, message:"请填写权限标识", trigger: "blur" }
        ],
        
      },
      dialogFormVisible: false,
      
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增"
      },
      dialogPvVisible: false,
      dialogMenuTreeVisible:false,
      }
    },

    created() {
      this.getMenuList()
     
    },

   
    methods: {
      getMenuList(){
        this.listLoading = true
        let data = this.listQuery
        getMenus(data).then(response => {
            console.log(response.data)
            this.menuList = response.data
            this.listLoading = false
        }).then(response=>{
          this.$nextTick(()=>{
					    document.getElementsByClassName('el-table__expand-icon')[0].click();
					});
        })
      },

      search(){
         this.getMenuList()
      },
       resetTemp() {
        this.temp = {
            parentId:undefined,
            parentName:undefined,
            id: undefined,
            menuName: undefined,
            type:1,
            icon:undefined,
            url:undefined,
            orderNumber:1,
            status: 1,
            permission:undefined,
            componentPath:undefined
        }
    },

    menuTypeChange(val){
      // console.log(val)
       this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    
     generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },

      handleCreate(row){
        this.resetTemp()
        this.temp.parentName = row.menuName
        this.temp.parentId = row.menuId // copy obj
        this.dialogStatus = "create"
        this.dialogFormVisible = true
        this.$nextTick(() => {
           this.$refs["dataForm"].clearValidate();
      });
      },

      handleUpdate(row) {
        // var aData = new Date()
        
        this.temp = Object.assign({}, row) 
        delete this.temp['updateTime'] 
        if(typeof(this.temp.parentName) === undefined || this.temp.parentName === null || this.temp.parentName === ''){
          console.log("hahahahahahahahahahahah")
          this.temp.parentName = '顶层菜单'
        }

        console.log(this.temp)
        this.dialogStatus = "update"
        this.dialogFormVisible = true
        this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row){},


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
      
      this.dialogMenuTreeVisible = true
    },

    selectTop(){
      this.topmenucss = 'topmenu topmenuBg' 
      this.nodeselected = {menuId:0,menuName:'顶层菜单'}
    },

    conmfirmSelected(){
        if(typeof(this.nodeselected)==undefined || this.nodeselected == null){

        }else{
            this.temp.parentId = this.nodeselected.menuId
            this.temp.parentName = this.nodeselected.menuName
        }
        this.dialogMenuTreeVisible = false
    },

    selectOne(obj){
        // console.log(obj);
         this.temp.icon = obj;
         this.dialogPvVisible= false;
    },

    createData(){
     
       this.$refs["dataForm"].validate(valid => {
            if (valid) {
              addMenu(this.temp).then(response => {
                        
                if(response.code != '0'){
                  this.$message.error('添加菜单失败！')
                  return
                }else{
                  this.getMenuList()
                  this.dialogFormVisible = false
                  this.$message.success('添加菜单成功！')
                }
              })
            }
       })
      
      
    },

    handleDelete(row){

        MessageBox.confirm('是否确定删除该菜单? ', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           if(row.hasChildren){
           this.$message.error('该菜单存在子菜单，无法删除！')
           return 
        }else{
            deleteMenu(row.menuId).then(response =>{

                if(response.code === '0'){
                  this.getMenuList()
                  this.$message.success('删除成功！')

                }
            })

            
        }
        })
        
    },

    updateData(){
      this.temp.children = undefined
      delete this.temp.u
      // console.log(this.temp)
      this.$refs["dataForm"].validate(valid => {
          if (valid) {
              updateMenu(this.temp).then(response => {
                  if(response.code != '0'){
                    this.$message.error('修改菜单失败！')
                    return
                  }else{
                    this.getMenuList()
                      
                    this.dialogFormVisible = false
                    this.$message.success('修改成功！')
                  }
                })
          }
      })
    },
      
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
.abc .el-tree-node:focus > .el-tree-node__content {
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