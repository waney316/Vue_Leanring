<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <ve-pie
      :data="chartData"
      radius=10
    ></ve-pie>
    <ve-line :data="chartData"></ve-line>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VeLine from 'v-charts/lib/line.common'
import Pie from 'v-charts/lib/pie.common'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: { VeLine },
  data () {
    return {
      chartData: {
        columns: ['date', 'PV'],
        rows: [
          { 'date': '01-01', 'PV': 1231 },
          { 'date': '01-02', 'PV': 1223 },
          { 'date': '01-03', 'PV': 2123 },
          { 'date': '01-04', 'PV': 4123 },
          { 'date': '01-05', 'PV': 3123 },
          { 'date': '01-06', 'PV': 7123 }
        ]
      }
    }
  }
}
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
</style>