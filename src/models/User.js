const mongoose = require("mongoose");

const SocialSchema = new mongoose.Schema({
  platform: { type: String },
  url: { type: String },
});

const LinkSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  imageUrl: { type: String },
  title: { type: String },
  url: { type: String },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true },
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  profilePic: { type: String },
  about: { type: String },
  socials: { type: [SocialSchema], default: [] },
  links: { type: [LinkSchema], default: [] },
  password: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
