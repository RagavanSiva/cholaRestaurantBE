require("dotenv").config();
const express = require("express");
const app = express();
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const PORT = process.env.PORT || 3500;

connectDB();
// app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/category", require("./routes/categoryRoutes"));
app.use("/product", require("./routes/productRoutes"));
app.use("/customer", require("./routes/customerRoutes"));
app.use("/employee", require("./routes/employeeRoutes"));
app.use("/table", require("./routes/tableRoutes"));

app.get("/", (req, res) => {
  res.json({
    message: "Main Service",
  });
});
app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("connection to MongoDB");
  app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}\n`,
    "mongoErrLog.log"
  );
});
