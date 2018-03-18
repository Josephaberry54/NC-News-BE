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
          const { topics } = res.body;
          expect(topics)
            .to.be.an("Array")
            .to.have.length(3);
          expect(topics[0])
            .to.be.an("object")
            .that.has.all.keys("__v", "_id", "title", "slug");
          expect(topics[0].title)
            .to.be.a("string")
            .to.equal("Football");
        });
    });

    describe("/:topic_id/articles", () => {
      it("GET returns status 200 and an object containing an array of all the articles for a certain topic id", () => {
        const topic_id = usefulData.topics[0]._id;
        return request
          .get(`/api/topics/${topic_id}/articles`)
          .expect(200)
          .then(res => {
            const { articles } = res.body;
            expect(articles)
              .to.be.an("Array")
              .to.have.length(1);
            expect(articles[0].belongs_to)
              .to.be.a("string")
              .to.equal(`${topic_id}`);
            expect(articles[0])
              .to.be.an("object")
              .to.have.all.keys([
                "title",
                "body",
                "belongs_to",
                "votes",
                "created_by",
                "_id",
                "__v",
                "comments"
              ]);
            expect(articles[0].comments)
              .to.be.a("number")
              .to.equal(1);
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
          const { articles } = res.body;
          expect(articles[0])
            .to.be.an("object")
            .that.has.all.keys([
              "title",
              "body",
              "belongs_to",
              "votes",
              "created_by",
              "_id",
              "__v",
              "comments"
            ]);
          expect(articles[0].title)
            .to.be.a("string")
            .to.equal("Cats are great");
          expect(articles)
            .to.be.an("array")
            .to.have.length(2);
          expect(articles[0].comments)
            .to.be.a("number")
            .to.equal(1);
        });
    });

    describe("/:article_id/comments", () => {
      it("GET returns status 200 and an object of all the comments for the specified article id", () => {
        const article_id = usefulData.articles[0]._id;
        return request
          .get(`/api/articles/${article_id}/comments`)
          .expect(200)
          .then(res => {
            const { comments } = res.body;
            expect(comments[0].belongs_to)
              .to.be.a("string")
              .to.equal(`${article_id}`);
            expect(comments)
              .to.be.an("array")
              .to.have.length(1);
            expect(comments[0])
              .to.be.an("object")
              .that.has.all.keys([
                "body",
                "belongs_to",
                "votes",
                "created_by",
                "created_at",
                "_id",
                "__v"
              ]);
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
            expect(res.body.commentDoc.belongs_to)
              .to.be.a("string")
              .to.equal(`${article_id}`);
          });
      });
    });

    describe("/:article_id/?vote", () => {
      it("PUT returns status 200 and increments the votes on an article if query vote=up, returning the updated article", () => {
        const article_id = usefulData.articles[0]._id;
        return request
          .put(`/api/articles/${article_id}?vote=up`)
          .expect(200)
          .then(res => {
            const { article } = res.body;
            expect(article).to.be.an("object");
            expect(article.votes)
              .to.be.a("number")
              .equal(1);
          });
      });

      it("PUT returns status 200 and decrements the votes on an article if query vote=down, returning the updated article", () => {
        const article_id = usefulData.articles[0]._id;
        return request
          .put(`/api/articles/${article_id}?vote=down`)
          .expect(200)
          .then(res => {
            const { article } = res.body;
            expect(article.votes)
              .to.be.a("number")
              .equal(-1);
            expect(article).to.be.an("object");
          });
      });
    });
  });

  describe("/comments/:comment_id", () => {
    it("PUT returns status 200 and increments the votes on a comment if query vote=up, returning the updated comment", () => {
      const comment_id = usefulData.comments[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(200)
        .then(res => {
          const { comment } = res.body;
          expect(comment).to.be.an("object");
          expect(comment.votes)
            .to.be.a("number")
            .equal(1);
        });
    });

    it("PUT returns status 200 and decrements the votes on a comment if query vote=down, returning the updated comment", () => {
      const comment_id = usefulData.comments[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(200)
        .then(res => {
          const { comment } = res.body;
          expect(comment).to.be.an("object");
          expect(comment.votes)
            .to.be.a("number")
            .to.equal(-1);
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
    it("DELETE returns an error message when the comment has already been deleted", () => {
      return request
        .delete("/api/comments/5aae4f1916d75d2da5472c68")
        .expect(400)
        .then(res => {
          expect(res.body.message)
            .to.be.a("string")
            .to.equal("no such comment");
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
  describe("/*", () => {
    it("Returns page not found when an invalid route is requested", () => {
      return request
        .get("/*")
        .expect(404)
        .then(res => {
          expect(res.body.message)
            .to.be.a("string")
            .to.equal("page not found");
        });
    });
  });
});
