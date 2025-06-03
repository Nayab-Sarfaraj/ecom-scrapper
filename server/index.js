const express = require("express");
const connectToDB = require("./db/connection");
const cors = require("cors");
const customErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const server = express();
connectToDB();
server.use(express.json());
server.use(
  cors({ credentials: true, origin: ["https://ecom-scrapper.vercel.app/"] })
);
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
const userRouter = require("./routes/user.routes");
server.use("/api/v1", userRouter);
const productRouter = require("./routes/product.routes");
server.use("/api/v1", productRouter);
const orderRouter = require("./routes/order.routes");
server.use("/api/v1", orderRouter);
const paymentRouter = require("./routes/payment.routes");
server.use("/api/v1", paymentRouter);
const notificationRouter = require("./routes/notification.routes");
server.use("/api/v1", notificationRouter);
server.use(customErrorHandler);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
