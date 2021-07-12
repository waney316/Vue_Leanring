<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix report-title"
      >
        <span>任务ID: {{ task_id }}</span>
        <span>巡检时间: {{ task.create_time }}</span>
        <span>
          任务状态:
          <el-tag
            type="success"
            style="display: inline"
          >{{
            task.task_status
          }}</el-tag>
        </span>
        <span>任务描述：{{ task.task_desc }}</span>
      </div>
      <div
        v-for="item in list"
        :key="item.id"
        class="text item"
      >
        <el-collapse accordion>
          <el-collapse-item
            :title="item.ip"
            name="1"
          >
            <el-row>
              <el-col :span="12"><span>关联服务:</span>
                <el-tag
                  v-for="service in item.services"
                  :key="service"
                  size="mini"
                  style="margin-left: 5px"
                >{{ service }}</el-tag>
              </el-col>
            </el-row>
            <div class="report-result">
              <i class="el-icon-star-on"></i>
              <span>结果：{{ item.result }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTaskResult, getTaskHistory } from "@/api/tasks";
export default {
  data () {
    return {
      list: "",
      task: "",
      task_id: "",
      activeName: 1
    };
  },
  created () {
    this.task_id = this.$route.params.id;
    this.loadReport(this.$route.params.id);
    this.getTaskDetail()
  },
  mounted () { },
  methods: {

    //获取巡检任务详情
    getTaskDetail () {
      getTaskHistory({ task_id: this.$route.params.id }).then(res => {
        console.log(res);
        this.task = res.data.results[0]
      })
    },
    //获取报告结果
    loadReport (task_id) {
      getTaskResult({
        task_id: task_id
      }).then(response => {
        console.log(response.data);
        this.list = response.data.data;
      });
    }
  }
};
</script>

<style scoped>
.report-result {
  margin-top: 10px;
  height: 30px;
  font-size: 20px;
  color: #303133;
}
.report-title span {
  display: block;
  margin-top: 8px;
  font-size: 15px;
}
</style>
