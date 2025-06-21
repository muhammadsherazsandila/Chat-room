import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    replyTo: {
      type: String,
      default: null,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", MessageSchema);
