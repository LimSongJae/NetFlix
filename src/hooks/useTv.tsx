import { useQueries } from "react-query";
import {
  getOnTheAirTv,
  getPopularTv,
  getSimilarTvs,
  getTopRatedTv,
} from "../api";

const useTv = (recentId: number) => {
  const TV = useQueries([
    {
      queryKey: ["TV", "on_the_air"],
      queryFn: getOnTheAirTv,
    },
    {
      queryKey: ["TV", "nowPopular"],
      queryFn: getPopularTv,
    },
    {
      queryKey: ["TV", recentId],
      queryFn: () => getSimilarTvs(recentId),
    },
    {
      queryKey: ["TV", "topRated"],
      queryFn: getTopRatedTv,
    },
  ]);
  return { TV };
};

export default useTv;
