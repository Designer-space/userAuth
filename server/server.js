import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import path from "path";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js"

import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(notFound)
app.use(errorHandler)
app.use("/api/users", userRoutes)

const __dirname = path.dirname()

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  })
}

app.listen(port, () => {
  console.log(`server started on port ${port}`)
  connectDB()
})
