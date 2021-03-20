const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const config = require('./config.json');
const BOT_TOKEN = config.BOT_TOKEN;
const PREFIX = config.PREFIX;
const PREFIX = "+";
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
let PlayerCount = require('./server/players');
const { Client, MessageEmbed } = require('discord.js');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
    
    setInterval(() => {
      PlayerCount.getPlayerCount().then((result) => {
          client.user.setActivity(` ${result.data.length} igraca,+help`,{ type: 'PLAYING' });
      })
    }, 10000);
});

client.login(BOT_TOKEN);

for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('message', message =>{
  if(!message.content.startsWith(PREFIX) || message.author.bot) return
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if(!client.commands.has(command)) return
  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
  }
});

client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '+ip') {
    // We can create embeds using the MessageEmbed constructor
    // Read more about all that you can do with the constructor
    // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('IP SERVERA')
      // Set the color of the embed
      .setColor(0x920DEA)
      // Set the main content of the embed
      .setDescription('IP: **endless.vibegames.pro**');
    // Send the embed to the same channel as the message
    message.channel.send(embed);
  }
});

client.on('ready', () => {
  console.log('I am ready!');
});



var bannedwords = "discord.gg/".split(",");

client.on("message", msg => {
  if (msg.guild === null) return;

  for (i=0;i<bannedwords.length;i++) {
    if (msg.content.toLowerCase().includes(bannedwords[i])) {
      msg.delete();
      msg.reply("Nema reklame za pedere!");
      return;
    }
  }

  if (msg.author.bot) return;
  if (!msg.member.hasPermission("ADMINISTRATOR")) return;

  if (!msg.content.toLowerCase().startsWith(prefix)) return;
  msg.delete();
  if (msg.content.toLowerCase().startsWith(prefix + "kick ")) {
    var mem = msg.mentions.members.first();
    mem.kick().then(() => {
      msg.channel.send(mem.displayName + " je uspješno izbačen by " + msg.author.username + "!");
    }).catch(e => {
      msg.channel.send("Doslo je do greske!");
    });
  }
  if (msg.content.toLowerCase().startsWith(prefix + "ban ")) {
    var mem = msg.mentions.members.first();
    var mc = msg.content.split(" ")[2];
    mem.ban(mc).then(() => {
      msg.channel.send(mem.displayName + " je uspješno banan by " + msg.author.username + " for " + mc + " days!");
    }).catch(e => {
      msg.channel.send("Doslo je do greske!");
    });
  }
  if (msg.content.toLowerCase().startsWith(prefix + "purge")) {
    var mc = msg.content.split(" ")[1];
    msg.channel.bulkDelete(mc);
  }
});