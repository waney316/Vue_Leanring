<template>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(225, 243, 216);height: 200px"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold">北京时间</span>
          </div>
          <div class="text item dateContent">
            <span>{{ date }}</span>
            <span>{{ time }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(179, 216, 255); height: 200px"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold">CPU使用率</span>
          </div>
          <div class="text item">
            <ve-gauge
              :data="cpuData"
              width="220px"
              height="180px"
              style="top: -30px;left: 10px"
              :settings="chartsetting"
            >
            </ve-gauge>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(253, 246, 236); height: 200px"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold">内存使用率</span>
          </div>
          <div class="text item" style="font-size: 30px">
            <ve-gauge
              width="220px"
              height="180px"
              style="top: -30px;left: 10px"
              :data="memoryData"
              :settings="chartsetting"
            >
            </ve-gauge>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(253, 226, 226);height: 200px"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold">系统负载</span>
          </div>
          <div class="text item dateContent">
            <span style="font-size: 50px">{{ loadData }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- API请求访问曲线图 -->
    <el-card class="box-card" shadow="hover" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <h4>API请求成功与失败统计</h4>
      </div>
      <div class="text item">
        <ve-line :data="chartData" :settings="lineSettings"></ve-line>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VeLine from "v-charts/lib/line.common";
import VeGauge from "v-charts/lib/gauge.common";
import { getDashboard } from "@/api/system";

export default {
  name: "Dashboard",
  components: { VeLine, VeGauge },
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      date: "",
      time: "",
      chartsetting: {
        dataType: { 占比: "percent" },
        seriesMap: {
          占比: {
            min: 0,
            max: 1,
            detail: {
              fontSize: 20
            },
            axisLabel: {
              fontSize: 9
            },
            pointer: {
              width: 4 //指针的宽度
              // shadowColor: "#fff",
              // shadowBlur: 5
            },
            splitLine: {
              //分割线-> 刻度线
              length: 8, //数字距离刻度线的位置
              lineStyle: {
                width: 1,
                color: "#fff", //刻度线颜色
                shadowColor: "#fff", //刻度阴影
                shadowBlur: 10 //模糊阴影大小 配合shadowColor,shadowOffsetX, shadowOffsetY设置使用
              }
            },
            axisTick: {
              //刻度 线
              length: 0, //刻度线长度
              lineStyle: {
                color: "auto", //颜色
                shadowColor: "#fff",
                shadowBlur: 10
              }
            },
            radius: "85%",
            axisLine: {
              //仪表盘轴线
              lineStyle: {
                color: [
                  [0.2, "green"],
                  [0.8, "#E6A23C"],
                  [1, "red"]
                ],
                width: 1, //环圆线宽
                shadowColor: "#fff",
                shadowBlur: 10
              }
            }
          }
        }
      },
      //cpu数据
      cpuData: {
        columns: ["type", "value"],
        rows: [{ type: "占比", value: 0 }]
      },
      //内存数据
      memoryData: {
        columns: ["type", "value"],
        rows: [{ type: "占比", value: 0 }]
      },
      //负载数据
      loadData: "",

      //折线图数据
      lineSettings: {
        xAxisType: "time",
        labelAlias: {
          success: "成功",
          fail: "失败"
        }
      },
      chartData: {
        columns: ["date", "success", "fail"],
        rows: []
      }
    };
  },

  mounted() {
    this.getDashboardData();
    this.getdate();
    this.timer = setInterval(() => {
      this.getdate();
    }, 1000);
  },
  beforeDestroy: function() {
    //实例销毁前定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    getdate: function() {
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let week = weeks[time.getDay()];
      this.getTime();
      this.date = year + "/" + month + "/" + day + " " + week;
    },
    getTime: function() {
      let time = new Date();
      let hour = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();

      //如果小时/分钟/秒小于10
      hour = hour < 10 ? "0" + hour : hour;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.time = hour + " : " + minutes + " : " + seconds;
    },

    //获取dashboard数据
    getDashboardData() {
      getDashboard().then(res => {
        this.chartData.rows = res.data.line;
        console.log(res.data);
        this.cpuData.rows[0].value = res.data.cpu;
        this.memoryData.rows[0].value = res.data.memory;
        this.loadData = res.data.load;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.card_title {
  font-size: 14px;
  line-height: 22px;
}
.dateContent span {
  margin-top: 10px;
  display: block;
  height: 30px;
  font-size: 25px;
}

.dateContent {
  text-align: center;
}
</style>
