<script setup lang="ts">
import { useHistoryStore } from '@/stores/historyStore.ts'

defineProps<{
  modelValue: boolean
}>()

defineEmits(['update:modelValue'])

const historyStore = useHistoryStore()
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card>
      <v-card-title class="header">
        <h2 class="title">Conversion History</h2>
        <div class="actions">
          <v-btn
            v-if="historyStore.conversionHistory.length"
            class="clear-btn"
            @click="historyStore.clearHistory()"
          >
            Clear
          </v-btn>
          <v-btn class="close-btn" icon @click="$emit('update:modelValue', false)" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <main>
        <v-alert
          v-if="!historyStore.conversionHistory.length"
          type="info"
          variant="tonal"
          color="#235770"
        >
          There are no conversions yet.
        </v-alert>

        <v-list v-else>
          <v-list-item v-for="record in historyStore.conversionHistory" :key="record.id">
            <v-list-item-title>
              <span class="date"> {{ new Date(record.timestamp).toLocaleString() }}</span>
            </v-list-item-title>
            {{ record.amount }} {{ record.fromCurrency }} →
            <span>{{ record.result?.toFixed(4) }} {{ record.toCurrency }}</span>
          </v-list-item>
        </v-list>
      </main>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: #ffffff;
  background-color: #4d6d7c;
  padding: 8px 16px;
}

.title {
  font-size: 20px;
  font-weight: 900;
  padding: 8px 16px;
  border-radius: 25px;
}

.actions {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
}

.close-btn {
  margin-left: auto;
}

.clear-btn {
  color: #ffffff;
  background-color: #c15656;
}

.date {
  font-size: 14px;
  color: #5555;
}
</style>
