import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ITv, ITvResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import useTv from "../hooks/useTv";
import TvSliderBox from "../Components/TvSliderBox";

const TV = () => {
  const [recentId, setRecentId] = useState<number>(84773);
  const navigate = useNavigate();
  const bigTvMatch = useMatch(`/tv/:link/:id`);
  let { link, id } = useParams();
  const onOverlayClick = () => navigate(-1);
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 100);
  const { TV } = useTv(recentId);
  const foundTv = () => {
    if (link) {
      if (link === "nowPlaying") {
        let tv = TV[0].data?.results.find((tv: ITv) => tv.id + "" === id);
        console.log(tv);
        return tv;
      } else if (link === "popular") {
        let tv = TV[1].data?.results.find((tv: ITv) => tv.id + "" === id);
        return tv;
      } else if (link === "similar") {
        let tv = TV[2].data?.results.find((tv: ITv) => tv.id + "" === id);
        return tv;
      } else if (link === "topRated") {
        let tv = TV[3].data?.results.find((tv: ITv) => tv.id + "" === id);
        return tv;
      }
    }
  };
  return (
    <Wrapper>
      {TV[0].isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(TV[0].data?.results[0].backdrop_path || "")}
          >
            <Title>{TV[0].data?.results[0].name}</Title>
            <Overview>{TV[0].data?.results[0].overview}</Overview>
          </Banner>

          <TvSliderBox
            nowPlaying={TV[0].data as ITvResult}
            popular={TV[1].data as ITvResult}
            similar={TV[2].data as ITvResult}
            setRecentId={setRecentId}
            topRated={TV[3].data as ITvResult}
          />

          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <BigTv style={{ top: setScrollY }} layoutId={`${link} ${id}`}>
                  {foundTv() && (
                    <>
                      <BigCover
                        imagePath={makeImagePath(
                          foundTv()?.backdrop_path as string,
                          "w500"
                        )}
                      />
                      <BigTitle>{foundTv()?.name}</BigTitle>
                      <BigOverview length={foundTv()?.overview.length}>
                        {foundTv()?.overview}
                      </BigOverview>
                    </>
                  )}
                </BigTv>
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

export default TV;

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

const BigTv = styled(motion.div)`
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
  font-size: 25px;
  position: relative;
  top: -85px;
`;

export const BigOverview = styled.p<{ length: number }>`
  position: relative;
  top: -80px;
  color: ${(prop) => prop.theme.white.lighter};
  padding: 15px;
  font-size: ${(prop) => (prop.length < 350 ? `18px` : `12px`)};
`;
