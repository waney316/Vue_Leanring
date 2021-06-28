<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>Alertmanager告警查询</span>
      </div>

      <transition name="slide-fade">
        <div class="text item" v-show="show">
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            :rules="rules"
            size="small"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="数据源" prop="dataSource">
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
                  </el-select> </el-form-item
              ></el-col>
              <el-col :span="8">
                <el-form-item label="查询类型" prop="type">
                  <el-select
                    v-model="form.type"
                    clearable
                    placeholder="请选择查询类型"
                    style="margin-left: 10px"
                  >
                    <el-option
                      v-for="item in typeOption"
                      :key="item.key"
                      :label="item.name"
                      :value="item.key"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item style="float: center">
                  <el-button type="primary" @click="submitForm('form')"
                    >创建查询</el-button
                  >
                  <el-button type="danger" @click="resetForm('form')"
                    >重置</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </transition>
      <div style="text-align:center; font-size: 12px" @click="show = !show">
        <i class="el-icon-arrow-up" v-show="show">隐藏查询条件</i>
        <i class="el-icon-arrow-down" v-show="!show">展开查询条件</i>
      </div>
    </el-card>

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
        <el-table-column label="资源池" align="center" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.source_room }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="数据源名称"
          prop="name"
          align="center"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="API地址" align="center" min-width="120">
          <template slot-scope="{ row }">
            <span>{{ row.url }}</span>
          </template>
        </el-table-column>

        <el-table-column label="告警地址" align="center" min-width="140">
          <template slot-scope="{ row }">
            <el-tag type="info" size="mini">{{ row.alert_url.name }}</el-tag>
            <!-- <span v-if="row.alert_url">{{ row.alert_url }}</span>
              <span v-else>Null</span> -->
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
</template>

<script>
import { getAlertList } from "@/api/prom";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        szie: 10
      },
      total: 0,
      form: {
        name: "", //prometheus数据源名称
        key: "" //查询键值
      },
      show: true,
      dataSourceOption: "",
      itemData: "",
      typeOption: "",
      pickerOptions: "",
      rules: {
        name: [{ required: true, message: "请选择数据源", trigger: "blur" }],
        type: [{ required: true, message: "请选择查询类型", trigger: "blur" }],
        key: [{ required: true, message: "请输入查询键值", trigger: "blur" }],
        time: [{ required: true, message: "必须选择时间范围", trigger: "blur" }]
      }
    };
  },

  mounted() {
    //页面挂载时获取所有数据源和prometheus对应的监控项键值
    this.getDataSourceList();
  },
  methods: {
    //获取alertmanager数据源
    getDataSourceList() {
      getAlertList().then(response => {
        if (response.code === 0) {
          this.dataSourceOption = response.data.results;
        }
      });
    },

    getList() {},

    //校验规则重置

    //提交查询表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
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
