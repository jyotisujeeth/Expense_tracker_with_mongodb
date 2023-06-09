exports.get404 = (req, res, next) => {
  res.status(404).rnder("404", { pageTitle: "Page Not Found", path: "/404" });
};