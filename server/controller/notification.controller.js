const Notification = require("../models/notification.model");
// const Notification = require("../models/notification.model");

const createNotification = async (title, user, product, to) => {
  try {
    const content = {
      user: user._id,
      product: product._id,
    };
    const notification = await Notification.create({ title, content, to });
    console.log(notification);
    return notification;
  } catch (error) {
    console.log("ERROR WHILE CERATEING NOTIFICATION");
    console.log(error);
    return next(new Errorhandler("Something went wrong"));
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const id = req?.user;
    const notifications = await Notification.find({
      $and: [{ to: id }, { seen: false }],
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.log("ERROR WHILE GETTING NOTIFICATIONS");
    console.log(error);
    return next(new Errorhandler("Something went wrong"));
  }
};
const getNotification = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(req.params);
    const notification = await Notification.findById(id)
      .populate("content.user")
      .populate("content.product");
    console.log(notification);
    return res.status(200).json({ success: true, notification });
  } catch (error) {
    console.log("ERROR WHILE GETTING NOTIFICATION");
    console.log(error);
    return next(new Errorhandler("Something went wrong"));
  }
};
module.exports = { createNotification, getNotifications, getNotification };
