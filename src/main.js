import { Client, Events, GatewayIntentBits } from "discord.js"
import dotenv from 'dotenv'
import axios from "axios"

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


const apiKey = 'AIzaSyDuri3iHBWunvEpUDTGzoNpZ2mQ_f29h68';
const channelId = 'UCdJr72A0ZZD5P9EVAWSs42w';
const discordChannelId = '1106204646046957648';

function fetchLatestVideo() {
  axios.get(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`)
    .then(response => {
      const videoId = response.data.items[0].id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const videoTitle = response.data.items[0].snippet.title;

      // 在 Discord 频道中发送消息
      const channel = client.channels.cache.get(discordChannelId);
      if (channel && channel.type === 'text') {
        channel.send(`New video: ${videoTitle}\n${videoUrl}`);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// 定期检查最新视频
setInterval(fetchLatestVideo, 60000); // 一分钟检查一次

// 当 Discord 客户端准备就绪时触发
client.on('ready', () => {
  fetchLatestVideo(); // 启动时立即检查一次最新视频
})
client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag}上線`)
})

client.login(process.env.TOKEN);

// https://discord.com/api/webhooks/1117475499682320396/vO50G5c8hymuYfLU-9OClXR_9ZCtgfumUgqoqzsF-7feWyP1WxO9DEcFRyA2UPdNrv0t