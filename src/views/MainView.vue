<script setup lang="ts">
import CurrencyList from '@/components/CurrencyList.vue'
import CurrencyConverter from '@/components/CurrencyConverter.vue'
</script>

<template>
  <main class="content">
    <CurrencyList class="list" />
    <aside class="actions">
      <CurrencyConverter/>
      <CurrencyConverter/>
    </aside>
  </main>
</template>

<style scoped>
.content {
  display: flex;
  gap: 16px;
  padding: 32px;
  background-color: #c7dee8;
  height: 100vh;
  width: 100vw;
}

.list {
  width: 65%;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 35%;
}

</style>
