<template>
    <div>
        <el-table :key="tableKey" :data="info">
          <el-table-column label="info" width="150px" align="center">
            <template slot-scope="{row}">
                <!-- 取出对象里数组数据v-for无报错 -->
              <!-- <span v-for="(item, index) in row.interface" :key="index" >
                {{ item.ip }}
              </span> -->
              {{row.interface[0].ip }}
            </template>
          </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return {
            info = [
                {"name": "a", "interfaces": ["ip": "1.1.1.1",]}, 
                {"name": "b","interfaces": ["ip": "2.2.2.2",]},
            ]
        }
    }
}
</script>