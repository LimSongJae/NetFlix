import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { boxVariants, infoVariants, rowVariants } from "../Animations/Variants";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useState } from "react";
import {
  IGetMoviesResult,
  IGetPopularMoviesResult,
  IGetSimilarMovies,
  IGetUpComingMovies,
} from "../api";
import { makeImagePath } from "../utils";
import useIndex from "../hooks/useIndex";

interface ISliderBox {
  nowPlaying: IGetMoviesResult;
  popular: IGetPopularMoviesResult;
  upComing: IGetUpComingMovies;
  similar: IGetSimilarMovies;
  setRecentId: Dispatch<SetStateAction<number>>;
}

const SliderBox = ({
  nowPlaying,
  popular,
  upComing,
  similar,
  setRecentId,
}: ISliderBox) => {
  const increaseIndex = (
    setIndex: Dispatch<SetStateAction<number>>,
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
  const navigate = useNavigate();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (link: string, movieId: number) => {
    navigate(`/movies/${link}/${movieId}`);
    if (link !== "similar") {
      setRecentId(movieId);
    }
  };
  const offset = 6;
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(true);
  const {
    upComingIndex,
    setUpComingIndex,
    similarIndex,
    setSimilarIndex,
    popularIndex,
    setPopularIndex,
    NowPlayingIndex,
    setNowPlayingIndex,
  } = useIndex();
  return (
    <>
      <Slider>
        <SliderTitle>최신영화 Top20</SliderTitle>
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
              {nowPlaying?.results
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
                onClick={() => increaseIndex(setNowPlayingIndex, nowPlaying)}
              />
              <LeftArrowIcon
                onClick={() => decreaseIndex(setNowPlayingIndex, nowPlaying)}
              />
            </Row>
          }
        </AnimatePresence>
      </Slider>

      <Slider>
        <SliderTitle>인기영화 Top20</SliderTitle>
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
              {popular?.results
                .slice(1)
                .slice(offset * popularIndex, offset * popularIndex + offset)
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
                onClick={() => increaseIndex(setPopularIndex, popular)}
              />
              <LeftArrowIcon
                onClick={() => decreaseIndex(setPopularIndex, popular)}
              />
            </Row>
          }
        </AnimatePresence>
      </Slider>

      <Slider>
        <SliderTitle>개봉예정영화 Top20</SliderTitle>
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
              key={upComingIndex}
            >
              {upComing?.results
                .slice(1)
                .slice(offset * upComingIndex, offset * upComingIndex + offset)
                .map((movie) => (
                  <Box
                    layoutId={`upComing ${movie.id}`}
                    onClick={() => onBoxClicked("upComing", movie.id)}
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
                onClick={() => increaseIndex(setUpComingIndex, popular)}
              />
              <LeftArrowIcon
                onClick={() => decreaseIndex(setUpComingIndex, popular)}
              />
            </Row>
          }
        </AnimatePresence>
      </Slider>

      <Slider>
        <SliderTitle>최근 본 영화와 비슷한 영화</SliderTitle>
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
              key={similarIndex}
            >
              {similar?.results
                .slice(1)
                .slice(offset * similarIndex, offset * similarIndex + offset)
                .map((movie) => (
                  <Box
                    layoutId={`similar ${movie.id}`}
                    onClick={() => onBoxClicked("similar", movie.id)}
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
                onClick={() => increaseIndex(setSimilarIndex, popular)}
              />
              <LeftArrowIcon
                onClick={() => decreaseIndex(setSimilarIndex, popular)}
              />
            </Row>
          }
        </AnimatePresence>
      </Slider>
    </>
  );
};
export default SliderBox;

const SliderTitle = styled.div`
  color: white;
  font-size: 16px;
  margin: 0 0 15px 10px;
  font-weight: 900;
`;

const Slider = styled.div`
  position: relative;
  margin: 50px 0 250px 0;
  top: -50px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
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
