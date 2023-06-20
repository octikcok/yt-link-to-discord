import { Client, Events, GatewayIntentBits } from "discord.js"
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag}上線`)
})

client.login(process.env.TKTK);

// https://discord.com/api/webhooks/1117475499682320396/vO50G5c8hymuYfLU-9OClXR_9ZCtgfumUgqoqzsF-7feWyP1WxO9DEcFRyA2UPdNrv0t