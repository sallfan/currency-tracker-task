<template>
  <v-card class="currency-list">
    <v-card-title class="header">
      <div class="title">Currency Rates</div>
      <div class="actions">
        <v-text-field
          class="search-input"
          v-model="search"
          placeholder="Search currency..."
          density="compact"
          hide-details
          clearable
        />
        <v-select
          class="sort-select"
          v-model="sortOrder"
          :items="sortOptions"
          label="Sort By"
          density="compact"
          hide-details
        />
        <v-btn class="update-btn" rounded @click="update">
          <v-icon start>mdi-refresh</v-icon>
          Update
        </v-btn>
      </div>
    </v-card-title>

    <v-table v-if="!isLoading && pagedCurrencies.length" class="table-container">
      <thead class="table-header">
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Rate (to USD)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="currency in pagedCurrencies" :key="currency.code">
          <td>{{ currency.code }}</td>
          <td>{{ currency.name }}</td>
          <td>{{ rates[currency.code]?.toFixed(4) ?? 'N/A' }}</td>
        </tr>
        <tr v-for="n in emptyRows" :key="'empty-' + n" class="empty-row">
          <td colspan="3" />
        </tr>
      </tbody>
    </v-table>

    <div v-if="!isLoading && !pagedCurrencies.length" class="empty-state">Not Found</div>

    <div v-if="isLoading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="48" />
      <span>Loading...</span>
    </div>

    <v-card-actions v-if="!isLoading && totalPages > 1" class="footer">
      <v-pagination v-model="page" :length="totalPages" rounded class="pagination" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currenciesStore.ts'

const store = useCurrencyStore()
const page = ref(1)
const perPage = 8
const search = ref('')
const sortOrder = ref('name-asc')
const isLoading = ref(true)

const sortOptions = [
  { title: 'Name (A → Z)', value: 'name-asc' },
  { title: 'Name (Z → A)', value: 'name-desc' },
  { title: 'Rate (Low → High)', value: 'rate-asc' },
  { title: 'Rate (High → Low)', value: 'rate-desc' },
]

const currencies = computed(() => store.currencies)
const rates = computed(() => store.rates)

const filteredCurrencies = computed(() => {
  if (!search.value) return currencies.value
  const term = search.value.toLowerCase()
  return currencies.value.filter(
    (c) => c.code.toLowerCase().includes(term) || c.name.toLowerCase().includes(term),
  )
})

const sortedCurrencies = computed(() => {
  return [...filteredCurrencies.value].sort((a, b) => {
    const rateA = rates.value[a.code] ?? 0
    const rateB = rates.value[b.code] ?? 0
    switch (sortOrder.value) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'rate-asc':
        return rateA - rateB
      case 'rate-desc':
        return rateB - rateA
      default:
        return 0
    }
  })
})

const totalPages = computed(() => Math.ceil(sortedCurrencies.value.length / perPage))
const pagedCurrencies = computed(() => {
  const start = (page.value - 1) * perPage
  return sortedCurrencies.value.slice(start, start + perPage)
})
const emptyRows = computed(() => perPage - pagedCurrencies.value.length)

watch([search, sortOrder], () => {
  page.value = 1
})

const update = async () => {
  isLoading.value = true
  await store.fetchRates()
  isLoading.value = false
}

onMounted(async () => {
  await store.updateAll()
  isLoading.value = false
})
</script>

<style scoped>
.currency-list {
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

.search-input {
  flex: 1;
}

.sort-select {
  max-width: 250px;
}

.update-btn {
  color: #ffffff;
  background-color: #235770;
}

.table-container {
  border-radius: 25px 25px 0 0;
  overflow: hidden;
}

.table-header {
  font-size: 20px;
  font-weight: bolder;
}

.empty-row td {
  height: 48px;
  border: none;
  background: transparent;
}

.empty-state,
.loading-state {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #5555;
}

.loading-state v-progress-circular {
  margin-bottom: 12px;
}

.footer {
  justify-content: center;
}

.pagination {
  width: 75%;
}
</style>
