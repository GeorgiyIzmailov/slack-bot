## Forwarding App

### Creating an application

To test the bot's performance, follow the steps below:

1. Clone this repository

```bash
git clone https://github.com/GeorgiyIzmailov/slack-bot.git
```

2. Create an application on the slack api [platform](https://api.slack.com/apps)

3. Click **Create New App**

4. Select **From an app manifest**

5. Choose your Slack workspace

6. Copy and paste the contents of the ```manifest.yaml``` file

### Getting tokens

Get the application token in the **Basic Information** section. Copy the token and paste it into the ```.env``` file.

Go to **Install App** and click **Install to WorkSpace**. Copy the bot token and paste it into the ```.env``` file.


### Using a bot in Slack

Add the bot to the channel from which messages are being forwarded and to the channel that receives the messages.

- forward_from_channel
- forward_to_channel

In the ```.env``` file, specify the ID of the **forward_to_channel**

## Screenshots

### Slack API

![Alt text](/assets/slack-api-create-app.png "Slack API")

### Create App

![Alt text](/assets/slack-api-create-app-modal.png "Slack API")

### App manifest

![Alt text](/assets/slack-app-manifest.png "Slack API")

### Application Token

![Alt text](/assets/slack-app-token.png "Slack API")

### Bot Token

![Alt text](/assets/slack-bot-token.png "Slack API")
