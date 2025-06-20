<script setup lang="ts">
import CurrencyList from '@/components/CurrencyList.vue'
import CurrencyConverter from '@/components/CurrencyConverter.vue'
import CurrencyChart from '@/components/CurrencyChart.vue'
</script>

<template>
  <main class="content">
    <CurrencyList class="list" />
    <aside class="actions">
      <CurrencyChart />
      <CurrencyConverter />
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

@media (max-width: 767px) {
  .content {
    flex-direction: column;
    padding: 16px;
    height: auto;
  }

  .list,
  .actions {
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1439px) {
  .content {
    flex-direction: column;
    padding: 16px;
    height: auto;
  }

  .list {
    width: 100%;
  }

  .actions {
    flex-direction: row;
    width: 100%;
  }
}
</style>
