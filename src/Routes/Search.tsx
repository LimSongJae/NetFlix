import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { boxVariants, infoVariants } from "../Animations/Variants";
import { IMovieResult, searchMovies } from "../api";
import Pagination from "../Components/Pagination";
import { Info } from "../Components/SliderBox";
import { makeImagePath } from "../utils";
import { BigCover, BigOverview, BigTitle } from "./Home";

const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const onOverlayClick = () => navigate(-1);
  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword");
  const movieModalMatch = useMatch(`/search/:id`);
  const { id } = useParams();
  const { data } = useQuery<IMovieResult>(["searchMovies", keyword, page], () =>
    searchMovies(keyword as string, page)
  );

  const CardClicked = (id: number) => {
    navigate(`/search/${id}?keyword=${keyword}`);
  };

  const foundMovie = () => {
    let movie = data?.results.find((movie) => movie.id === Number(id));
    return movie;
  };
  return (
    <Wrapper>
      <Rows>
        {data?.results.map((item) => (
          <Card
            key={item.id}
            bgphoto={makeImagePath(item.backdrop_path, "w500")}
            variants={boxVariants}
            whileHover="hover"
            initial="normal"
            transition={{ type: "tween" }}
            onClick={() => CardClicked(item.id)}
            layoutId={`${item.id}`}
          >
            <Info variants={infoVariants}>
              <h4>{item.title}</h4>
            </Info>
          </Card>
        ))}
      </Rows>
      <AnimatePresence>
        {movieModalMatch ? (
          <>
            <ModalBox layoutId={`${id}`}>
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
            </ModalBox>
            <Overlay
              onClick={() => onOverlayClick()}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        ) : null}
      </AnimatePresence>
      <Pagination page={page} setPage={setPage} />
    </Wrapper>
  );
};

export default Search;

const ModalBox = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: 100px;
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
`;
const Rows = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const Wrapper = styled.div`
  width: 100%;
  margin-top: 150px;
`;

const Card = styled(motion.div)<{ bgphoto: string }>`
  width: 285px;
  background-color: white;
  background-image: url(${(prop) => prop.bgphoto});
  background-size: cover;
  background-position: center;
  height: 165px;
  border-radius: 15px;
  margin: 0 5px 35px 5px;
  cursor: pointer;
  &:nth-child(5n + 1) {
    transform-origin: center left;
  }
  &:nth-child(5n) {
    transform-origin: center right;
  }
`;
