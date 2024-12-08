import { PubSub } from "@google-cloud/pubsub";
import { db } from "../firebaseAdmin"; // Firebase Admin setup

const pubsub = new PubSub();

async function processCommentMessage(message) {
  const data = JSON.parse(Buffer.from(message.data, "base64").toString());
  console.log("Received comment message:", data);

  const { igUserId, mediaId, commentId, text, fromId, username } = data;

  try {
    const docRef = db.collection("webhooks").doc(igUserId).collection("comments").doc(commentId);
    await docRef.set({ mediaId, text, fromId, username, processedAt: new Date().toISOString() });

    console.log(`Comment ${commentId} processed successfully.`);
    message.ack();
  } catch (error) {
    console.error("Error processing comment message:", error);
  }
}

// Start the subscriber
const subscription = pubsub.subscription("process-comments-topic-sub");
subscription.on("message", processCommentMessage);

console.log("Listening for messages on process-comments-topic...");
