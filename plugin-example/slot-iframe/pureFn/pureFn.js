const o = () => new Promise((e) => {
  console.log("running pure fn ..."), setTimeout(() => {
    e(!0), console.log("finish pure fn");
  }, 3e3);
});
export {
  o as default
};
