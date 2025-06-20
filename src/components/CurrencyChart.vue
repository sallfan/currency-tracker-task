<script setup lang="ts">
import { computed } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore'
import { useHistoricalRatesStore } from '@/stores/historicalRatesStore'

import VChart from 'vue-echarts'

import SelectCurrency from '@/components/SelectCurrency.vue'

const currencyStore = useCurrencyStore()
const historicalRatesStore = useHistoricalRatesStore()

const selectedCurrencyCode = computed({
  get: () => historicalRatesStore.currencyCode,
  set: (val) => (historicalRatesStore.currencyCode = val),
})

const chartConfigs = computed(() => {
  const rates = historicalRatesStore.historicalRates
  const code = historicalRatesStore.currencyCode

  if (!code || rates.length === 0) return {}

  return {
    title: {
      text: `${code} rate dynamics (to USD)`,
      left: 'center',
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: rates.map((r) => r.date),
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
    },
    series: [
      {
        name: code,
        type: 'line',
        data: rates.map((r) => r.rate),
        lineStyle: { width: 3 },
      },
    ],
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
  }
})
</script>

<template>
  <v-card>
    <v-card-title class="header">
      <div class="title">Chart</div>
      <div class="actions">
        <SelectCurrency v-model="selectedCurrencyCode" label="Show" :width="200" />
      </div>
    </v-card-title>

    <main class="body">
      <div v-if="currencyStore.isFailed" class="placeholder">Failed to get currencies data.</div>

      <div
        v-else-if="historicalRatesStore.isLoading || currencyStore.isLoading"
        class="loading-state"
      >
        <v-progress-circular indeterminate color="primary" size="48" />
        <span>Loading...</span>
      </div>

      <div v-else-if="!selectedCurrencyCode" class="placeholder">Select currency</div>

      <v-chart
        v-else-if="chartConfigs && chartConfigs.series"
        :option="chartConfigs"
        autoresize
        class="chart"
      />
    </main>
  </v-card>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: #fff;
  background: #73aea7;
  padding: 8px 16px;
}
.title {
  font-size: 20px;
  font-weight: 900;
}
.actions {
  display: flex;
  gap: 12px;
}
.body {
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
}
.chart {
  height: 300px;
}
.placeholder,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #5555;
  height: 300px;
}
</style>
