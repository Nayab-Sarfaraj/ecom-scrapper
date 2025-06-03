import { useState } from "react";
import "./searchbar.css";
import { products } from "../../utils/products";
import { useDispatch } from "react-redux";
import { getSearchedProducts } from "../../app/features/searchedProductSlice";
import PriceFilter from "./PriceFilter";
// import useDebounce from "../../hooks/useDebounce";
const SearchBar = ({ setFilterList }) => {
  const [searchWord, setSearchWord] = useState(null);
  const [minPrice, setMinPrice] = useState(500)
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPrice, setMaxPrice] = useState(5000000)
  // const debounceSearchWord = useDebounce(searchWord, 300);
  const dispatch = useDispatch()
  const handelChange = (input) => {
    setSearchWord(input.target.value);

  };
  const onPageChange = (page) => {
    setCurrentPage(page)
  }
  const handleSubmit = async () => {
    try {
      if (!searchWord) return
      const res = await dispatch(getSearchedProducts({ searchQuery: searchWord, page: currentPage, minPrice: minPrice, maxPrice: maxPrice }))
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className="search-container" >
        <input type="text" placeholder="Search..." onChange={handelChange} className="" />
        <button onClick={handleSubmit}>   <ion-icon name="search-outline" className="search-icon"></ion-icon></button>

      </div>
      <PriceFilter minPrice={minPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} setMinPrice={setMinPrice} currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
};

export default SearchBar;
