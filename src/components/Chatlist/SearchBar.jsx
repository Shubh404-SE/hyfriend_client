import React from "react";
import { BiSearch } from "react-icons/bi";
import {BsFilter} from 'react-icons/bs'

function SearchBar() {
  return (
    <div className=" bg-search-input-container-background flex py-3 px-5 items-center gap-5 h-14">
      <div className=" bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearch className=" text-panel-header-icon cursor-pointer text-l" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className=" bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
      </div>
      <div className=" pr-5 pl-3">
        <BsFilter className=" text-panel-header-icon cursor-pointer text-l" />
      </div>
    </div>
  );
}

export default SearchBar;
