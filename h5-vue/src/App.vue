<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router';
const router = useRouter();
const onClick = () => {
  router.back();
}
</script>

<template>
  <nut-navbar title="Title" left-show @click-back="onClick"></nut-navbar>

  <RouterView />
</template>
