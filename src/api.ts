const API_KEY = "169ea1681c0d5ee2288d995a43bf39a1";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetPopularMoviesResult {
  results: IMovie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export async function getMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  ).json();
}

export async function getPopularMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`)
  ).json();
}
