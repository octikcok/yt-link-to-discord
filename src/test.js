import { Client ,GatewayIntentBits } from "discord.js"
import { google } from "googleapis"
import dotenv from 'dotenv'

dotenv.config()

const YOUTUBE_API_KEY = 'AIzaSyArNmGhNlUvncGW2ODXL7NON5jmW03kWJ0'; //API1 : AIzaSyDuri3iHBWunvEpUDTGzoNpZ2mQ_f29h68,備用API2 : AIzaSyArNmGhNlUvncGW2ODXL7NON5jmW03kWJ0
const channelId = 'UCdJr72A0ZZD5P9EVAWSs42w';
const channel2Id = 'UCFdhbI6pQ8BVaLdi43tBQ6Q';
const discordChannelId = '1106204646046957648';
const roleIdToMention = '1086672911923949568';
const guildId = '1076774292601192450'

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });

let lastVideoId = ''; // 上次發布的影片的 ID
let lastVideoId2 = ''; 

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

console.log('正在檢測有無新影片');

const checkForNewVideos = () => {
  youtube.search.list({
    part: 'snippet',
    channelId: channelId,
    maxResults: 5,
    order: 'date',
    type: 'video'
  }, (err, res) => {
    if (err) {
      console.error('Error searching for new videos:', err);
      return;
    }

    const video = res.data.items[0];
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    if (lastVideoId !== videoId) {

      const roleToMention = client.guilds.cache.get(guildId).roles.cache.get(roleIdToMention);
      const roleMention = roleToMention ? roleToMention.toString() : ''; // 如果找不到該角色，則不進行提及

      client.channels.cache.get(discordChannelId).send(`${roleMention} 味噌miso上傳了新影片: **${videoTitle}\n${videoUrl}**`);
      console.log('已發布一部新影片');
      lastVideoId = videoId;
    } else {
      console.log('沒有新影片');
    }
  });
};

const checkForNewVideos2 = () => {
  youtube.search.list({
    part: 'snippet',
    channelId: channel2Id,
    maxResults: 5,
    order: 'date',
    type: 'video'
  }, (err, res) => {
    if (err) {
      console.error('Error searching for new videos:', err);
      return;
    }

    const video2 = res.data.items[0];
    const videoId2 = video2.id.videoId;
    const videoTitle2 = video2.snippet.title;
    const videoUrl2 = `https://www.youtube.com/watch?v=${videoId2}`;

    if (lastVideoId2 !== videoId2) {

      const roleToMention = client.guilds.cache.get(guildId).roles.cache.get(roleIdToMention);
      const roleMention = roleToMention ? roleToMention.toString() : ''; // 如果找不到該角色，則不進行提及

      client.channels.cache.get(discordChannelId).send(`${roleMention} 味噌miso上傳了新影片: **${videoTitle2}\n${videoUrl2}**`);
      console.log('已發布一部新影片2');
      lastVideoId2 = videoId2;
    } else {
      console.log('沒有新影片2');
    }
  });
};

setInterval(checkForNewVideos, 60000);
setInterval(checkForNewVideos2, 60000);

client.login(process.env.TOKEN)