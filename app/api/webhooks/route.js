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

// import { NextResponse } from "next/server";
// import crypto from "crypto";

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
//     console.error("Webhook verification failed.");
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
//     console.error("Invalid signature.");
//     return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log("Webhook event received:", JSON.stringify(jsonBody, null, 2));

//   // Forward data to Pub/Sub asynchronously
//   (async () => {
//     try {
//       for (const entry of jsonBody.entry) {
//         const userId = entry.id;

//         if (entry.messaging) {
//           for (const messagingEvent of entry.messaging) {
//             if (messagingEvent.message) {
//               await publishToPubSub("process-messages-topic", {
//                 igUserId: userId,
//                 senderId: messagingEvent.sender.id,
//                 messageText: messagingEvent.message.text,
//               });
//             }
//           }
//         }

//         if (entry.changes) {
//           for (const change of entry.changes) {
//             if (change.field === "comments") {
//               await publishToPubSub("process-comments-topic", change.value);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error processing webhook event:", error);
//     }
//   })();

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
//   return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
// }


// import { NextResponse } from "next/server";
// import crypto from "crypto";

// // Helper function to send data to Firebase Function
// async function sendToFirebaseFunction(url, payload) {
//   try {
//     console.log("Sending payload to Firebase Function:", url, payload);
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       console.error(`Failed to call Firebase Function at ${url}:`, await response.text());
//     } else {
//       console.log(`Firebase Function responded with: ${await response.text()}`);
//     }
//   } catch (error) {
//     console.error("Error calling Firebase Function:", error);
//   }
// }


// // Function to verify webhook signature
// function verifySignature(payload, hubSignature, appSecret) {
//   if (!hubSignature || !hubSignature.startsWith("sha256=")) return false;
//   const signatureHash = hubSignature.split("sha256=")[1];
//   const expectedHash = crypto
//     .createHmac("sha256", appSecret)
//     .update(payload)
//     .digest("hex");
//   return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
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
//     console.error("Webhook verification failed.");
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
//     console.error("Invalid signature.");
//     return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
//   }

//   const jsonBody = JSON.parse(body);
//   console.log("Webhook event received:", JSON.stringify(jsonBody, null, 2));

//   // Process data asynchronously
//   (async () => {
//     const promises = [];
//     try {
//       for (const entry of jsonBody.entry) {
//         const userId = entry.id;

//         if (entry.messaging) {
//           for (const messagingEvent of entry.messaging) {
//             if (messagingEvent.message) {
//               promises.push(
//                 sendToFirebaseFunction(
//                   `https://processmessages-1020225404793.asia-south1.run.app`,
//                   {
//                     igUserId: userId,
//                     senderId: messagingEvent.sender.id,
//                     messageText: messagingEvent.message.text,
//                   }
//                 )
//               );
//             }
//           }
//         }

//         if (entry.changes) {
//           for (const change of entry.changes) {
//             if (change.field === "comments") {
//               promises.push(
//                 sendToFirebaseFunction(
//                   `https://processcomments-1020225404793.asia-south1.run.app`,
//                   change.value
//                 )
//               );
//             }
//           }
//         }
//       }

//       // Start processing all data asynchronously
//       await Promise.allSettled(promises);
//     } catch (error) {
//       console.error("Error processing webhook events asynchronously:", error);
//     }
//   })();

//   // Respond immediately to Instagram
//   return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
// }


import { NextResponse } from "next/server";
import crypto from "crypto";

// Function to verify webhook signature
function verifySignature(payload, hubSignature, appSecret) {
  if (!hubSignature || !hubSignature.startsWith("sha256=")) return false;
  const signatureHash = hubSignature.split("sha256=")[1];
  const expectedHash = crypto
    .createHmac("sha256", appSecret)
    .update(payload)
    .digest("hex");
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
    console.error("Webhook verification failed.");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

// Handle POST request for event notifications
export async function POST(req) {
  const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
  const X_HUB_SIGNATURE = req.headers.get("x-hub-signature-256");

  const body = await req.text();
  const isValid = verifySignature(body, X_HUB_SIGNATURE, APP_SECRET);

  if (!isValid) {
    console.error("Invalid signature.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const jsonBody = JSON.parse(body);
  console.log("Webhook event received:", JSON.stringify(jsonBody, null, 2));

  // Process data asynchronously
  (async () => {
    try {
      const promises = jsonBody.entry.flatMap((entry) => {
        const userId = entry.id;

        // Process messaging events
        const messagingPromises =
          entry.messaging?.map((messagingEvent) => {
            if (messagingEvent.message) {
              return fetch(`https://processmessages-1020225404793.asia-south1.run.app`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  igUserId: userId,
                  senderId: messagingEvent.sender.id,
                  messageText: messagingEvent.message.text,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`Failed to send message data: ${response.statusText}`);
                  }
                  return response.json();
                })
                .then((result) => console.log("Message processed:", result))
                .catch((error) => console.error("Error processing message:", error));
            }
          }) || [];

        // Process comment changes
        const changePromises =
          entry.changes?.map((change) => {
            if (change.field === "comments") {
              return fetch(`https://processcomments-1020225404793.asia-south1.run.app`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(change.value),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`Failed to send comment data: ${response.statusText}`);
                  }
                  return response.json();
                })
                .then((result) => console.log("Comment processed:", result))
                .catch((error) => console.error("Error processing comment:", error));
            }
          }) || [];

        return [...messagingPromises, ...changePromises];
      });

      await Promise.allSettled(promises);
    } catch (error) {
      console.error("Error processing webhook events asynchronously:", error);
    }
  })();

  // Respond immediately to Instagram
  return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
}
