import { useState } from "react";
import "./searchbar.css";
import { products } from "../../utils/products";
import { useDispatch } from "react-redux";
import { getSearchedProducts } from "../../app/features/searchedProductSlice";
// import useDebounce from "../../hooks/useDebounce";
const SearchBar = ({ setFilterList }) => {
  const [searchWord, setSearchWord] = useState(null);
  // const debounceSearchWord = useDebounce(searchWord, 300);
  const dispatch = useDispatch()
  const handelChange = (input) => {
    setSearchWord(input.target.value);

  };
  const handleSubmit = async () => {
    try {
      const res = await dispatch(getSearchedProducts({ searchQuery: searchWord, page: 1, minPrice: 5000 }))
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="search-container" >
      <input type="text" placeholder="Search..." onChange={handelChange} />
      <button onClick={handleSubmit}>   <ion-icon name="search-outline" className="search-icon"></ion-icon></button>
    </div>
  );
};

export default SearchBar;
