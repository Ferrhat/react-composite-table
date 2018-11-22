// eslint-disable-next-line no-multi-assign
const raf = global.requestAnimationFrame = (cb) => {
    setTimeout(cb, 0);
};

// eslint-disable-next-line no-use-before-define
export default raf;