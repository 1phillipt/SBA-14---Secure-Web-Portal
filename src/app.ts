import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use("/api/users", userRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

export default app;