import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies,
  getPopularMovies,
  IGetMoviesResult,
  IGetPopularMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { boxVariants, infoVariants, rowVariants } from "../Animations/Variants";

const Home = () => {
  const offset = 6;
  const nowPlaying = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const popular = useQuery<IGetPopularMoviesResult>(
    ["movies", "nowPopular"],
    getPopularMovies
  );
  const [popularIndex, setPopularIndex] = useState(0);
  const [NowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [direction, setDirection] = useState(true);
  const increaseIndex = (
    setIndex: any,
    line?: IGetMoviesResult | IGetPopularMoviesResult
  ) => {
    setDirection(true);
    if (line) {
      const totalMovies = line.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (leaving) return;
      toggleLeaving();
      setIndex((prev: number) => (prev !== maxIndex ? prev + 1 : 0));
    } else return;
  };
  const decreaseIndex = (
    setIndex: any,
    line?: IGetMoviesResult | IGetPopularMoviesResult
  ) => {
    setDirection(false);
    if (line) {
      const totalMovies = line.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (leaving) return;
      toggleLeaving();
      setIndex((prev: number) => (prev === 0 ? maxIndex : prev - 1));
      console.log(direction);
    } else return;
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/movies/:link/:id`);
  let { link, id } = useParams();
  const onBoxClicked = (link: string, movieId: number) => {
    navigate(`/movies/${link}/${movieId}`);
  };
  const onOverlayClick = () => navigate(-1);
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 100);
  const clickMovie =
    link === "nowPlaying"
      ? nowPlaying.data?.results.find((movie) => movie.id + "" === id)
      : popular.data?.results.find((movie) => movie.id + "" === id);

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

          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={direction}
            >
              {
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  custom={direction}
                  key={NowPlayingIndex}
                >
                  {nowPlaying.data?.results
                    .slice(1)
                    .slice(
                      offset * NowPlayingIndex,
                      offset * NowPlayingIndex + offset
                    )
                    .map((movie) => (
                      <Box
                        layoutId={`nowPlaying ${movie.id}`}
                        onClick={() => onBoxClicked("nowPlaying", movie.id)}
                        variants={boxVariants}
                        whileHover="hover"
                        initial="normal"
                        key={movie.id}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                  <RightArrowIcon
                    onClick={() =>
                      increaseIndex(setNowPlayingIndex, nowPlaying.data)
                    }
                  />
                  <LeftArrowIcon
                    onClick={() =>
                      decreaseIndex(setNowPlayingIndex, nowPlaying.data)
                    }
                  />
                </Row>
              }
            </AnimatePresence>
          </Slider>

          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={direction}
            >
              {
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  custom={direction}
                  key={popularIndex}
                >
                  {popular.data?.results
                    .slice(1)
                    .slice(
                      offset * popularIndex,
                      offset * popularIndex + offset
                    )
                    .map((movie) => (
                      <Box
                        layoutId={`popular ${movie.id}`}
                        onClick={() => onBoxClicked("popular", movie.id)}
                        variants={boxVariants}
                        whileHover="hover"
                        initial="normal"
                        key={movie.id}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                  <RightArrowIcon
                    onClick={() => increaseIndex(setPopularIndex, popular.data)}
                  />
                  <LeftArrowIcon
                    onClick={() => decreaseIndex(setPopularIndex, popular.data)}
                  />
                </Row>
              }
            </AnimatePresence>
          </Slider>
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
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  margin-bottom: 300px;
  top: -50px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
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
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(prop) => prop.bgphoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  color: red;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(prop) => prop.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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
const arrow = `
  color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 55px;
  &:hover {
    color: rgba(0, 0, 0, 1);
    cursor: pointer;
  }
`;

const RightArrowIcon = styled(AiOutlineRight)`
  ${arrow}
  right: 0;
`;

const LeftArrowIcon = styled(AiOutlineLeft)`
  ${arrow}
  left: 0;
`;
