<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currencyStore.ts'

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: 'From',
  },
  width: {
    type: [Number, String],
    default: 200,
  },
})

const emit = defineEmits(['update:modelValue'])

const currencyStore = useCurrencyStore()

const currencyCodes = computed(() => {
  return currencyStore.currencies.map((currency) => currency.code)
})

const selectedCurrencyCode = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    selectedCurrencyCode.value = val
  },
)

watch(selectedCurrencyCode, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <v-autocomplete
    class="select-currency"
    v-model="selectedCurrencyCode"
    :items="currencyCodes"
    :label="props.label || 'From'"
    clearable
    density="comfortable"
    variant="outlined"
    :hide-no-data="false"
    hide-details
  />
</template>

<style scoped>
.select-currency {
  min-width: 125px;
}

@media (min-width: 768px) and (max-width: 1439px) {
  .select-currency {
    min-width: 100px;
  }
}
</style>
