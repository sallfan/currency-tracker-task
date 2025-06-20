<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore.ts'
import { sortCurrencies, sortOptions, type SortOrder } from '@/utils/sortCurrencies.ts'
import searchCurrencies from '@/utils/searchCurrencies.ts'

const currencyStore = useCurrencyStore()

const page = ref<number>(1)
const PER_PAGE = 7

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
      <h1 class="title">
        Currency Rates
        <v-btn class="update-btn" icon @click="update" variant="text">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </h1>

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
      </div>
    </v-card-title>

    <main>
      <div v-if="currencyStore.isFailed" class="placeholder">Failed to get currencies data.</div>

      <div v-else-if="currencyStore.isLoading" class="placeholder">
        <v-progress-circular indeterminate color="primary" />
        Loading...
      </div>

      <div v-else-if="!pagedCurrencies.length" class="placeholder">Not Found</div>

      <v-table v-else class="table-container">
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #ffffff;
  background-color: #598aa1;
  padding: 16px;
}

.title {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 900;
}

.actions {
  display: flex;
  width: 100%;
  gap: 12px;
}

.update-btn {
  color: #ffffff;
  margin-left: auto;
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

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  .title {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 18px;
    padding: 6px 12px;
  }

  .actions {
    width: 100%;
    gap: 8px;
  }

  .search-input,
  .sort-select {
    width: 100% !important;
  }

  .update-btn {
    padding: 8px;
    margin-left: auto;
  }

  .table-header {
    font-size: 16px;
  }
  .table-container {
    font-size: 14px;
  }
}

@media (max-width: 425px) {
  .title {
    font-size: 18px;
    padding: 4px 8px;
  }

  .actions {
    flex-direction: column;
  }

  .update-btn {
    height: 24px !important;
    padding: 0;
  }

  .table-header {
    font-size: 14px;
  }

  .table-container {
    font-size: 12px;
  }

  .placeholder {
    font-size: 14px;
  }
}
</style>
