<script setup lang="ts">
import {BubblesUi} from './components'
</script>

<template>
  <BubblesUi :nodes="nodes" :links="links">
    <div>Test</div>
    <div>Test</div>
    <div>Test</div>
  </BubblesUi>
</template>

<script lang="ts">
export default {
  data: () => ({
    nodes: [
      { id: "Node 0", radius: 0.1, x: 0, y: 0 },
      { id: "Node 1", radius: 0.1, x: 0.25, y: 0.1 },
      { id: "Node 2", radius: 0.25, x: 0.5, y: 0.35 },
    ],
    links: []
  })
}
</script>