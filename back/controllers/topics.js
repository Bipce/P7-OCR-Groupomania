const { getManager } = require("typeorm");
const HttpError = require("../utils/http-error");

const Topic = require("../models/topics");
const deleteMessageWithImages = require("../utils/delete-message");
const fs = require("fs").promises;

exports.createTopic = async (req, res) => {
  const { title, content } = req.body;
  const { files } = req;

  const entityManager = getManager();

  let imagesUrl = "";
  if (files) {
    for (let i = 0; i < files.length; i++) {
      imagesUrl += files[i].filename;
      if (i < files.length - 1) imagesUrl += "|";
    }
  }

  const topic = {
    title,
    created: Date.now(),
    user: req.user,
    content,
    imagesUrl,
  };

  try {
    await entityManager.save(Topic, topic);
    res.status(201).json({ id: topic.id });
  } catch (error) {
    throw new HttpError(error, 400);
  }
};

exports.deleteTopic = async (req, res) => {
  const entityManager = getManager();

  const topic = await entityManager.findOne(Topic, req.params.id, {
    relations: ["user", "messages"],
  });

  if (!topic) throw new HttpError("Not found !", 404);

  if (req.user.id !== topic.user.id && req.user.isAdmin !== 1)
    throw new HttpError("You are not allowed !", 403);

  for (const message of topic.messages) {
    deleteMessageWithImages(message);
  }

  if (topic.imagesUrl) {
    const images = topic.imagesUrl.split("|");
    for (const image of images) {
      await fs.unlink(`./images/${image}`);
    }
  }

  delete topic.user.password;

  await entityManager.delete(Topic, topic.id);
  res.status(200).json(topic);
};

exports.getTopic = async (req, res) => {
  const entityManager = getManager();

  const topic = await entityManager.findOne(Topic, req.params.id, {
    relations: ["user", "messages", "messages.user"],
  });

  delete topic.user.password;

  for (const message of topic.messages) {
    delete message.user.password;
  }

  if (!topic) throw new HttpError("Topic not found!", 404);
  res.status(201).json(topic);
};

exports.getTopics = async (req, res) => {
  const entityManager = getManager();

  const topics = await entityManager.find(Topic, {
    relations: ["user"],
  });

  for (const topic of topics) {
    delete topic.user.password;
  }

  if (!topics) throw new HttpError("Topic not found!", 404);
  res.status(200).json(topics);
};
