import { IoSearchOutline } from "react-icons/io5";

const SearchInput = () => {
  return (
    <div className="relative font-Montserrat-Regular lg:w-[70%]">
      <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        className="pl-10 pr-3 py-1 w-full rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2394db] focus:border-transparent"
        type="text"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchInput;
