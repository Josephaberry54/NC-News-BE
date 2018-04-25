# Northcoders News

Northcoders news is the repository for my RESTful API based on Reddit. The repository has a database of articles, topics, comments and users and allows for comments to be added to articles. Both articles and comments can also be voted on. For information on the routes available please refer to the Routes section below. Northcoders News was built using [Node.js](https://nodejs.org/en/) (v9.7.1), [Express](https://expressjs.com/) (v4.14.0), [MongoDB](https://www.mongodb.com/) (v3.6.3) and [Mongoose](http://mongoosejs.com/) (v5.0.0). The link to my API on Heroku is [here](https://arcane-peak-29702.herokuapp.com/api/). The Database is hosted on MLab.

## Getting Started

The instructions below will get you a copy of my project up and running on your local machine for development and testing purposes.

## Installation

Check you have [Node.js](https://nodejs.org/en/) installed:

```
npm --v
```

Check you have [MongoDB](https://www.mongodb.com/download-center#community) installed:

```
mongo --version
```

Check you have [git](https://git-scm.com/downloads) installed:

```
git --version
```

Clone my repository:

```
git clone https://github.com/Josephaberry54/NC-News-BE
```

Navigate in to the cloned repository using the cd command and then install all the dependencies:

```
npm install
```

Start MongoDB:

```
mongod
```

Seed the development database in a new terminal window:

```
npm run seed:dev
```

Run the server on your local machine:

```
npm run dev
```

This will allow the API to be accessed through port 3000.

## Running the tests

To test the endpoints on your API use the command

```
npm test
```

This will seed the test database and run tests.

## Routes

```
GET /api/topics
```

Returns all the topics

```
GET /api/topics/:topic_id/articles
```

Returns all the articles for a certain topic

```
GET /api/articles
```

Returns all the articles

```
GET /api/articles/:article_id/comments
```

Returns all the comments for an individual article

```
POST /api/articles/:article_id/comments
```

Adds a new comment to an article. This route requires a JSON body with a key/value pair for comment, belongs_to and created_by, must be valid ids e.g: {"comment": "This is my new comment", "belongs_to": "", created_by: ""}

```
PUT /api/articles/:article_id
```

Increments or Decrements the votes of an article by one. This route requires a vote query of 'up' or 'down' e.g: http://arcane-peak-29702.herokuapp.com/api/articles/:article_id?vote=up

```
PUT /api/comments/:comment_id
```

Increments or Decrements the votes of a comment by one. This route requires a vote query of 'up' or 'down' e.g: http://arcane-peak-29702.herokuapp.com/api/comments/:comment_id?vote=down

```
DELETE /api/comments/:comment_id
```

Deletes a comment

```
GET /api/users/:user_id
```

Returns the profile data for the specified user.
