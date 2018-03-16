process.env.NODE_ENV = "test";
const app = require("../server");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");

describe("/api", () => {
  after(() => {
    return mongoose.disconnect();
  });
  describe("/topics", () => {
    it("GET returns status 200 and an object of all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.be.an("object");
          expect(res.body.topics[0].title)
            .to.be.a("string")
            .to.equal("Football");
        });
    });
    describe("/", () => {
      it("", () => {});
    });
  });
});
