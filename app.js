const { App } = require("@slack/bolt");
require("dotenv").config();

// Initialize the Slack Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Function to convert total seconds to HH:mm:ss format
function toTimeString(totalSeconds) {
  const totalMs = totalSeconds * 1000;
  const result = new Date(totalMs).toISOString();
  return result;
}

// Array of alphabet letters for generating unique aliases
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Dictionary to store the mapping of user IDs to aliases
const nickNameMap = {};

// Function to generate a unique alias for a user
function getUserAlias(userId) {
  // Check if alias already exists for the user
  if (nickNameMap[userId]) return nickNameMap[userId];

  // Generate a random letter from the alphabet
  const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

  // Remove the used letter from the alphabet
  alphabet = alphabet.replace(randomLetter, "");

  // Create the user alias and save it in the map
  nickNameMap[userId] = `User-${randomLetter}`;

  return nickNameMap[userId];
}

// Event handler function for the "forward_message" command
const forwardMessage = async ({ ack, client, shortcut }) => {
  try {
    // Acknowledge the command
    await ack();

    // Get the original message
    const originalMessage = shortcut.message;

    // Check if the message was not sent in the target channel
    if (shortcut.channel.id !== process.env.FORWARD_TO_CHANNEL) {
      // Get all messages in the thread of the original message
      const originalMessageThreads = await client.conversations.replies({
        token: process.env.SLACK_BOT_TOKEN,
        channel: shortcut.channel.id,
        ts: originalMessage.ts,
      });

      const threadMessages = originalMessageThreads.messages;

      let messageTs = undefined;
      // Iterate over all messages in the thread
      for (let threadMessage of threadMessages) {
        // Generate a unique alias for the user
        const userAlias = getUserAlias(threadMessage.user);

        // Send the message to the target channel
        const message = await client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: process.env.FORWARD_TO_CHANNEL,
          thread_ts: messageTs,
          text: `Time-${toTimeString(
            threadMessage.ts
          )}\n${userAlias}:\n\n${threadMessage.text}`,
        });

        // Update the thread timestamp if not set yet
        if (!messageTs) messageTs = message.ts;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// Register the handler for the "forward_message" command
app.shortcut("forward_message", forwardMessage);

// Start the application
(async () => {
  await app.start();
  console.log("Forwarding app is running");
})();
