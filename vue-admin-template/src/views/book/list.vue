<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图书列表</span>
      </div>
      <div class="text item">
        <el-input
          placeholder="请输入搜索内容"
          style="width: 20%"
          clearable
        ></el-input>
        <el-button type="primary" style="margin-left: 10px">搜索</el-button>
        <el-table ref="filterTable" :data="tableData" style="width: 100%">
          <el-table-column
            prop="publish_date"
            label="出版日期"
            sortable
            width="200"
            column-key="date"
          >
          </el-table-column>
          <el-table-column prop="author" label="作者" width="180">
          </el-table-column>
          <el-table-column prop="bookName" label="图书名"> </el-table-column>
          <el-table-column prop="publisher" label="出版社"> </el-table-column>
          <el-table-column prop="publish_status" label="发行状态">
          </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="tableData.length" style="float: right; margin-top: 5px">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      tableData: [
        {
          author: "王者",
          bookName: "测试123",
          publisher: "测试出版社123",
          publish_date: "2020-08-26T16:00:00.000Z",
          publish_status: "已发行",
        },
        {
          author: "王者",
          bookName: "测试123",
          publisher: "测试出版社123",
          publish_date: "2020-08-26T16:00:00.000Z",
          publish_status: "已发行",
        },
        {
          author: "王者",
          bookName: "测试123",
          publisher: "测试出版社123",
          publish_date: "2020-08-26T16:00:00.000Z",
          publish_status: "已发行",
        },
        {
          author: "王者",
          bookName: "测试123",
          publisher: "测试出版社123",
          publish_date: "2020-08-26T16:00:00.000Z",
          publish_status: "已发行",
        },
      ],
    };
  },
  methods: {
    resetDateFilter() {
      this.$refs.filterTable.clearFilter("date");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },
};
</script>