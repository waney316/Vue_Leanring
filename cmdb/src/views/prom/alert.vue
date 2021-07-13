<template>
  <div class="app-container">
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <span>Alertmanager告警查询</span>
      </div>

      <transition name="slide-fade">
        <div
          class="text item"
          v-show="show"
        >
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            :rules="rules"
            size="small"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item
                  label="数据源"
                  prop="dataSource"
                >
                  <el-select
                    v-model="form.name"
                    clearable
                    placeholder="请选择告警数据源"
                    style="margin-left: 10px"
                  >
                    <el-option
                      v-for="item in dataSourceOption"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item style="float: center">
                  <el-button
                    type="primary"
                    @click="submitForm('form')"
                  >创建查询</el-button>
                  <el-button
                    type="danger"
                    @click="resetForm('form')"
                  >重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </transition>
      <div
        style="text-align:center; font-size: 12px"
        @click="show = !show"
      >
        <i
          class="el-icon-arrow-up"
          v-show="show"
        >隐藏查询条件</i>
        <i
          class="el-icon-arrow-down"
          v-show="!show"
        >展开查询条件</i>
      </div>
    </el-card>

    <div v-if="form.name">
      <el-card style="margin-top: 10px">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%; margin-top:10px"
        >
          <el-table-column
            type="expand"
            label="标签"
            width="60"
          >
            <template slot-scope="props">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-row>
                  <template v-for="(item, key, index) in props.row.labels">
                    <el-col
                      :span="6"
                      :key="index"
                    >
                      <el-form-item :label="key">
                        <span>{{ item }}</span>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="告警时间"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.startsAt }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="告警内容"
            prop="name"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.annotations.summary }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="告警状态"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <el-tag type="danger"><span>{{ row.status.state }}</span></el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="接收组"
            align="center"
            min-width="140"
          >
            <template slot-scope="{ row }">
              <template v-for="(receiver,index) in row.receivers">

                <el-tag
                  type="info"
                  size="mini"
                  style="margin-left: 5px"
                  :key="index"
                >{{ receiver }}</el-tag>

              </template>

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
      </el-card>
    </div>

    <div
      v-else
      style="text-align: center; font-size: 28px; padding-top: 30px; padding-bottom: 30px;color: #ddd;height: 30px"
    >
      请选择数据源，来加载数据
    </div>
  </div>
</template>

<script>
import { getAlertList, alertQuery } from "@/api/prom";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data () {
    return {
      tableKey: 0,
      list: [],
      listLoading: false,
      listQuery: {
        page: 1,
        szie: 10
      },
      total: 0,
      form: {
        method: "alerts"
      },
      show: true,
      dataSourceOption: "",
      rules: {
        name: [{ required: true, message: "请选择数据源", trigger: "blur" }]
      }
    };
  },

  mounted () {
    //页面挂载时获取所有数据源和prometheus对应的监控项键值
    this.getDataSourceList();
  },
  methods: {
    //获取alertmanager数据源
    getDataSourceList () {
      getAlertList().then(response => {
        if (response.code === 0) {
          this.dataSourceOption = response.data.results;
        }
      });
    },

    getList () {
      alertQuery(this.form, this.listQuery).then(res => {
        console.log(res);
        if (res.code === 0) {
          this.list = res.data.results
          this.total = res.data.count
          this.listLoading = false
        } else {
          this.$message.error('查询失败');
        }
      })
    },

    //校验规则重置

    //提交查询表单
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.listLoading = true
          alertQuery(this.form).then(res => {
            console.log(res);
            if (res.code === 0) {
              this.list = res.data.results
              this.total = res.data.count
              this.listLoading = false
            } else {
              this.$message.error('查询失败');
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置表单
    resetForm (formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
    },
  }
};
</script>

<style scoped lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
