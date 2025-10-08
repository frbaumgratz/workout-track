<template>
  <div class="relative">
    <input
      :type="isVisible ? 'text' : 'password'"
      class="mt-1 w-full border rounded px-3 py-2 pr-10"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      v-model="innerValue"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
      @click="toggleVisibility"
      :aria-label="isVisible ? 'Hide password' : 'Show password'"
      :title="isVisible ? 'Hide password' : 'Show password'"
    >
      <Icon
        :name="isVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
        class="h-5 w-5"
      />
    </button>
  </div>
  <p v-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
</template>

<script setup>
// Reusable password input with eye toggle and v-model support
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  hint: { type: String, default: '' },
  autocomplete: { type: String, default: 'current-password' }
})

const emit = defineEmits(['update:modelValue'])

const isVisible = ref(false)
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function toggleVisibility() {
  isVisible.value = !isVisible.value
}
</script>


