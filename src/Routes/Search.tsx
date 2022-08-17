import React from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const data = query.get("keyword");

  return <div>{data}</div>;
};

export default Search;
