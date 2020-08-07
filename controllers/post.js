const asyncHandler = require("./../middlewares/asyncHandler");
const ErrorResponse = require("./../utils/errorClass");
const Response = require("./../utils/reponseClass");
const Profile = require("../models/Profile");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = asyncHandler(async (req, res, next) => {
  let post = {
    user: req.user.id,
    profile: req.params.id,
    text: req.body.text,
  };
  post = await Post.create(post);
  post = await Post.findById(post.id).populate("user", ["name", "image"]);
  res.response = new Response(201, post);
  next();
});

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  res.response = new Response(200, res.results, res.pagination);
  next();
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "name image",
      },
    })
    .populate({
      path: "user",
      select: "name image",
    });
  res.response = new Response(200, post);
  next();
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = {
    text: req.body.text,
  };
  post = await Post.findByIdAndUpdate(req.params.id, post, {
    runValidators: true,
    new: true,
  }).populate("user", ["name", "image"]);
  res.response = new Response(200, post);
  next();
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  await res.result.remove();
  res.response = new Response(200, {});
  next();
});

exports.likeDislikePost = asyncHandler(async (req, res, next) => {
  const like = res.result.likes.filter(
    (like) => like.user.toString() === req.user.id
  );
  if (like.length > 0) {
    res.result.likes.forEach((like) => {
      if (like.user.toString() === req.user.id) {
        const removeIndex = res.result.likes.indexOf(like);
        res.result.likes.splice(removeIndex, 1);
      }
    });
  } else {
    const newlike = {
      user: req.user.id,
    };
    const likes = res.result.likes.push(newlike);
    createNotification(req, res, "liked");
  }
  await res.result.save();
  res.response = new Response(200, res.result.likes);
  next();
});

exports.likeCredentials = asyncHandler(async (req, res, next) => {
  const likes = res.result.likes;
  let users = likes.map(async (like) => {
    return await Profile.findOne({ user: like.user }).populate({
      path: "user",
      select: "name image",
    });
  });
  users = await Promise.all(users);
  res.response = new Response(200, users);
  next();
});

exports.addcomment = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  let comment = {
    user: req.user.id,
    text: req.body.text,
  };
  post.comments.push(comment);
  await post.save();
  createNotification(req, res, "commented on");
  post = await Post.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "name image",
      },
    })
    .populate({
      path: "user",
      select: "name image",
    });
  res.response = new Response(201, post.comments);
  next();
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = res.result.comments.find(
    (comment) => comment._id.toString() === req.params.commentId
  );

  if (!comment) {
    return next(new ErrorResponse("Comment not Found"), 400);
  }
  if (comment.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to delete this comment"),
      401
    );
  }
  res.result.comments.forEach((comment) => {
    if (comment._id.toString() === req.params.commentId) {
      console.log(comment);
      const removeIndex = res.result.comments.indexOf(comment);
      res.result.comments.splice(removeIndex, 1);
    }
  });
  await res.result.save();
  res.response = new Response(200, res.result.comments);
  next();
});

//Static Method
const createNotification = async (req, res, task) => {
  if (res.result.user.toString() !== req.user.id.toString()) {
    const logger = await User.findById(req.user.id);
    let owner = await Post.findById(req.params.id).populate("profile");
    let ownerProfile = await Profile.findById(owner.profile._id).select(
      "+notifications"
    );
    const mesg = `${
      logger.name.charAt(0).toUpperCase() + logger.name.slice(1)
    } ${task} your post with id ${owner._id.toString()} `;
    const removeIndex = ownerProfile.notifications.indexOf(mesg);
    if (removeIndex !== -1) {
      ownerProfile.notifications.splice(removeIndex, 1);
    }
    ownerProfile.notifications.push(mesg);
    await ownerProfile.save();
  }
};
