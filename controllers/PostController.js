import PostModel from "../models/Post";

export const create = async (request, response) => {
  try {
    const doc = new PostModel({
      title: request.body.title,
      text: request.body.text,
      tags: request.body.tags,
      imageUrl: request.body.imageUrl,
      user: request.userId,
    });
  } catch (error) {
    response.status(500).json({
      message: "Не удалось создать пост!",
    });
  }
};
