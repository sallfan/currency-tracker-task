<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore'
import { useHistoryStore } from '@/stores/historyStore'

import ConversionHistoryModal from '@/components/ConversionHistoryModal.vue'
import SelectCurrency from '@/components/SelectCurrency.vue'
import { convertRate } from '@/utils/convertRate'

const currencyStore = useCurrencyStore()
const historyStore = useHistoryStore()

const fromCurrencyCode = ref<string>()
const toCurrencyCode = ref<string>()

const amount = ref<number | null>(null)
const result = ref<number | null>(null)
const showHistoryModal = ref(false)

const isWaiting = ref(false)
let waitingTimeout: ReturnType<typeof setTimeout> | null = null
const WAITING_DELAY = 1000

const fromCurrency = computed(() =>
  currencyStore.currencies.find((c) => c.code === fromCurrencyCode.value),
)
const toCurrency = computed(() =>
  currencyStore.currencies.find((c) => c.code === toCurrencyCode.value),
)

const canConvert = computed(
  () =>
    !currencyStore.isLoading &&
    amount.value !== null &&
    amount.value > 0 &&
    fromCurrency.value?.rate &&
    toCurrency.value?.rate,
)

function convert() {
  if (!canConvert.value) {
    result.value = null
    return
  }

  result.value = convertRate(amount.value!, fromCurrency.value, toCurrency.value)

  isWaiting.value = false

  historyStore.addConversion({
    fromCurrency: fromCurrencyCode.value!,
    toCurrency: toCurrencyCode.value!,
    amount: amount.value!,
    result: result.value!,
  })
}

function swapCurrencies() {
  const temp = fromCurrencyCode.value
  fromCurrencyCode.value = toCurrencyCode.value
  toCurrencyCode.value = temp
}

const formattedResult = computed(() => (result.value !== null ? result.value.toFixed(4) : ''))

watch([fromCurrencyCode, toCurrencyCode, amount], () => {
  if (waitingTimeout) {
    clearTimeout(waitingTimeout)
  }

  if (!canConvert.value) {
    result.value = null
    isWaiting.value = false
    return
  }

  isWaiting.value = true

  waitingTimeout = setTimeout(() => {
    convert()
  }, WAITING_DELAY)
})

watch(
  () => currencyStore.isLoading,
  (updated) => {
    isWaiting.value = updated
  },
)
</script>

<template>
  <v-card class="converter">
    <v-card-title class="header">
      <div class="title">Converter</div>
      <div class="actions">
        <v-btn class="history-btn" icon @click="showHistoryModal = true" variant="text">
          <v-icon size="32">mdi-history</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <main class="body">
      <div class="input-row">
        <SelectCurrency v-model="fromCurrencyCode" label="From" :width="200" />

        <v-btn icon variant="plain" @click="swapCurrencies" class="swap-btn">
          <v-icon>mdi-swap-horizontal</v-icon>
        </v-btn>

        <SelectCurrency v-model="toCurrencyCode" label="To" :width="200" />
      </div>

      <div class="input-row">
        <v-text-field
          v-model.number="amount"
          width="200"
          min="0"
          label="Amount"
          type="number"
          hide-details
          clearable
        />

        <v-progress-circular v-if="isWaiting && !currencyStore.isFailed" indeterminate color="primary" size="40" />
        <div style="width: 40px; height: 40px" v-else />

        <v-text-field v-model="formattedResult" width="200" label="Result" readonly hide-details />
      </div>
    </main>

    <ConversionHistoryModal v-model="showHistoryModal" />
  </v-card>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: #ffffff;
  background-color: #73aea7;
  padding: 8px 16px;
}

.title {
  font-size: 20px;
  font-weight: 900;
  border-radius: 25px;
}

.actions {
  display: flex;
  flex: 1;
  gap: 12px;
}

.history-btn {
  margin-left: auto;
  color: #ffffff;
}

.body {
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
}

.swap-btn {
  min-width: 40px;
  font-size: 24px;
}

.input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
}
</style>
