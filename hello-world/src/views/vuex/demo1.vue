<template>
    <div>
        vuex数据中心的数据：{{data}}
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      data: this.$store.state.count
    }
  },
  computed: {
    ...mapState(['person']) 
  }
}
</script>
