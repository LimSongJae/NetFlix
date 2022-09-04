import { useState } from "react";

const useIndex = () => {
  const [upComingIndex, setUpComingIndex] = useState(0);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  return {
    upComingIndex,
    setUpComingIndex,
    similarIndex,
    setSimilarIndex,
    popularIndex,
    setPopularIndex,
    nowPlayingIndex,
    setNowPlayingIndex,
    topRatedIndex,
    setTopRatedIndex,
  };
};

export default useIndex;
