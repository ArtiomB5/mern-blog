import PostModel from "../models/Post.js";

export const remove = async (request, response) => {
  try {
    const postId = request.params.id;
    const filter = { _id: postId }; // find post by id
    PostModel.findOneAndDelete(filter)
      .then((document) => {
        if (!document) {
          return response.status(404).json({
            message: "Не удалось найти статью",
          });
        }

        return response.json({
          success: true
        });
      })
      .catch((error) => {
        console.log("----- ----- -----");
        console.log("PostController - remove", error);
        console.log("----- ----- -----");
        if (error) {
          return response.status(500).json({
            message: "Не удалось удалить статью",
          });
        }
      });
  } catch (error) {
    console.log("----- ----- -----");
    console.log("PostController - remove", error);
    console.log("----- ----- -----");
    response.status(500).json({
      message: "Не удалось удалить статью!",
    });
  }
};

export const getOne = async (request, response) => {
  try {
    const postId = request.params.id;
    const filter = { _id: postId }; // find post by id
    const update = { $inc: { viewsCount: 1 } }; // inc views count by 1
    PostModel.findOneAndUpdate(filter, update, {
      returnDocument: "after", // return updated post data after update
    })
      .then((document) => {
        // this func describe what to do if we get an error and what to do after doc update
        if (!document) {
          return response.status(404).json({
            message: "Не удалось найти статью",
          });
        }

        return response.json(document);
      })
      .catch((error) => {
        console.log("----- ----- -----");
        console.log("PostController - getOne", error);
        console.log("----- ----- -----");
        if (error) {
          return response.status(500).json({
            message: "Не удалось вернуть статью",
          });
        }
      });
  } catch (error) {
    console.log("----- ----- -----");
    console.log("PostController - getOne", error);
    console.log("----- ----- -----");
    response.status(500).json({
      message: "Не удалось получить статью!",
    });
  }
};

export const getAll = async (request, response) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    //populate creates connection with users table, exec - execute request
    if (!posts) {
      return response.status(404).json({
        message: "Посты не найдены",
      });
    }

    return response.json(posts);
  } catch (error) {
    console.log("----- ----- -----");
    console.log("PostController - getAll", error);
    console.log("----- ----- -----");
    response.status(500).json({
      message: "Не удалось получить посты!",
    });
  }
};

export const create = async (request, response) => {
  try {
    const doc = new PostModel({
      title: request.body.title,
      text: request.body.text,
      tags: request.body.tags,
      imageUrl: request.body.imageUrl,
      user: request.userId,
    });

    const post = await doc.save();
    response.json(post);
  } catch (error) {
    console.log("----- ----- -----");
    console.log("PostController - create", error);
    console.log("----- ----- -----");
    response.status(500).json({
      message: "Не удалось создать статью!",
    });
  }
};

export const update = async (request, response) => {
  try {
    const postId = {_id: request.params.id};
    const postContent = {
      title: request.body.title,
      text: request.body.text,
      tags: request.body.tags,
      imageUrl: request.body.imageUrl,
      user: request.userId,
    }
    await PostModel.updateOne(postId, postContent)

    response.json({success: true})
  } catch (error) {
    console.log("----- ----- -----");
    console.log("PostController - update", error);
    console.log("----- ----- -----");
    response.status(500).json({
      message: "Не удалось обновить статью!",
    });
  }
}