import 'mosha-vue-toastify/dist/style.css'
import ToastifyPkg from 'mosha-vue-toastify'

const { createToast } = ToastifyPkg

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
