// models/SocialLink.js
import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  facebook: { type: String, required: false },
  twitter: { type: String, required: false },
});

const SocialLink = mongoose.model("SocialLink", socialLinkSchema);
export default SocialLink;
