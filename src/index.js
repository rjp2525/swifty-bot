import { Client, Collection } from 'discord.js';
import { chalk } from 'chalk';
import dotenv from 'dotenv';
import path from 'path';
import { stripIndents } from 'common-tags';
import { Logger } from './managers';

const bot = (global.bot = exports.client = new Client({ autoReconnect: true }));

const log = (bot.log = new Logger(bot));
log.inject();

dotenv.config({
  path: path.join(__dirname, '../', '.env')
});

bot.on('ready', () => {
  // Fix mobile notifications
  bot.user.setAFK(false);

  // Set a game for the bot
  bot.user.setActivity('SwiftTalk', { type: 'PLAYING' });

  // Set the process title
  (title => {
    process.title = title;
    process.stdout.write(`\u001B]0;${title}\u0007`);
  })(`SwiftTalk Statistics Bot (Running as user: ${bot.user.username})`);

  // Display bot statistics
  log.char('\u2799', `Current Statistics:
    \u2022 Bot Account:      ${bot.user.username}#${bot.user.discriminator} <ID: ${bot.user.id}>
    \u2022 Total Users:      ${bot.users.filter(user => !user.bot).size}
    \u2022 Total Bots:       ${bot.users.filter(user => user.bot).size}
    \u2022 Total Channels:   ${bot.channels.size}
    \u2022 Total Servers:    ${bot.guilds.size}`);

  delete bot.user.email;      // No need to store these
  delete bot.user.verified;

  log.info(`SwiftTalk statistics bot was successfully loaded.`);
});

bot.on('message', (msg) => {
  // do something with the message
  // something like the below to keep track of messages the bot sends
  // stats.increment(`messages-${bot.user.id === msg.author.id ? 'sent' : 'received'}`);
  // This needs to be an async/queue thing because API is rate limited
  //
  // if !msg.guild then it's a direct message to the bot
});

bot.on('guildCreate', guild => {
  log.info(`Bot has been added to a new server: ${guild.name} (${guild.id})`);

  // Add data to a queue and upload server information
});

bot.on('error', e => {
  log.error(e);
});

bot.login(process.env.DISCORD_BOT_TOKEN);
