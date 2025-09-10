<template>
    <div class="max-w-[1200px] px-[20px] py-[25px] mx-auto min-h-screen bg-gray-100">
        <div class="flex items-center justify-between">
            <div class="font-bold text-[30px] flex gap-x-[8px]">
                <Icon name="mdi:clipboard-list-outline" class="text-secondary" />
    
                <div class="text-primary leading-none">
                    Todo Lists
                </div>
            </div>
            
            <div
                class="bg-secondary/30 rounded-md size-[30px] flex items-center justify-center cursor-pointer"
                @click="openCreate()"
            >
                <Icon
                    name="mdi:plus"
                    class="size-[25px]"
                ></Icon>
            </div>
        </div>

        <div class="flex justify-end py-[20px]">
            <div class="bg-secondary/20 rounded-[5px] flex items-center p-[2px]">
                <input
                    type="text"
                    class="rounded-[5px] px-[8px] max-w-[150px]"
                    placeholder="Search"
                    v-model="search"
                >

                <Icon
                    name="mdi:magnify"
                    class="size-[20px] px-[14px]"
                ></Icon>
            </div>
        </div>
        
        <div
            v-if="!todos.length && isMounted"
            class="bg-secondary/10 py-10 w-full flex justify-center rounded-lg"
        >
            Empty
        </div>

        <div
            v-if="isMounted && todos"
            class="grid gap-[15px] grid-cols-4 max-[1100px]:!grid-cols-3 max-[850px]:!grid-cols-2 max-[700px]:!grid-cols-1"
        >
            <div
                v-for="(todo, idx) in todoList"
                :key="idx"
                class="bg-secondary/30 space-y-[5px] p-[15px] shadow-md rounded-[10px]"
                :class="{
                    '!bg-green-200': todo.isCompleted,
                    'border-[2px] bg-yellow-100/50 border-yellow-300': todoChecker(todo.id, todo?.todo)
                }"
            >
                <div class="flex justify-between text-[24px] font-bold w-full">
                    <div class="flex gap-x-[6px]">
                        <Icon
                            v-if="todo.isCompleted"
                            name="mdi:clipboard-check"
                        />
                        
                        <Icon
                            v-else
                            name="mdi:clipboard-text-clock"
                        />

                        <div class="leading-none flex">
                            {{ idx + 1 }}
                            
                            <span
                                v-if="todoChecker(todo.id, todo.todo)"
                                class="text-[14px] font-normal pl-[5px] text-yellow-600 pt-[5px] animate-bounce"
                            >
                                (Duplicated!)
                            </span>
                        </div>
                    </div>

                    <div class="w-56 text-right">
                        <HeadlessMenu as="div" class="relative inline-block text-left">
                            <HeadlessMenuButton
                                class="bg-primary/20 size-[30px] rounded-[5px]"
                            >
                                <icon name="mdi:dots-vertical" />
                            </HeadlessMenuButton>

                            <transition enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0"
                            >
                                <HeadlessMenuItems class="absolute z-[100] right-0 w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    <HeadlessMenuItem v-slot="{ active }">
                                        <button
                                            :class="[
                                                active ? 'bg-primary/50 text-white' : 'text-gray-900',
                                                'group flex gap-x-2 w-full items-center rounded-md px-2 py-2 text-sm'
                                            ]"
                                            @click="openEdit(todo.id, todo.todo)"
                                        >
                                            <Icon name="mdi:pencil" />

                                            Edit
                                        </button>
                                    </HeadlessMenuItem>
                                    
                                    <HeadlessMenuItem v-slot="{ active }">
                                        <button
                                            :class="[
                                                active ? 'bg-primary/50 text-white' : 'text-gray-900',
                                                'group flex gap-x-2 w-full items-center rounded-md px-2 py-2 text-sm'
                                            ]"
                                            @click="updateStatus(todo.id, !todo.isCompleted)"
                                        >
                                            <Icon
                                                name="mdi:checkbox-marked"
                                                v-if="todo.isCompleted"
                                            />

                                            <Icon
                                                name="mdi:checkbox-blank-outline"
                                                v-else
                                            />

                                            {{ !todo.isCompleted ? "Mark as completed" : "Mark as todo" }}
                                        </button>
                                    </HeadlessMenuItem>

                                    <HeadlessMenuItem v-slot="{ active }">
                                        <button
                                            :class="[
                                                active ? 'bg-primary/50 text-white' : 'text-gray-900',
                                                'group flex gap-x-2 w-full items-center rounded-md px-2 py-2 text-sm'
                                            ]"
                                            @click="openDelete(todo.id)"
                                        >
                                            <Icon name="mdi:delete" />

                                            Delete
                                        </button>
                                    </HeadlessMenuItem>
                                </HeadlessMenuItems>
                            </transition>
                        </HeadlessMenu>
                    </div>
                </div>

                <div>
                    {{ todo.todo }}
                </div>

            </div>

            <Dialog v-model="createForm.open">
                <template #title>
                    Create new todo
                </template>

                <template #default>
                    <VeeForm
                        :validation-schema="schemas"
                        @submit="onCreate()"
                    >
                        <VeeField
                            name="todo"
                            v-slot="{ field, errorMessage }"
                            v-model="createForm.value"
                        >
                            <textarea
                                v-bind="field"
                                class="border-[2px] px-[10px] py-[5px] resize-none rounded-[5px] w-full"
                            ></textarea>

                            <div class="h-[20px] text-[10px] text-red-500">{{ errorMessage }}</div>
                        </VeeField>

                        <div class="flex gap-x-[10px] w-full justify-end">
                            <Button
                                type="submit"
                                danger
                                @click="closeCreate()"
                            >
                                Close
                            </Button>

                            <Button
                                type="submit"
                                class="flex gap-x-1"
                            >
                                <div
                                    v-if="isSubmitting"
                                    class="h-full flex items-center rounded-lg"
                                >
                                    <Icon
                                        name="mdi:reload"
                                        class="animate-spin size-[20px]"
                                    ></Icon>
                                </div>

                                Submit
                            </Button>
                        </div>
                    </VeeForm>
                </template>
            </Dialog>

            <Dialog v-model="editForm.open">
                <template #title>
                    Edit {{ editForm.id }} todo
                </template>

                <template #default>
                    <VeeForm
                        :validation-schema="schemas"
                        @submit="onEdit()"
                    >
                        <VeeField
                            name="todo"
                            v-slot="{ field, errorMessage }"
                            v-model="editForm.value"
                        >
                            <textarea
                                v-bind="field"
                                class="border-[2px] px-[10px] py-[5px] resize-none rounded-[5px] w-full"
                            ></textarea>

                            <div class="h-[20px] text-[10px] text-red-500">{{ errorMessage }}</div>
                        </VeeField>

                        <div class="flex gap-x-[10px] w-full justify-end">
                            <Button
                                type="submit"
                                danger
                                @click="closeEdit"
                            >
                                Close
                            </Button>

                            <Button
                                type="submit"
                                class="flex gap-x-1"
                            >
                                <div
                                    v-if="isSubmitting"
                                    class="h-full flex items-center rounded-lg"
                                >
                                    <Icon
                                        name="mdi:reload"
                                        class="animate-spin size-[20px]"
                                    ></Icon>
                                </div>

                                Submit
                            </Button>
                        </div>
                    </VeeForm>
                </template>
            </Dialog>

            <Dialog v-model="deleteForm.open">
                <template #title>
                    Delete todo
                </template>

                Do you want to delete a todo?

                <div class="flex gap-x-3 justify-end">
                    <Button
                        type="button"
                        danger
                        @click="closeDelete"
                    >
                        Cancel
                    </Button>

                    <Button
                        @click="onDelete">
                        Yes
                    </Button>
                </div>
            </Dialog>
        </div>

        <div
            v-else
            class="bg-secondary/10 py-10 w-full flex justify-center rounded-lg"
        >
            <Icon
                name="mdi:reload"
                class="animate-spin size-[30px]"
            ></Icon>
        </div>

        <div
            v-if="!todoList.length && isMounted"
            class="bg-secondary/20 w-full text-center py-10 rounded-lg"
        >
            No result. Create a new one instead!
        </div>
    </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import useTodoStore from '~/stores/todo'
import type { Todo } from '~/types/todo'

const todoStore = useTodoStore()

const isMounted = ref(false)
const isSubmitting = ref(false)
const search = ref("")

const createForm = reactive({
    open: false,
    value: ""
})

const deleteForm = reactive({
    open: false,
    id: 0
})

const editForm = reactive({
    open: false,
    value: "",
    id: 0
})

const { todos } = storeToRefs(todoStore)

const schemas = object({
    todo: string().required().label("Todo")
})

const todoList = computed(
    (): Todo[] => search.value
        ? todos.value?.filter(todo => todo.todo.toLowerCase().match(search.value.toLowerCase()))
        : todos.value
)

let socket

onMounted(async () => {
    await todoStore.getAllTodos()
    socket = new WebSocket("ws://ec2-13-114-37-227.ap-northeast-1.compute.amazonaws.com:8000/api/web-socket/")
    socket.onmessage = async (event) => {
        if (event.data == 'change')
            await todoStore.getAllTodos()
    }
    isMounted.value = true
})

onUnmounted(async () => {
    socket.close()
})

const openCreate = () => {
    createForm.open = true
}

const closeCreate = () => {
    createForm.open = false
    createForm.value = ""
}

const openEdit = (id: number, value: string) => {
    editForm.open = true
    editForm.id = id
    editForm.value = value
}

const closeEdit = () => {
    editForm.open = false
    editForm.value = ""
}

const openDelete = (id: number) => {
    deleteForm.id = id
    deleteForm.open = true
}

const closeDelete = () => {
    deleteForm.open = false 
    deleteForm.id = 0
}

const onCreate = async () => {
    isSubmitting.value = true
    await todoStore.createTodo({ todo: createForm.value })
    closeCreate()
    isSubmitting.value = false
}

const onEdit = async () => {
    isSubmitting.value = true
    await todoStore.editTodo(editForm.id, { todo: editForm.value })
    closeEdit()
    isSubmitting.value = false
}

const onDelete = async () => {
    await todoStore.deleteTodo(deleteForm.id)
    closeDelete()
}

const updateStatus = async (id: number, status: boolean) => {
    await todoStore.updateStatus(id, status)
}

const todoChecker = (id: number, todoStr: string) => {
    return todoList.value.some(todo => todo?.todo.toLowerCase().match(todoStr.toLowerCase()) && todo.id != id)
}
</script>

<style></style>