import { configureStore } from "@reduxjs/toolkit";
import cartSlice, { cartMiddleware } from "./features/cart/cartSlice";
import userSlice from "./features/userSlice";
import productsSlice from "./features/productSlice";
import selectedProductSlice from "./features/selectedProductSlice";
import vendorOrderSlice from "./features/admin/fetchOrders";
import vendorProductSlice from "./features/admin/fetchVendorProducts";
import productSlice from "./features/admin/productSlice";
import orderSlice from "./features/admin/orderSlice";
import addressSlice from "./features/cart/addressSlice";
import myOrderSlce from "./features/orderSlice";
import searchProductSlice from "./features/searchedProductSlice";
import notificationsSlice from "./features/admin/notificationSlice";
import selectedNotificationSlice from "./features/admin/SelectedNotificationSlice";
export const store = configureStore({
  reducer: {
    cart: cartSlice,
    user: userSlice,
    products: productsSlice,
    selectedProduct: selectedProductSlice,
    vendorOrders: vendorOrderSlice,
    vendorProducts: vendorProductSlice,
    product: productSlice,
    selectedOrder: orderSlice,
    address: addressSlice,
    myOrders: myOrderSlce,
    searchedProducts: searchProductSlice,
    notifications: notificationsSlice,
    selectedNotification: selectedNotificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware),
});
