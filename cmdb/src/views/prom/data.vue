<template>
  <div class="app-container">
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <span>PromQL数据查询</span>
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
            szie="mini"
          >
            <el-form-item
              label="数据源"
              prop="dataSource"
            >
              <el-select
                v-model="form.name"
                clearable
                placeholder="请选择数据源"
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
            <el-form-item
              label="查询类型"
              prop="type"
            >
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
            <el-form-item
              label="监控项"
              prop="item"
            >
              <el-select
                v-model="form.key"
                clearable
                allow-create
                filterable
                placeholder="请选择监控项或手动输入"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="i in itemData"
                  :key="i.id"
                  :label="i.name"
                  :value="i.key"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="时间范围"
              prop="time"
              v-if="form.type='query_range'"
            >
              <div class="block">
                <el-date-picker
                  v-model="form.time"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  clearable
                  value-format="timestamp"
                  align="right"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <!-- <el-form-item
              label="查询IP"
              prop="hosts"
            >
              <el-input
                type="textarea"
                v-model="form.hosts"
              ></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('form')"
              >创建查询</el-button>
              <el-button
                type="danger"
                @click="resetForm('form')"
              >重置</el-button>
            </el-form-item>
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
  </div>
</template>


<script>
import { getPromList, getPromActionList } from "@/api/prom"
import { getItemList } from "@/api/cmdb"
export default {
  data () {
    return {
      form: {
        name: "",  //prometheus数据源名称
        key: "" //查询键值

      },
      show: true,
      dataSourceOption: "",
      itemData: "",
      typeOption: "",
      pickerOptions: "",
      rules: {
        name: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择查询类型", trigger: "blur" }
        ],
        key: [
          { required: true, message: "请输入查询键值", trigger: "blur" }
        ],
        time: [{ required: true, message: "必须选择时间范围", trigger: "blur" }]
      }
    }
  },

  mounted () {
    //页面挂载时获取所有数据源和prometheus对应的监控项键值
    this.getDataSourceList()
    this.getPromItemList()
    this.getActionList()

  },
  methods: {
    //获取promethues数据源
    getDataSourceList () {
      getPromList().then(response => {
        if (response.code === 0) {
          this.dataSourceOption = response.data.results
        }
      })
    },

    //获取监控键值
    getPromItemList () {
      getItemList({ type: "prometheus" }).then(response => {
        this.itemData = response.data.results
      })
    },

    //获取监控键值
    getActionList () {
      getPromActionList().then(response => {
        console.log(response.data);
        this.typeOption = response.data
      })
    },


    //校验规则重置


    //提交查询表单
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
}
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
