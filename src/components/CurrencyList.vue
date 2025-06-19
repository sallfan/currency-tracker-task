<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore.ts'
import { sortCurrencies, sortOptions, type SortOrder } from '@/utils/sortCurrencies.ts'
import searchCurrencies from '@/utils/searchCurrencies.ts'

const currencyStore = useCurrencyStore()

const page = ref<number>(1)
const PER_PAGE = 8

const search = ref('')
const sortBy = ref<SortOrder>('name-asc')

const filteredCurrencies = computed(() => {
  return searchCurrencies(currencyStore.currencies, search.value)
})
const sortedCurrencies = computed(() => {
  return sortCurrencies(filteredCurrencies.value, sortBy.value)
})

const totalPages = computed(() => Math.ceil(sortedCurrencies.value.length / PER_PAGE))
const pagedCurrencies = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return sortedCurrencies.value.slice(start, start + PER_PAGE)
})
const emptyRows = computed(() => PER_PAGE - pagedCurrencies.value.length)

watch([search, sortBy], () => {
  page.value = 1
})

const update = async () => {
  await currencyStore.fetchCurrencies()
}

onMounted(update)
</script>

<template>
  <v-card class="currency-list">
    <v-card-title class="header">
      <h1 class="title">Currency Rates</h1>

      <div class="actions">
        <v-text-field
          width="50%"
          class="search-input"
          v-model="search"
          placeholder="Search..."
          density="compact"
          hide-details
          clearable
        />
        <v-select
          width="40%"
          class="sort-select"
          v-model="sortBy"
          :items="sortOptions"
          label="Sort By"
          density="compact"
          hide-details
        />
        <v-btn class="update-btn" @click="update">
          <v-icon start>mdi-refresh</v-icon>
          Update
        </v-btn>
      </div>
    </v-card-title>

    <main>

      <div v-if="currencyStore.isFailed" class="placeholder">Failed to get currencies data.</div>

      <div v-else-if="currencyStore.isLoading" class="placeholder">
        <v-progress-circular indeterminate color="primary" size="64" />
        Loading...
      </div>

      <div v-else-if="!pagedCurrencies.length" class="placeholder">Not Found</div>

      <v-table v-else>
        <thead class="table-header">
          <tr>
            <th class="column-code">Code</th>
            <th class="column-name">Name</th>
            <th class="column-rate">Rate (to {{ currencyStore.ratesBase }})</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="currency in pagedCurrencies" :key="currency.code">
            <td>{{ currency.code }}</td>
            <td>{{ currency.name }}</td>
            <td>{{ currency.rate }}</td>
          </tr>
          <tr v-for="n in emptyRows" :key="'empty-' + n" class="empty-row">
            <td colspan="3" />
          </tr>
        </tbody>
      </v-table>
    </main>

    <v-card-actions v-if="!currencyStore.isLoading && totalPages > 1" class="footer">
      <v-pagination v-model="page" :length="totalPages" rounded class="pagination" />
    </v-card-actions>
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

.update-btn {
  color: #ffffff;
  background-color: #235770;
}

.table-header {
  font-size: 22px;
}

.column-code {
  width: 20%;
}

.column-name {
  width: 40%;
}

.table-container tbody tr:hover {
  background-color: #f0f0f0;
  transition: background-color 0.2s;
}

.empty-row td {
  height: 48px;
  border: none;
  background: transparent;
}

.placeholder {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #5555;
  height: 75%;
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
