const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();
const userService = require("../services/userService");
const supabase = require("../services/supabaseService");

router.get("/", (req, res) => res.send("Successful handshake"));

router.get("/:username", async (req, res) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:username/update-info", async (req, res) => {
  try {
    // allow renaming username via newUsername field
    const updated = await userService.updateUserInfo(req.params.username, {
      ...req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:username/update-links", async (req, res) => {
  try {
    const updated = await userService.updateUserLinks(
      req.params.username,
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:username/update-link/:linkId", async (req, res) => {
  try {
    const updated = await userService.updateUserLink(
      req.params.username,
      req.params.linkId,
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:username/update-socials", async (req, res) => {
  try {
    const updated = await userService.updateUserSocials(
      req.params.username,
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:username/delete-link/:linkId", async (req, res) => {
  try {
    const updated = await userService.deleteUserLink(
      req.params.username,
      req.params.linkId
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put(
  "/:username/upload-profile-picture",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file provided" });
      const fileName = `avatars/${Date.now()}-${req.file.originalname}`;
      const url = await supabase.uploadFile(
        req.file.buffer,
        fileName,
        req.file.mimetype
      );
      const updated = await userService.updateUserProfileImage(
        req.params.username,
        url
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
