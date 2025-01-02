import { Fragment, useEffect } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Section from "../components/Section";
import { products, discoutProducts } from "../utils/products";
import SliderHome from "../components/Slider";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../app/features/userSlice";
import { fetchProduct } from "../app/features/productSlice";

const Home = () => {
  const newArrivalData = products.filter(
    (item) => item.category === "mobile" || item.category === "wireless"
  );
  const bestSales = products.filter((item) => item.category === "sofa");
  useWindowScrollToTop();
  const dispatch = useDispatch()
  useEffect(() => { dispatch(fetchProduct()) }, [])
  const newProducts = useSelector((state) => state.products.data)
  // console.log(newProducts)

  return (
    <Fragment>
      <SliderHome />
      <Wrapper />
      <Section
        title="Big Discount"
        bgColor="#f6f9fc"
        productItems={newProducts}
      />
      {/* <Section
        title="New Arrivals"
        bgColor="white"
        productItems={newProducts}
      />
      <Section title="Best Sales" bgColor="#f6f9fc" productItems={newProducts} /> */}
    </Fragment>
  );
};

export default Home;
