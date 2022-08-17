import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

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

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: { x: -window.outerWidth - 5 },
};

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      duration: 0.1,
      delay: 0.5,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.1,
      delay: 0.5,
    },
  },
};
const Home = () => {
  const offset = 6;
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (data) {
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (leaving) return;
      toggleLeaving();
      setIndex((prev) => (prev !== maxIndex ? prev + 1 : 0));
    }
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/movies/:id`);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate(-1);
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 100);
  const clickMovie =
    bigMovieMatch?.params.id &&
    data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.id);
  console.log(clickMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              {
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        onClick={() => onBoxClicked(movie.id)}
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
                </Row>
              }
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <BigMovie
                  style={{ top: setScrollY }}
                  layoutId={bigMovieMatch.params.id}
                >
                  {clickMovie && (
                    <>
                      <BigCover
                        imagePath={makeImagePath(
                          clickMovie.backdrop_path,
                          "w500"
                        )}
                      />
                      <BigTitle>{clickMovie.title}</BigTitle>
                      <BigOverview>{clickMovie.overview}</BigOverview>
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
