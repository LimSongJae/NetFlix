import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies,
  getPopularMovies,
  getSimilarMovies,
  getUpComingMovies,
  IGetMoviesResult,
  IGetPopularMoviesResult,
  IGetSimilarMovies,
  IGetUpComingMovies,
} from "../api";
import { makeImagePath } from "../utils";
import SliderBox from "../Components/SliderBox";

const Home = () => {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/movies/:link/:id`);
  let { link, id } = useParams();
  const onOverlayClick = () => navigate(-1);
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 100);

  const nowPlaying = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const popular = useQuery<IGetPopularMoviesResult>(
    ["movies", "nowPopular"],
    getPopularMovies
  );
  const upComing = useQuery<IGetUpComingMovies>(
    ["movies", "upComing"],
    getUpComingMovies
  );
  const similar = useQuery<IGetSimilarMovies>(
    ["movies", "similar"],
    getSimilarMovies
  );

  const foundMovie = () => {
    if (link) {
      if (link === "nowPlaying") {
        let movie = nowPlaying.data?.results.find(
          (movie) => movie.id + "" === id
        );
        console.log(movie);
        return movie;
      } else if (link === "popular") {
        let movie = popular.data?.results.find((movie) => movie.id + "" === id);
        console.log(movie);
        return movie;
      } else if (link === "upComing") {
        let movie = upComing.data?.results.find(
          (movie) => movie.id + "" === id
        );
        console.log(movie);
        return movie;
      } else if (link === "similar") {
        let movie = similar.data?.results.find((movie) => movie.id + "" === id);
        console.log(movie);
        return movie;
      }
    }
  };
  return (
    <Wrapper>
      {nowPlaying.isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              nowPlaying.data?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlaying.data?.results[0].title}</Title>
            <Overview>{nowPlaying.data?.results[0].overview}</Overview>
          </Banner>

          <SliderBox
            nowPlaying={nowPlaying.data as IGetMoviesResult}
            popular={popular.data as IGetPopularMoviesResult}
            upComing={upComing.data as IGetUpComingMovies}
            similar={similar.data as IGetSimilarMovies}
          />

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <BigMovie
                  style={{ top: setScrollY }}
                  layoutId={`${link} ${id}`}
                >
                  {foundMovie() && (
                    <>
                      <BigCover
                        imagePath={makeImagePath(
                          foundMovie()?.backdrop_path as string,
                          "w500"
                        )}
                      />
                      <BigTitle>{foundMovie()?.title}</BigTitle>
                      <BigOverview>{foundMovie()?.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
                <Overlay
                  onClick={() => onOverlayClick()}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(prop) => prop.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigCover = styled.div<{ imagePath: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(transparent, black),
    url(${(prop) => prop.imagePath});
`;

const BigTitle = styled.h3`
  color: ${(prop) => prop.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(prop) => prop.theme.white.lighter};
`;
