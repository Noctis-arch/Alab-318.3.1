import express from 'express'
const router = express.Router();

import posts from '../data/posts.js';
import error from '../utilities/error.js';
import comments from "../data/comments.js";

router
  .route("/")
  .get((req, res) => {
  let results = posts;

  if (req.query.userId) {
    results = results.filter((p) => p.userId == req.query.userId);
  }

  const links = [
    {
      href: "posts/:id",
      rel: ":id",
      type: "GET",
    },
  ];

  res.json({ posts: results, links });
})
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

  router.get("/:id/comments", (req, res, next) => {
  let results = comments.filter((c) => c.postId == req.params.id);

  if (req.query.userId) {
    results = results.filter((c) => c.userId == req.query.userId);
  }

  if (results.length > 0) {
    res.json({ comments: results });
  } else {
    next();
  }
});

export default router