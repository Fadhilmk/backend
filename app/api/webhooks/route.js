// import { NextResponse } from "next/server";
// import { PubSub } from "@google-cloud/pubsub"; // Pub/Sub for publishing events
// import { initAdmin } from "../../../firebaseAdmin"; // Firebase Admin
// import crypto from "crypto"; // For signature verification

// // Initialize Firebase Admin SDK

// // Initialize Pub/Sub
// const pubsub = new PubSub();

// // Function to publish a message to a Pub/Sub topic
// async function publishToPubSub(topicName, data) {
//   initAdmin();
//   const dataBuffer = Buffer.from(JSON.stringify(data));
//   await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
//   console.log(`Published message to topic: ${topicName}`);
// }

// // Handle GET request for webhook verification
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

//   if (mode === "subscribe" && token === VERIFY_TOKEN) {
//     console.log("Webhook verification successful.");
//     return new NextResponse(challenge, {
//       status: 200,
//       headers: { "Content-Type": "text/plain" },
//     });
//   } else {
//     console.error("Webhook verification failed: Invalid verify token or mode.");
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }
// }

// // Handle POST request for event notifications
// export async function POST(req) {
//   const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
//   const X_HUB_SIGNATURE = req.headers.get("x-hub-signature-256");

//   const body = await req.text();
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error("Invalid signature. Webhook payload not genuine.");
//     return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log("Webhook event received:", jsonBody);

//   try {
//     for (const entry of jsonBody.entry) {
//       const userId = entry.id;

//       // Process Messaging Events
//       if (entry.messaging) {
//         for (const messagingEvent of entry.messaging) {
//           if (messagingEvent.message) {
//             await publishToPubSub("process-messages-topic", {
//               igUserId: userId,
//               igScopedId: messagingEvent.sender.id,
//               receivedText: messagingEvent.message.text,
//               accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
//             });
//           }
//         }
//       }

//       // Process Comment Events
//       if (entry.changes) {
//         for (const change of entry.changes) {
//           if (change.field === "comments") {
//             await publishToPubSub("process-comments-topic", change.value);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error processing webhook event:", error);
//   }

//   return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
// }

// // Function to verify webhook signature
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith("sha256=")) return false;
//   const signatureHash = hubSignature.split("sha256=")[1];
//   const expectedHash = crypto
//     .createHmac("sha256", appSecret)
//     .update(payload)
//     .digest("hex");
//   return crypto.timingSafeEqual(
//     Buffer.from(signatureHash),
//     Buffer.from(expectedHash)
//   );
// }

// import { NextResponse } from "next/server";
// import { PubSub } from "@google-cloud/pubsub"; // Pub/Sub for publishing events
// import { initAdmin } from "../../../firebaseAdmin"; // Firebase Admin setup
// import crypto from "crypto"; // For signature verification

// // Initialize Firebase Admin SDK


// // Initialize Pub/Sub
// const pubsub = new PubSub();

// // Function to publish a message to a Pub/Sub topic
// async function publishToPubSub(topicName, data) {
//   initAdmin();
//   const dataBuffer = Buffer.from(JSON.stringify(data));
//   await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
//   console.log(`Published message to topic: ${topicName}`);
// }

// // Handle GET request for webhook verification
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

//   if (mode === "subscribe" && token === VERIFY_TOKEN) {
//     console.log("Webhook verification successful.");
//     return new NextResponse(challenge, {
//       status: 200,
//       headers: { "Content-Type": "text/plain" },
//     });
//   } else {
//     console.error("Webhook verification failed: Invalid verify token or mode.");
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }
// }

// // Handle POST request for event notifications
// export async function POST(req) {
//   const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
//   const X_HUB_SIGNATURE = req.headers.get("x-hub-signature-256");

//   const body = await req.text();
//   const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

//   if (!isValid) {
//     console.error("Invalid signature. Webhook payload not genuine.");
//     return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log("Webhook event received:", jsonBody);

//   // Handle events asynchronously
//   (async () => {
//     try {
//       for (const entry of jsonBody.entry) {
//         const userId = entry.id;

//         // Process Messaging Events
//         if (entry.messaging) {
//           for (const messagingEvent of entry.messaging) {
//             if (messagingEvent.message) {
//               await publishToPubSub("process-messages-topic", {
//                 igUserId: userId,
//                 igScopedId: messagingEvent.sender.id,
//                 receivedText: messagingEvent.message.text,
//                 accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
//               });
//             }
//           }
//         }

//         // Process Comment Events
//         if (entry.changes) {
//           for (const change of entry.changes) {
//             if (change.field === "comments") {
//               await publishToPubSub("process-comments-topic", change.value);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error processing webhook event asynchronously:", error);
//     }
//   })();

//   // Return response immediately
//   return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
// }

// // Function to verify webhook signature
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith("sha256=")) return false;
//   const signatureHash = hubSignature.split("sha256=")[1];
//   const expectedHash = crypto
//     .createHmac("sha256", appSecret)
//     .update(payload)
//     .digest("hex");
//   return crypto.timingSafeEqual(
//     Buffer.from(signatureHash),
//     Buffer.from(expectedHash)
//   );
// }

import { NextResponse } from "next/server";
import { PubSub } from "@google-cloud/pubsub";
import crypto from "crypto";

// Initialize Pub/Sub client
const pubsub = new PubSub();

/**
 * Publishes a message to a Pub/Sub topic.
 * @param {string} topicName - The name of the Pub/Sub topic.
 * @param {object} data - The data to publish.
 */
async function publishToPubSub(topicName, data) {
  try {
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const messageId = await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
    console.log(`Message published to topic: ${topicName}, messageId: ${messageId}`);
  } catch (error) {
    console.error(`Failed to publish message to Pub/Sub: ${error.message}`);
    throw error;
  }
}

/**
 * Verifies the signature of the incoming webhook request.
 * @param {string} payload - The raw request body.
 * @param {string} hubSignature - The signature from the request headers.
 * @param {string} appSecret - The shared secret to verify the signature.
 * @returns {boolean} - True if the signature is valid, otherwise false.
 */
function verifySignature(payload, hubSignature, appSecret) {
  if (!hubSignature || !hubSignature.startsWith("sha256=")) return false;

  const signatureHash = hubSignature.split("sha256=")[1];
  const expectedHash = crypto.createHmac("sha256", appSecret).update(payload).digest("hex");
  
  return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
}

// Handle GET request for webhook verification
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verification successful.");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } else {
    console.error("Webhook verification failed. Invalid verify token or mode.");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

// Handle POST request for event notifications
export async function POST(req) {
  try {
    const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
    const X_HUB_SIGNATURE = req.headers.get("x-hub-signature-256");

    const body = await req.text();
    const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

    if (!isValid) {
      console.error("Invalid signature. Webhook payload not genuine.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const jsonBody = JSON.parse(body);
    console.log("Webhook event received:", JSON.stringify(jsonBody, null, 2));

    // Process events asynchronously
    (async () => {
      try {
        for (const entry of jsonBody.entry) {
          const userId = entry.id;

          // Process messaging events
          if (entry.messaging) {
            for (const messagingEvent of entry.messaging) {
              if (messagingEvent.message) {
                console.log(`Publishing messaging event for userId: ${userId}`);
                await publishToPubSub("process-messages-topic", {
                  igUserId: userId,
                  senderId: messagingEvent.sender.id,
                  messageText: messagingEvent.message.text,
                });
              }
            }
          }

          // Process comment events
          if (entry.changes) {
            for (const change of entry.changes) {
              if (change.field === "comments") {
                console.log(`Publishing comment event for userId: ${userId}`);
                await publishToPubSub("process-comments-topic", change.value);
              }
            }
          }
        }
      } catch (asyncError) {
        console.error("Error processing webhook events asynchronously:", asyncError);
      }
    })();

    return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
