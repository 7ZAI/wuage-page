   
<template>
  <div class="app-container">
      <div class="filter-container" >
        <el-input v-model="listQuery.keywords" placeholder="日志标题"  size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        
        <el-select v-model="listQuery.status" size="small" placeholder="结果类型" clearable class="filter-item" style="width: 130px;height:40px;">
        <el-option v-for="item in resultTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

       <el-date-picker
        size="small"
        v-model="listQuery.startTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始日期时间">
    </el-date-picker>

     <el-date-picker
     size="small"
      v-model="listQuery.endTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择结束日期时间">
    </el-date-picker>
        <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select> -->
        
        <el-button size="small"  v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
         <el-button style="background-color:white;color:black;" class="filter-item" size="small" type="primary" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
      </div>


    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="logList"
       style="width: 100%;margin-top:1.5rem;"
      border=""
      fit
      highlight-current-row
      
    >
     <!-- <el-table-column  type="selection"  width="55">
     </el-table-column> -->

     <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>

      <el-table-column label="日志标题" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="url"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip地址"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.ipString }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logTime" label="时间" :formatter="formatTimeRemoveT" width="auto"  align="center">
        <template slot-scope="{row}">
                <span>{{ row.logTime }}</span>
          </template>
      </el-table-column>
      <el-table-column label="花费时间(s)"  width="auto"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.costTime }}</span>
        </template>

      </el-table-column>

      <el-table-column label="结果"  width="auto"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.resultType == 0?"成功":"失败" }}</span>
        </template>

      </el-table-column>

     
      <el-table-column label="操作人" type="index" width="auto" align="center">
         <template slot-scope="{row}">
          <span>{{ row.operatorName }}</span>
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
   
  </div>
</template>
<script>

import { getLogs} from "@/api/systemLog"
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { MessageBox, Message } from 'element-ui'
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { reject } from 'q';



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
            status:'',
            ascKeys: [],
            descKeys: [],
            startTime:'',
            endTime:'',
            keywords:undefined
        },
        
         resultTypeOptions:[
           {key:0,display_name:'成功'},
          {key:1,display_name:'失败'},
        ],
        tableKey: "logId",
        total:0,
        logList:[],
        

       
    };
  },

  created() {
    this.getData();
   
  },

  methods: {


      getData(){
        this.listLoading = true
        let data = this.listQuery
        getLogs(data).then(response => {
            console.log(response.data)
            this.logList = response.data.logs
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
        this.listQuery.page = 1
        this.getData()
      },

      handleReset(){
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
       this.listQuery.status = ''
       this.listQuery.keywords = ''
    },
     

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