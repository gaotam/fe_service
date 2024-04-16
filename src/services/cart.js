import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { ElNotification } from 'element-plus'
let authStore = useAuthStore()
let cart = useCartStore()

export default async function addToCart(data, quantity = 1, size = null ) {

  if(!size){
    size = data.sizes.find(s => s.quantity > 0).size  
  }

  if (authStore.isAuth()) {
    try {
      await cart.addToCart(data, quantity, size);
      ElNotification({
        title: 'Thành công',
        dangerouslyUseHTMLString: true,
        message: `Bạn đã thêm <b>${data.name}</b> vào giỏ hàng`,
        type: 'success',
      })
      await cart.loadCart(authStore.isAuth());
    } catch (error) {
      ElNotification({
        title: 'Lỗi',
        message: error?.response ? error.response.data.message : error,
        type: 'error',
      })
    }
  } else {
    ElNotification({
      title: 'Thành công',
      dangerouslyUseHTMLString: true,
      message: `Bạn đã thêm <b>${data.name}</b> vào giỏ hàng`,
      type: 'success',
    })
    cart.saveToLocalStorage(data, quantity, size)
  }
}
