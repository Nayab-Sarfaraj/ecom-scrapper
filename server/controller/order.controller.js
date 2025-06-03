const Order = require("../models/order.model");
const Errorhandler = require("../utils/errorHandler");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const placeOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(
        new Errorhandler("Order must contain at least one item.", 400)
      );
    }

    for (const item of items) {
      if (
        !item.product ||
        !mongoose.Types.ObjectId.isValid(item.product) ||
        !item.quantity ||
        item.quantity <= 0
      ) {
        return next(
          new Errorhandler(
            "Each order item must have a valid product ID and a positive quantity.",
            400
          )
        );
      }
    }

    // Validate shipping address
    if (!shippingAddress) {
      return next(new Errorhandler("Shipping address is required.", 400));
    }

    const { street, city, state, postalCode, country } = shippingAddress;

    if (!street || typeof street !== "string") {
      return next(
        new Errorhandler("Shipping address must include a valid street.", 400)
      );
    }
    if (!city || typeof city !== "string") {
      return next(
        new Errorhandler("Shipping address must include a valid city.", 400)
      );
    }
    if (!state || typeof state !== "string") {
      return next(
        new Errorhandler("Shipping address must include a valid state.", 400)
      );
    }
    if (!postalCode || typeof postalCode !== "string") {
      return next(
        new Errorhandler(
          "Shipping address must include a valid postal code.",
          400
        )
      );
    }
    if (!country || typeof country !== "string") {
      return next(
        new Errorhandler("Shipping address must include a valid country.", 400)
      );
    }

    let totalPrice = 0;
    const result = [];
    for (const item of items) {
      totalPrice += item.price * item.quantity;
      const prd = await Product.findById(item.product);
      if (prd.stock < item.quantity)
        return next(new Errorhandler("Out of Stock", 401));
      prd.stock -= item.quantity;
      const order = await Order.create({
        buyer: req.user._id,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        totalPrice,
        shippingAddress: {
          street,
          state,
          city,
          country,
          postalCode,
        },
        vendor: prd.vendor,
      });

      await prd.save();
      result.push(order);
    }
    return res.status(200).json({ success: true, orders: result });
  } catch (error) {
    console.log("ERROR WHILE PLACING THE ORDER");
    console.log(error.message);
    return next(new Errorhandler("Something went wrong", 500));
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { paymentStatus } = req.body;

    // Validate input
    if (
      !paymentStatus ||
      !["Pending", "Paid", "Failed", "Refunded"].includes(paymentStatus)
    ) {
      return next(new Errorhandler("Invalid payment status provided.", 400));
    }

    // Find the order by ID and update the payment status
    const order = await Order.findOne({ _id: id, vendor: req.user._id });
    if (!order) {
      return next(new Errorhandler("Order not found.", 404));
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return next(new Errorhandler("Internal Server Error", 500));
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { orderStatus } = req.body;

    // Validate input
    if (
      !orderStatus ||
      !["Processing", "Shipped", "Delivered", "Cancelled"].includes(orderStatus)
    ) {
      return next(new Errorhandler("Invalid order status provided.", 400));
    }

    // Find the order by ID and update the order status
    const order = await Order.findOne({ _id: id, vendor: req.user._id });
    if (!order) {
      return next(new Errorhandler("Order not found.", 404));
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return next(new Errorhandler("Internal Server Error", 500));
  }
};

const getVendorOrders = async (req, res, next) => {
  try {
    // Assuming the vendor ID is available from the authenticated user (req.user)
    const vendorId = req.user._id;

    // Fetch orders where the vendor matches the authenticated user
    const orders = await Order.find({ vendor: vendorId })
      .populate("buyer", "name email") // Populate buyer details (optional)
      .populate("product", "name price"); // Populate product details (optional)
    console.log(orders);
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this vendor.",
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return next(new Errorhandler("Internal Server Error", 500));
  }
};
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("buyer", "name email") // Populate buyer details (optional)
      .populate("product", "name price");
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(`error while fetching the order`, error.message);
    return next(new Errorhandler("Internal Server Error", 500));
  }
};
const fetchUserOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate(
      "product",
      "name coverImage price category"
    );
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("ERROR WHILE FETCHING THE USER ORDER");
    console.log(error);
    return next(new Errorhandler("Internal server error", 500));
  }
};
module.exports = {
  placeOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getVendorOrders,
  getOrderById,
  fetchUserOrder,
};
