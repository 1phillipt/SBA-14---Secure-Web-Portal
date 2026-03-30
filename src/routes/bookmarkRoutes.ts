import express, { Request, Response } from "express";
import Bookmark from "../models/Bookmark.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, url, note } = req.body;

    if (!title || !url) {
      res.status(400).json({ message: "Title and url are required" });
      return;
    }

    const bookmark = await Bookmark.create({
      title,
      url,
      note,
      user: req.user!.userId,
    });

    res.status(201).json(bookmark);
  } catch (error) {
    console.error("Create bookmark error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user!.userId });
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user!.userId,
    });

    if (!bookmark) {
      res.status(404).json({ message: "Bookmark not found" });
      return;
    }

    res.status(200).json(bookmark);
  } catch (error) {
    console.error("Get one bookmark error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const updatedBookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.userId },
      req.body,
      { new: true }
    );

    if (!updatedBookmark) {
      res.status(404).json({ message: "Bookmark not found" });
      return;
    }

    res.status(200).json(updatedBookmark);
  } catch (error) {
    console.error("Update bookmark error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user!.userId,
    });

    if (!deletedBookmark) {
      res.status(404).json({ message: "Bookmark not found" });
      return;
    }

    res.status(200).json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;