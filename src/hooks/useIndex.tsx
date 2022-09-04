import { useState } from "react";

const useIndex = () => {
  const [upComingIndex, setUpComingIndex] = useState(0);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [NowPlayingIndex, setNowPlayingIndex] = useState(0);
  return {
    upComingIndex,
    setUpComingIndex,
    similarIndex,
    setSimilarIndex,
    popularIndex,
    setPopularIndex,
    NowPlayingIndex,
    setNowPlayingIndex,
  };
};

export default useIndex;
