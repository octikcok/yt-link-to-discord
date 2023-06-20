import { Client, Events, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 監聽機器人準備好的事件
client.on(Events.ClientReady, () => {
  console.log(`機器人已登入，目前在 ${client.guilds.cache.size} 個伺服器上`);
});

export const command = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('封鎖使用者')
    .addUserOption(option =>
        option.setName('使用者')
            .setDescription('要封鎖的使用者')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('原因')
            .setDescription('封鎖原因')
            .setRequired(false));

export const handleInteraction = async (interaction) => {
    if (!interaction.isCommand() || interaction.commandName !== 'ban') return;

    const user = interaction.options.getUser('使用者');
    const reason = interaction.options.getString('原因') || '未提供原因';

    try {
        await interaction.guild.members.ban(user, { reason });
        interaction.reply(`${user.tag} 已被成功封鎖，原因：${reason}`);
    } catch (error) {
        console.error(error);
        interaction.reply('封鎖使用者時發生錯誤！');
    }
};


// 登入機器人
client.login(process.env.TOKEN);
