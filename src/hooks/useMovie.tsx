import { useQueries } from "react-query";
import {
  getMovies,
  getPopularMovies,
  getSimilarMovies,
  getUpComingMovies,
} from "../api";

const useMovie = () => {
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
      queryKey: ["movies", "similar"],
      queryFn: getSimilarMovies,
    },
  ]);
  return { movies };
};

export default useMovie;
