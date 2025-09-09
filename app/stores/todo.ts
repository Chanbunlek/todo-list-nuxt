import type { Todo } from "~/types/todo"
import { http } from "~/utils/http"
import { toast } from "~/utils/toast"

const useTodoStore = defineStore("useTodoStore", () => {
    const todos = ref<Todo[]>([])

    const getAllTodos = async () => {
       await http.get('/todo').then(
           res => {
               todos.value = res.data?.data
           }
       )
    }

    const createTodo = async (data: any) => {
        await http.post('/todo', data).then(
            async res => {
                if (res.data?.success) {
                    await getAllTodos()
                    toast("Todo", "Creating new todo is successfully!")
                } else {
                    toast("Todo", "Creating new todo is not successful!", "danger")
                }
            }
        )
    }

    const editTodo = async (id: number | string, data: any) => {
        await http.patch(`/todo/${id}`, data).then(
            async res => {
                if (res.data?.success) {
                    await getAllTodos()
                    toast("Todo", "Editing todo is successfully!")
                } else {
                    toast("Todo", "Editing todo is not successful!", "danger")
                }
            }
        )
    }

    const deleteTodo = async (id: number | string) => {
        await http.delete(`/todo/${id}`).then(
            async res => {
                if (res.data?.success) {
                    await getAllTodos()
                    toast("Todo", "Deleting todo successfully!")
                } else {
                    toast("Todo", "Deleting todo is not successful!", "danger")
                }
            }
        )
    }

    const updateStatus = async (id: number | string, status: boolean = false) => {
        await http.patch(`todo/${id}/update-status?status=${status}`).then(
            async res => {
                if (res.data?.success) {
                    await getAllTodos()
                    toast("Todo", "Updating todo status is successfully!")
                } else {
                    toast("Todo", "Updating todo status is not successful!", "danger")
                }
            }
        )
    }

    return {
        todos,
        getAllTodos,
        createTodo,
        editTodo,
        deleteTodo,
        updateStatus
    }
})

export default useTodoStore