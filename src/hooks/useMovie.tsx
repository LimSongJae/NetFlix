import { useQueries } from "react-query";
import {
  getMovies,
  getPopularMovies,
  getSimilarMovies,
  getUpComingMovies,
} from "../api";

const useMovie = (recentId: number) => {
  const movies = useQueries([
    {
      queryKey: ["movies", "nowPlaying"],
      queryFn: getMovies,
    },
    {
      queryKey: ["movies", "nowPopular"],
      queryFn: getPopularMovies,
    },
    {
      queryKey: ["movies", "upComing"],
      queryFn: getUpComingMovies,
    },
    {
      queryKey: ["movies", recentId],
      queryFn: () => getSimilarMovies(recentId),
    },
  ]);
  return { movies };
};

export default useMovie;
