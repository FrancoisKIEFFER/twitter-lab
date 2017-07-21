const express = require("express");
const moment = require("moment");
const tweets = express.Router();
const Tweet = require("../models/tweet")

tweets.get("/", (req, res, next) => {
    Tweet.find({
        user_id: req.session.currentUser._id
    }, "tweet created_at")
    .sort({ created_at: -1 })
    .then((tweets) => {
        res.render("tweets/index", {
            username: req.session.currentUser.username,
            tweets,
            moment
        });
    }).catch((err) => {
        next(err);
    })
});

tweets.get("/new", (req, res, next) => {
  res.render("tweets/new", 
    { username: req.session.currentUser.username });
});

tweets.post("/", (req, res, next) => {
    const {tweet} = req.body;
    const currentTweet = new Tweet({
        tweet,
        user_id: req.session.currentUser._id,
        username: req.session.currentUser.username
    })
    currentTweet.save()
    .then(() => {
        res.redirect("/tweets")
    }).catch((err) => {
        next(err)
    })
})



module.exports = tweets;