<script setup>
import Toast from './Toast.vue'
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @remove="removeToast"
      />
    </div>
  </Teleport>
</template>
