export const rowVariants = {
  hidden: (direction: boolean) => {
    return {
      x: direction ? window.innerWidth : -window.innerWidth,
    };
  },
  visible: {
    x: 0,
  },
  exit: (direction: boolean) => {
    return {
      x: direction ? -window.innerWidth : window.innerWidth,
    };
  },
};

export const boxVariants = {
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

export const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.1,
      delay: 0.5,
    },
  },
};
