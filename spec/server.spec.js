process.env.NODE_ENV = "test";
const { DB } = require("../config");

const app = require("../server");
const request = require("supertest")(app);
const { expect } = require("chai");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const saveTestData = require("../seed/test.seed");

describe("/api", () => {
  let usefulData;
  beforeEach(() => {
    return saveTestData(DB[process.env.NODE_ENV]).then(data => {
      usefulData = data;
    });
  });
  after(() => {
    return mongoose.disconnect();
  });
  describe("/topics", () => {
    it("GET returns status 200 and an object containing an array of all the topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.be.an("object");
          expect(res.body.topics[0].title).to.be.a("string");
        });
    });
    describe("/:topic_id/articles", () => {
      it("GET returns status 200 and an object containing an array of all the articles for a certain topic", () => {
        const topic_id = usefulData.topics[0]._id;
        return request
          .get(`/api/topics/${topic_id}/articles`)
          .expect(200)
          .then(res => {
            expect(res.body.articles[0].belongs_to).to.equal(`${topic_id}`);
          });
      });
    });
  });
  describe("/articles", () => {
    it("GET returns status 200 and an object containing an array of all the articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.be.an("object");
          expect(res.body.articles[0].title).to.be.a("string");
          expect(res.body.articles.length).to.equal(2);
        });
    });
    describe("/:article_id/comments", () => {
      it("GET returns status 200 and an object of all the comments for the specified article", () => {
        const article_id = usefulData.articles[0]._id;
        return request
          .get(`/api/articles/${article_id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments[0].belongs_to).to.equal(`${article_id}`);
            expect(res.body.comments.length).to.equal(1);
          });
      });
      it("POST returns status 201 and the comment object that was posted", () => {
        const article_id = usefulData.articles[0]._id;
        return request
          .post(`/api/articles/${article_id}/comments`)
          .set("content-type", "application/json")
          .send({ comment: "post request comment" })
          .expect(201)
          .then(res => {
            expect(res.body.commentDoc).to.be.an("Object");
            expect(res.body.commentDoc.belongs_to).to.equal(`${article_id}`);
          });
      });
    });
    describe("/:article_id/?vote", () => {
      it("PUT returns status 200 and increments the votes on an article if query vote=up", () => {
        const article_id = usefulData.articles[0]._id;
        return request
          .put(`/api/articles/${article_id}?vote=up`)
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(1);
          });
      });
      it("PUT returns status 200 and decrements the votes on an article if query vote=down", () => {
        const article_id = usefulData.articles[0]._id;
        return request
          .put(`/api/articles/${article_id}?vote=down`)
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(-1);
          });
      });
    });
  });
  describe("/comments/:comment_id", () => {
    it("PUT returns status 200 and increments the votes on a comment if query vote=up", () => {
      const comment_id = usefulData.comments[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(1);
        });
    });
    it("PUT returns status 200 and decrements the votes on a comment if query vote=down", () => {
      const comment_id = usefulData.comments[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(-1);
        });
    });
    it("DELETE returns status 200 and returns the comment that was deleted", () => {
      const comment_id = usefulData.comments[1]._id;
      return request
        .delete(`/api/comments/${comment_id}`)
        .expect(200)
        .then(res => {
          const { _id, body } = res.body.deletedComment;
          expect(body)
            .to.be.a("string")
            .to.equal("this is another comment");
          expect(_id)
            .to.be.a("string")
            .to.equal(`${comment_id}`);
        });
    });
  });
  describe("/users/:user_id", () => {
    it("GET returns status 200 and an object of a specified users profile", () => {
      const user_id = usefulData.user._id;
      return request
        .get(`/api/users/${user_id}`)
        .expect(200)
        .then(res => {
          const { user } = res.body;
          expect(user).to.be.an("object");
          expect(user.username)
            .to.be.a("string")
            .to.equal("northcoder");
          expect(user._id)
            .to.be.a("string")
            .to.equal(`${user_id}`);
        });
    });
  });
});
