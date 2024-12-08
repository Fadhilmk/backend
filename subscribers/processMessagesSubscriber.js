import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub();

async function processMessage(message) {
  const data = JSON.parse(Buffer.from(message.data, "base64").toString());
  console.log("Processing message:", data);

  const { igUserId, igScopedId, receivedText, accessToken } = data;

  try {
    const replyText = `Thank you for your message: "${receivedText}"`;

    const response = await fetch(`https://graph.instagram.com/v21.0/${igUserId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: igScopedId },
        message: { text: replyText },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send reply: ${response.statusText}`);
    }

    console.log("Reply sent successfully.");
    message.ack();
  } catch (error) {
    console.error("Error processing message:", error);
  }
}

// Start the subscriber
const subscription = pubsub.subscription("process-messages-topic-sub");
subscription.on("message", processMessage);

console.log("Listening for messages on process-messages-topic...");
