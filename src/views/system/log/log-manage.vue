   
<template>
  <div class="app-container">
      <div class="filter-container" >
        <el-input v-model="listQuery.keywords" placeholder="文件名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        
      
        <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select> -->
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
      </div>

       <div class="button-container" style="margin:20px 0 5px 0;">
       
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
      :data="loglist"
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

      <el-table-column label="日志标题" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志类型"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.operatorType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logTime" label="时间" :formatter="formatTimeRemoveT" width="160px" align="center">
  
      </el-table-column>
     
       <el-table-column label="请求地址"  width="100"  align="center">
           <template slot-scope="{row}">
        <span>{{ row.url }}</span>
        </template>
      </el-table-column>

      
       <el-table-column label="ip地址"  width="100"  align="center">
           <template slot-scope="{row}">
        <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="参数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.param }}</span>
        </template>
      </el-table-column>

       <el-table-column label="返回结果" align="center">
        <template slot-scope="{row}">
          <span>{{ row.result }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operatorName }}</span>
        </template>
      </el-table-column>
 
      <el-table-column label="操作" align="center" width="400"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
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
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="roleName">
           <el-input v-model.trim="dataForm.roleName"/>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model.trim="dataForm.roleCode"/>
        </el-form-item>
        <el-form-item label="菜单权限" prop="menuList">

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


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataScopedialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatedataScope()">确定</el-button>
      </div>
    </el-dialog>
   
  </div>
</template>
<script>

import { getLogs} from "@/api/systemLog"
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
        loglist:[],

        deletebutton:true,
        inputDisabled:true,
        checkboxSelected:[],

        textMap: {
            update: "修改",
            create: "新增"
        },
  
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
  },

  methods: {


      getData(){
        this.listLoading = true
        let data = this.listQuery
        getRoles(data).then(response => {
            console.log(response.data)
            this.rolelist = response.data.roles
            this.total = response.data.total
            this.listLoading = false
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
            console.log(this.checkboxSelected)
            let adminArray = this.checkboxSelected.filter( ele =>{
               return ele.roleType == 1;
            })
                 
            console.log(adminArray.length)
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


    
     
    //**表格的checkbox */
     handleSelectionChange(val){
          
          if(val.length>1){
            this.checkboxSelected = val
          
            this.deletebutton = false
            return 
          }

          if(val.length == 1){
            this.checkboxSelected = val
           
            this.deletebutton = false
            return
          }

          this.checkboxSelected = []
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