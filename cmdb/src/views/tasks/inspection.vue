<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>监控巡检</span>
      </div>
      <div class="text item">
        <template>
          <el-table
            :data="cronTaskData"
            border
            fit
            highlight-current-row
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              label="任务ID"
              prop="task_id"
              align="center"
              class="columnColor"
              width="280"
            >
              <template slot-scope="{ row }">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="任务名称"
              prop="task_name"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="下次执行时间"
              prop="next_run_time"
              align="center"
              width="260"
            >
              <template slot-scope="{ row }">
                <span>{{ row.next_run_time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="主机范围"
              prop="hosts"
              align="center"
              width="260"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                <span>{{ row.hosts }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="备注"
              prop="remarks"
              align="center"
              width="310"
            >
              <template slot-scope="{ row }">
                <span>{{ row.remarks }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-card>
    <!-- 任务巡检结果 -->
    <el-card style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>监控巡检任务结果</span>
        <el-button
          type="primary"
          size="mini"
          round
          style="float: right"
          @click="getLoadDataHistory()"
          >刷新</el-button
        >
      </div>
      <div class="text item">
        <template>
          <el-table
            :data="tableData"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column
              label="巡检时间"
              prop="create_time"
              align="center"
              min-width="80"
            >
              <template slot-scope="{ row }">
                <span>{{ row.create_time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="任务ID"
              prop="task_id"
              align="center"
              min-width="80"
            >
              <template slot-scope="{ row }">
                <span>{{ row.task_id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="任务名称"
              prop="task_name"
              align="center"
              width="100"
            >
              <template slot-scope="{ row }">
                <span>{{ row.task_name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="任务状态"
              prop="task_status"
              align="center"
              width="120"
            >
              <template slot-scope="{ row }">
                <span v-if="row.task_status == 'FAILED'">
                  <el-tag type="danger">{{ row.task_status }}</el-tag>
                </span>
                <span v-else-if="row.task_status == 'SUCCESS'">
                  <el-tag type="success">{{ row.task_status }}</el-tag>
                </span>
                <span v-else>{{ row.task_status }}</span>
              </template>
            </el-table-column>

            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="listQuery.search"
                  size="mini"
                  placeholder="输入关键字搜索"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                    @click="getLoadDataHistory()"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleDetail(scope.row)"
                  >任务详情</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row, scope.$index)"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="handleDetails(scope.row)"
                  v-show="scope.row.task_status === 'SUCCESS'"
                  >报告预览</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getLoadDataHistory"
      />
    </el-card>

    <!-- 任务详情 -->
    <!-- 任务详情模态框 -->
    <el-dialog title="任务详情" :visible.sync="dialogTaskVisible">
      <el-form
        ref="detailForm"
        :model="rowTask"
        label-position="left"
        label-width="80px"
        size="mini"
        style="width: 80%; margin-left: 50px"
      >
        <el-form-item label="任务名称" prop="task_name">
          <el-input :disabled="true" v-model="rowTask.task_name" />
        </el-form-item>
        <el-form-item label="任务ID" prop="task_id">
          <el-input :disabled="true" v-model="rowTask.task_id" />
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-input :disabled="true" v-model="rowTask.create_time" />
        </el-form-item>
        <el-form-item label="任务类型" prop="task_type">
          <el-input :disabled="true" v-model="rowTask.task_type" />
        </el-form-item>
        <el-form-item label="任务详情" prop="task_desc">
          <el-input :disabled="true" type="text" v-model="rowTask.task_desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTaskVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCronTask, getTaskHistory, delTaskHistory } from "@/api/tasks";
import { getHostResource } from "@/api/cmdb";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      rowTask: {},
      //任务详情模态框
      dialogTaskVisible: false,
      tableRowClassName: "success-row",
      cronTaskData: [],
      hosts: [],
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      }
    };
  },
  created() {
    this.getInspectionCron();
    this.getLoadDataHistory();
  },
  mounted() {},
  methods: {
    getInspectionCron() {
      //获取主机资源
      getHostResource({
        size: 10000
      }).then(response => {
        var tempHosts = response.data.results;
        tempHosts.forEach(element => {
          this.hosts.push(element.ip);
        });
      });

      getCronTask().then(response => {
        this.cronTaskData = response.data;
        this.cronTaskData.forEach(element => {
          element["hosts"] = this.hosts;
        });
      });
    },

    getLoadDataHistory() {
      //添加请求属性
      Object.assign(this.listQuery, { task_type: "inspection" });
      getTaskHistory(this.listQuery).then(response => {
        this.total = response.data.count;
        this.tableData = response.data.results;
      });
    },
    handleDetail(row) {
      this.rowTask = Object.assign({}, row); // copy obj
      this.dialogTaskVisible = true;
    },
    //删除任务历史数据
    //删除任务历史数据
    handleDelete(row, index) {
      this.$confirm("此操作将永久删除该历史, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delTaskHistory(row.id).then(response => {
            console.log(response);
            if (response.code === 0) {
              this.$notify({
                title: "删除成功",
                message: response.message,
                type: "success"
              });
              //删除数据后返回第一页
              this.getLoadDataHistory();
            } else {
              this.$notify({
                title: "删除失败",
                message: response.message,
                type: "failed"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    handleDetails(row) {
      console.log(row);
      // this.$set(row, "downloadLoading", true);
      var id = row.task_id;
      let routeData = this.$router.resolve({
        path: `/tasks/report/${id}`
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
