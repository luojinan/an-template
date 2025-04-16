<script setup lang="ts">
import { isExternal } from '@/utils/index'

defineOptions({
  name: 'AppLink',
  inheritAttrs: false,
})

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
})

const isExternalLink = computed(() => isExternal(props.to))

const type = computed(() => {
  return isExternalLink.value ? 'a' : 'router-link'
})

function linkProps(to: string) {
  return isExternalLink.value
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { to }
}
</script>

<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>
