import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { IMovie, IMovieResult } from "../api";
import { makeImagePath } from "../utils";
import SliderBox from "../Components/SliderBox";
import useMovie from "../hooks/useMovie";
import { useState } from "react";

const Home = () => {
  const [recentId, setRecentId] = useState<number>(539681);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/movies/:link/:id`);
  let { link, id } = useParams();
  const onOverlayClick = () => navigate(-1);
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 100);
  const { movies } = useMovie(recentId);
  const foundMovie = () => {
    if (link) {
      if (link === "nowPlaying") {
        let movie = movies[0].data?.results.find(
          (movie: IMovie) => movie.id + "" === id
        );
        console.log(movies);
        return movie;
      } else if (link === "popular") {
        let movie = movies[1].data?.results.find(
          (movie: IMovie) => movie.id + "" === id
        );
        console.log(movie);
        return movie;
      } else if (link === "upComing") {
        let movie = movies[2].data?.results.find(
          (movie: IMovie) => movie.id + "" === id
        );
        console.log(movie);
        return movie;
      } else if (link === "similar") {
        let movie = movies[3].data?.results.find(
          (movie: IMovie) => movie.id + "" === id
        );
        console.log(movie);
        return movie;
      } else if (link === "topRated") {
        let movie = movies[4].data?.results.find(
          (movie: IMovie) => movie.id + "" === id
        );
        console.log(movie);
        return movie;
      }
    }
  };
  console.log(movies);
  return (
    <Wrapper>
      {movies[0].isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              movies[0].data?.results[0].backdrop_path || ""
            )}
          >
            <Title>{movies[0].data?.results[0].title}</Title>
            <Overview>{movies[0].data?.results[0].overview}</Overview>
          </Banner>

          <SliderBox
            nowPlaying={movies[0].data as IMovieResult}
            popular={movies[1].data as IMovieResult}
            upComing={movies[2].data as IMovieResult}
            similar={movies[3].data as IMovieResult}
            setRecentId={setRecentId}
            topRated={movies[4].data as IMovieResult}
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
                      <BigOverview length={foundMovie()?.overview.length}>
                        {foundMovie()?.overview}
                      </BigOverview>
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
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
  overflow-x: hidden;
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

export const BigCover = styled.div<{ imagePath: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(transparent, black),
    url(${(prop) => prop.imagePath});
`;

export const BigTitle = styled.h3`
  color: ${(prop) => prop.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

export const BigOverview = styled.p<{ length: number }>`
  padding: 20px;
  font-size: ${(prop) => (prop.length < 350 ? `18px` : `12px`)};
  position: relative;
  top: -80px;
  color: ${(prop) => prop.theme.white.lighter};
`;
