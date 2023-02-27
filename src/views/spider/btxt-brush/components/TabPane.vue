<template>
  <div>
    <el-table v-loading="loading" :data="rows" border fit highlight-current-row style="width: 100%" height="465">

      <el-table-column
        v-for="column in columns"
        :key="column.value"
        width="180px"
        align="center"
        sortable
        :prop="column.value"
        :label="column.key"
        :filters="getFilters(column.value)"
        :filter-method="filterHandler"
      >

        <template slot-scope="scope">
          <span>{{ scope.row[column.value] }}</span>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStepResultDetail } from '@/api/spider'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: null,
      columns: [],
      rows: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getStepResultDetail(this.type).then(response => {
        this.columns = response.data.columns
        this.rows = response.data.result
        this.loading = false
      })
    },
    getFilters(key) {
      const filters = []
      const values = []
      const valueMap = {}
      for (const row in this.rows) {
        const value = this.rows[row][key]
        if (values.includes(value)) {
          valueMap[value].count += 1
          continue
        }
        valueMap[value] = { text: this.rows[row][key], value: value, count: 1 }
        values.push(value)
      }
      Object.values(valueMap).forEach(item => {
        filters.push({ text: item.text + '| count: ' + item.count, value: item.value })
      })
      console.log('Array.from(new Set(filters))')
      return Array.from(new Set(filters))
    },
    filterHandler(value, row, column) {
      console.log('value, row, column')
      const property = column['property']
      return row[property] === value
    }
  }
}
</script>

