const bcrypt = require("bcrypt");
const User = require("../models/User");

async function createUser(userData) {
  if (!userData) throw new Error("User data required");
  if (userData.username) {
    const exists = await User.findOne({ username: userData.username }).exec();
    if (exists) throw new Error("Username taken");
  }
  if (userData.email) {
    const exists = await User.findOne({ email: userData.email }).exec();
    if (exists) throw new Error("Email taken");
  }
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  const user = new User(userData);
  return user.save();
}

async function getUserByUsername(username) {
  const user = await User.findOne({ username }).lean().exec();
  if (!user) throw new Error("User does not exist");
  if (user.links) {
    user.links.sort((a, b) => (a.position || 0) - (b.position || 0));
  }
  return user;
}

async function deleteUserLink(username, linkId) {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User does not exist");
  user.links = (user.links || []).filter((l) => l.id !== linkId);
  user.links.sort((a, b) => (a.position || 0) - (b.position || 0));
  await user.save();
  return user;
}

async function updateUserLink(username, linkId, updatedLink) {
  if (!updatedLink) throw new Error("Updated link must not be null");
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User does not exist");
  if (!user.links || user.links.length === 0)
    throw new Error("No links to update");

  let replaced = false;
  for (let i = 0; i < user.links.length; i++) {
    const current = user.links[i];
    if (current && current.id === linkId) {
      const merged = {
        id: linkId,
        position: updatedLink.position || current.position,
        title: updatedLink.title || current.title,
        url: updatedLink.url || current.url,
        imageUrl: updatedLink.imageUrl || current.imageUrl,
        isActive:
          typeof updatedLink.isActive === "boolean"
            ? updatedLink.isActive
            : current.isActive,
      };
      user.links[i] = merged;
      replaced = true;
      break;
    }
  }

  if (!replaced) throw new Error("Link does not exist");
  user.links.sort((a, b) => (a.position || 0) - (b.position || 0));
  await user.save();
  return user;
}

async function updateUserInfo(
  username,
  { name, email, profilePic, about, password, newUsername }
) {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User does not exist");

  if (newUsername && newUsername !== user.username) {
    const exists = await User.findOne({ username: newUsername }).exec();
    if (exists) throw new Error("Username taken");
    user.username = newUsername;
  }

  if (name && name !== user.name) user.name = name;
  if (email && email !== user.email) {
    const exists = await User.findOne({ email }).exec();
    if (exists) throw new Error("Email taken");
    user.email = email;
  }
  if (profilePic && profilePic !== user.profilePic)
    user.profilePic = profilePic;
  if (about && about !== user.about) user.about = about;
  if (password) user.password = await bcrypt.hash(password, 10);

  await user.save();
  return user;
}

async function updateUserProfileImage(username, url) {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User does not exist");
  user.profilePic = url;
  await user.save();
  return user;
}

async function updateUserLinks(username, links) {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User does not exist");
  if (links) links.sort((a, b) => (a.position || 0) - (b.position || 0));
  user.links = links;
  await user.save();
  return user;
}

async function updateUserSocials(username, socials) {
  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error("User does not exist");
  user.socials = socials;
  await user.save();
  return user;
}

module.exports = {
  createUser,
  getUserByUsername,
  deleteUserLink,
  updateUserLink,
  updateUserInfo,
  updateUserProfileImage,
  updateUserLinks,
  updateUserSocials,
};
