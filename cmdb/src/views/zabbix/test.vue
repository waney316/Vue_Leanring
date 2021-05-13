<template>
  <div>
    <el-table
      :key="tableKey"
      :data="info"
    >
      <el-table-column
        label="info"
        width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          {{row.interface[0].ip }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      info: [
        {
          "interfaces": ["ip": "1.1.1.1"]
        },
        {
          "interfaces": ["ip": "2.2.2.2"]
        }
      ]
    }
  }
}
</script>