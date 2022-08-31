import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { boxVariants, infoVariants, rowVariants } from "../Animations/Variants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IGetMoviesResult, IGetPopularMoviesResult } from "../api";
import { makeImagePath } from "../utils";

interface ISliderBox {
  nowPlaying: IGetMoviesResult;
  popular: IGetPopularMoviesResult;
}

const SliderBox = ({ nowPlaying, popular }: ISliderBox) => {
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

  const navigate = useNavigate();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (link: string, movieId: number) => {
    navigate(`/movies/${link}/${movieId}`);
  };
  const offset = 6;
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(true);
  const [popularIndex, setPopularIndex] = useState(0);
  const [NowPlayingIndex, setNowPlayingIndex] = useState(0);
  return (
    <>
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
    </>
  );
};
export default SliderBox;

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
