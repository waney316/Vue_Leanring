<template>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(225, 243, 216);"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold">Zabbix数量</span>
          </div>
          <div class="text item" style="font-size: 30px">
            {{ this.total.zabbixTotal }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(179, 216, 255);"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold"
              >Prometheus数量</span
            >
          </div>
          <div class="text item" style="font-size: 30px">
            {{ this.total.promTotal }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(253, 246, 236)"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold">Alert数量</span>
          </div>
          <div class="text item" style="font-size: 30px">
            {{ this.total.alertTotal }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          class="box-card"
          shadow="hover"
          style="background: rgb(253, 226, 226);"
        >
          <div slot="header" class="clearfix">
            <span class="card_title" style="font-weight: bold"
              >OPS-PROXY数量</span
            >
          </div>
          <div class="text item" style="font-size: 30px">
            {{ this.total.opsTotal }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-card class="box-card" shadow="hover" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <h4>主机数量趋势</h4>
      </div>
      <div class="text item">
        <ve-line :data="chartData"></ve-line>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VeLine from "v-charts/lib/line.common";
import { getZabbixList } from "@/api/zabbix";
import { getPromList, getAlertList } from "@/api/prom";

export default {
  name: "Dashboard",
  components: { VeLine },
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      total: {
        zabbixTotal: 0,
        promTotal: 0,
        alertTotal: 0,
        opsTotal: 0
      },

      chartData: {
        columns: ["date", "total"],
        rows: [
          { date: "01-01", total: 1231 },
          { date: "01-02", total: 1223 },
          { date: "01-03", total: 2123 },
          { date: "01-04", total: 4123 },
          { date: "01-05", total: 3123 },
          { date: "01-06", total: 7123 }
        ]
      }
    };
  },
  mounted() {
    this.getTotalList();
  },
  methods: {
    getTotalList() {
      getZabbixList().then(response => {
        this.total.zabbixTotal = response.data.count;
      });
      getPromList().then(res => {
        this.total.promTotal = res.data.count;
      });
      getAlertList().then(response => {
        this.total.alertTotal = response.data.count;
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
</style>
