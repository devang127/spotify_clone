const express = require('express');
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Song = require("../models/Song");

// POST: Like a song
router.post("/like", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { songId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ensure `likedSongs` is an array
        if (!Array.isArray(user.likedSongs)) {
            user.likedSongs = [];
        }

        // Check if the song is already liked
        if (user.likedSongs.includes(songId)) {
            return res.status(400).json({ error: "Song already liked" });
        }

        // Add the song to the user's liked songs
        user.likedSongs.push(songId);
        await user.save();

        res.status(200).json({ message: "Song liked successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch liked songs
router.get("/likedSongs", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate({
            path: "likedSongs",
            populate: {
                path: "artist",
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ likedSongs: user.likedSongs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/unlike", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { songId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove the song from the user's liked songs
        user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId);
        await user.save();

        res.status(200).json({ message: "Song unliked successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;