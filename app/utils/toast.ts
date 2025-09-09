import { createToast } from "mosha-vue-toastify";
import 'mosha-vue-toastify/dist/style.css'

export const toast = (title: string, description: string, type: 'success' | 'danger' = 'success') => {
    createToast(
        {
            title,
            description
        },
        {
            timeout: 2000,
            type,
            position: 'top-right',
            transition: 'slide'
        }
    )
}
