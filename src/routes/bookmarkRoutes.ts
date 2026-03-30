import express, { Request, Response } from "express";
import Bookmark from "../models/Bookmark.js";
import {
  authMiddleware,
  AuthRequest,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create bookmark
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, url, note } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and url are required" });
    }

    const bookmark = await Bookmark.create({
      title,
      url,
      note,
      user: req.user!.userId,
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all bookmarks for logged-in user
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user!.userId });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get one bookmark for logged-in user
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user!.userId,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update bookmark for logged-in user
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const updatedBookmark = await Bookmark.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user!.userId,
      },
      req.body,
      { new: true }
    );

    if (!updatedBookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json(updatedBookmark);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete bookmark for logged-in user
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const deletedBookmark = await Bookmark.findOneAndDelete({
        _id: req.params.id,
        user: req.user!.userId,
      });

      if (!deletedBookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }

      res.status(200).json({ message: "Bookmark deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;