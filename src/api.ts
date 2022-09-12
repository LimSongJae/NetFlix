const API_KEY = "169ea1681c0d5ee2288d995a43bf39a1";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovieResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
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

export async function getUpComingMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`)
  ).json();
}

export async function getSimilarMovies(recentId: number) {
  return await (
    await fetch(`${BASE_PATH}/movie/${recentId}/similar?api_key=${API_KEY}`)
  ).json();
}

export async function getTopRatedMovies() {
  return await (
    await fetch(`${BASE_PATH}/movie/top_rated/?api_key=${API_KEY}`)
  ).json();
}

export async function searchMovies(keyword: string, page: number) {
  return await (
    await fetch(
      `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&language=en-US&page=${page}&include_adult=false`
    )
  ).json();
}
