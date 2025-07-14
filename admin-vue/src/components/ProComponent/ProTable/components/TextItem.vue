<script setup lang="ts">
interface Props {
  col: any
  scope: any
  tableProps?: any
}

defineProps<Props>()
</script>

<template>
  <span>
    {{ scope.row[col.prop] }}
  </span>
</template> 