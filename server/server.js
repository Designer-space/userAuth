import express from "express"
import dotenv from "dotenv"
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js"
import path from "path";
import { fileURLToPath } from "url";

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/users", userRoutes)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, "/client/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/client/dist/index.html"))
})

// app.get("/", (req, res) => {
//   res.send("server is running")
// })

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`server started on port ${port}`))
