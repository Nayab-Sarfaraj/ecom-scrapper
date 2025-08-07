import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import NavBar from "./components/Navbar/Navbar";

import { useDispatch } from "react-redux";
import { fetchProduct } from "./app/features/productSlice";
import { fetchUser } from "./app/features/userSlice";
import Dashboard from "./pages/Dashboard";
import PrivateScreen from "./pages/PrivateScreen";
// import AdminAuthenticator from "./pages/AdminAuthenticator";
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Product = lazy(() => import("./pages/Product"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminAuthenticator = lazy(() => import("./pages/AdminAuthenticator"));
const AdminOrders = lazy(() => import("./pages/AdminOrders.jsx"));
const AdminProducts = lazy(() => import("./pages/AdminProducts.jsx"));
const AdminOrderDetails = lazy(() => import("./pages/AdminOrderDetails.jsx"));
const CreateProduct = lazy(() => import("./pages/CreateProduct.jsx"));
const EditProduct = lazy(() => import("./pages/EditProduct.jsx"));
const ViewProduct = lazy(() => import("./pages/ViewProduct.jsx"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const OrderSummary = lazy(() => import("./pages/OrderSummary.jsx"));
const MyOrder = lazy(() => import("./pages/MyOrder.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const NotificationPage = lazy(() => import("./pages/NotificationPage.jsx"));
function App() {
  const dispatch = useDispatch();
  // const isVendor = useSelector((state) => state.user?.isVendor);
  useEffect(() => {
    // dispatch(fetchVendorOrders());
    dispatch(fetchUser());
    dispatch(fetchProduct());
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="" element={<PrivateScreen />}>
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/password/update" element={<UpdatePassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/order" element={<MyOrder />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="" element={<AdminAuthenticator />}>
            <Route path="/vendor/dashboard" element={<Dashboard />} />
            <Route path="/vendor/products" element={<AdminProducts />} />
            <Route path="/vendor/orders" element={<AdminOrders />} />
            <Route path="/vendor/notifications" element={<Notifications />} />
            <Route
              path="/vendor/notification/:id"
              element={<NotificationPage />}
            />

            <Route
              path="/vendor/order/details/:id"
              element={<AdminOrderDetails />}
            />
            <Route path="/vendor/product/create" element={<CreateProduct />} />
            <Route path="/vendor/product/edit/:id" element={<EditProduct />} />
            <Route path="/vendor/product/view/:id" element={<ViewProduct />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
}

export default App;
