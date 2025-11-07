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
    {{ col.formatFn ? col.formatFn(scope.row[col.prop], scope.row) : (scope.row[col.prop] || '-') }}
  </span>
</template>
