<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>告警查询</span>
      </div>
      <div class="text item">

        <div class="filter-container">
          <span>数据源</span>

          <el-select
            v-model="temp.dataSource"
            clearable
            placeholder="请选择数据源"
            style="margin-left: 10px"
            @change="getList"
          >
            <el-option
              v-for="item in dataSourceOption"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>

          <span style="margin-left: 15px">告警名称</span>
          <el-input
            v-model="listQuery.name"
            placeholder="请输入告警名称"
            style="width: 200px; margin-left: 5px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <span style="margin-left: 15px">主机</span>
          <el-input
            v-model="listQuery.name"
            placeholder="请输入主机"
            style="width: 200px; margin-left: 5px"
            class="filter-item"
          />

          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            style="margin-left: 5px"
          >
            搜索
          </el-button>

          <div
            style="float: right"
            v-show="showButton"
          >
            <el-button
              type="success"
              icon="el-icon-upload"
            >
              导出
            </el-button>
          </div>
        </div>
        <div v-if="temp.dataSource">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%; margin-top:10px"
            @selection-change="handleSelectionChange"
          >

            <el-table-column
              label="问题时间"
              prop="clock"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <span>{{ row.clock|transTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="告警级别"
              align="center"
              width="90"
            >
                <template slot-scope="{ row }" >
                  <!-- :style="{background: row.severity=='严重'? '#E97659':row.severity=='一般严重'?'#FFA059': '#ED3F14'}" -->
                  <div :class="addAlertLevel(row.severity)" width="20px">
                    <span >{{ row.severity }}</span>
                  </div>
                </template>

            </el-table-column>
            <el-table-column
              label="主机"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.host }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="告警名称"
              prop="name"
              align="center"
              min-width="200"
            >
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>


            <el-table-column
              label="是否恢复"
              align="center"
              min-width="40"
            >
              <template slot-scope="{ row }">
                <span>{{ row.r_eventid }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="恢复时间"
              align="center"
              width="120"
            >
              <template slot-scope="{ row }">
                <span>{{ row.r_clock|transTime }}</span>
              </template>
            </el-table-column>


          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.size"
            @pagination="getList"
          />
        </div>
        <div
          v-else
          style="text-align: center; font-size: 20px; padding-top: 30px; padding-bottom: 30px"
        >
          请选择数据源，来加载数据
        </div>

      </div>
    </el-card>


  </div>
</template>

<script>

//分类的增删改查
import {
  getZabbixList, listAlerts, listHostGroup
} from '@/api/zabbix'

import moment from 'moment'
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "zabbixAlert",
  components: { Pagination },
  directives: { waves },
  data () {
    return {

    
      //多选框选中
      multipleSelection: [],
      templateids: [],

      //是否显示按钮
      showButton: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        //分页向后端传递的参数
        page: 1,
        size: 50,
      },
      dialogFormVisible: false,
      //数据源选择
      dataSourceOption: [],
      temp: {
        dataSource: undefined
      },
      downloadLoading: false,

      rules: {
        name: [
          { required: true, message: "模板名称必须填写", trigger: "blur" },
        ],
      },
    };
  },
  //页面刷新时执行
  created () {
    this.getDataSourceList();
  },

  methods: {
    // 获取告警列表
    getList () {
      if (this.temp.dataSource) {
        this.listLoading = true;
        //将查询参数传递给后端
        listAlerts(this.listQuery, this.temp).then((response) => {
          // console.log(this.listQuery);
          // console.log(this.temp);
          console.log(response);
          console.log(response.data);
          this.list = response.data.results;
          this.total = response.data.count;
          this.listLoading = false
          //显示删除导出按钮
          this.showButton = true
        });
      } else {
        this.showButton = false
      }

    },

    //搜索查询
    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },

    //表格多选框选中
    handleSelectionChange (row) {
      this.multipleSelection = row;
    },
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        // console.log(response.data)
        this.dataSourceOption = response.data.results
      })
    },

    addAlertLevel(level){
      console.log(level);
      switch(level){
        case "未分类": return "notclassify";
        case "信息": return "infomation";
        case "警告": return "warning";
        case "一般严重": return 'average';
        case "严重": return 'high';
        case "灾难": return "danger";
      }
    }

  },
};
</script>



<style lang="scss">
.notclassify {
    font-weight: bold;
    border-radius: 30px;

    background-color: "#97AAB3";
}
.infomation {
    font-weight: bold;
    border-radius: 30px;
    background-color: "#7499FF";  
}
.warning {
    font-weight: bold;
    border-radius: 30px;
    background-color: "#FFC859";
}
.average {
    font-weight: bold;
    border-radius: 30px;
    background-color: "#FFA059";
}
.high >>> span{
    font-weight: bold;
    border-radius: 30px;
        border: 2px solid salmon;;
    background-color: "#E97659" !important 
}
.disaster {
    font-weight: bold;
    border-radius: 30px;
    background-color: "E45959";
}
</style>
