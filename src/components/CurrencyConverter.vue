<template>
  <v-card class="converter">
    <v-card-title class="header">
      <div class="title">Converter</div>
      <div class="actions">
        <v-btn class="history-btn" rounded @click="">
          <v-icon start>mdi-history</v-icon>
          History
        </v-btn>
      </div>
    </v-card-title>

    <main class="body">
      <div class="input">
        <v-select
          class="currency-select"
          v-model="fromCurrency"
          :items="currencyCodes"
          label="From"
          clearable
        />
        <v-text-field
          v-model.number="amount"
          label="Amount"
          type="number"
          hide-details
        />
      </div>
      <v-btn icon variant="plain" @click="swapCurrencies" class="swap-btn">
        <v-icon>mdi-swap-horizontal</v-icon>
      </v-btn>
      <div class="input">
        <v-select
          class="currency-select"
          v-model="toCurrency"
          :items="currencyCodes"
          label="To"
          clearable
        />
        <v-text-field
          v-model="formattedResult"
          label="Result"
          readonly
          hide-details
        />
      </div>
    </main>

    <v-card-actions class="footer">
      <v-btn
        class="convert-btn"
        @click="convert"
        :disabled="!canConvert"
        rounded
      >
        Convert
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCurrencyStore } from '@/stores/currenciesStore.ts'

const store = useCurrencyStore()

const fromCurrency = ref('')
const toCurrency = ref('')
const amount = ref<number | null>(null)
const result = ref<number | null>(null)

const currencyCodes = computed(() => Object.keys(store.rates))

const canConvert = computed(() =>
  fromCurrency.value && toCurrency.value && amount.value !== null && store.rates[fromCurrency.value] && store.rates[toCurrency.value]
)

function convert() {
  if (!canConvert.value) return

  const rateFrom = store.rates[fromCurrency.value]
  const rateTo = store.rates[toCurrency.value]

  result.value = (amount.value! / rateFrom) * rateTo
}

function swapCurrencies() {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
}

const formattedResult = computed(() =>
  result.value !== null ? result.value.toFixed(4) : ''
)

</script>

<style scoped>
.converter {
  border-radius: 25px;
  overflow: hidden;
  background: #ffffff;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: #ffffff;
  background-color: #598aa1;
  padding: 16px;
}

.title {
  font-size: 24px;
  font-weight: 900;
  padding: 8px 16px;
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
  background-color: #235770;
}

.body {
  display: flex;
  padding: 16px;
  gap: 16px;
}

.input {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 200px;
}

.swap-btn {
  min-width: 40px;
}

.convert-btn {
  font-weight: 700;
  background-color: #1eaabc;
  color: #ffffff;
}

.footer {
  justify-content: center;
  padding: 0;
}

</style>
