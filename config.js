module.exports = {
  DB: {
    production: "mongodb://joeberry:mongoose@ds215759.mlab.com:15759/nc-news",
    test: "mongodb://localhost/northcoders-news-api-test",
    dev: "mongodb://localhost/northcoders-news-api"
  },
  PORT: {
    test: 3090,
    dev: 3000
  }
};
