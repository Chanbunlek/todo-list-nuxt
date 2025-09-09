<template>
    <button
        :type="type"
        class="rounded-[5px] px-[15px] py-[5px] border-[2px]"
        :class="danger ? 'border-yellow-400 bg-yellow-100' : 'border-blue-500 bg-blue-100'"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    type: "button" | "submit" | "reset",
    danger: boolean
}>()
</script>
