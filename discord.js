const Discord = require("discord.js");
const client = new Discord.Client();

//TODO: Beautify this
//TODO: Make commands role-dependant
//TODO: Auto-delete Homeworks
//TODO: Use config.prefix.length instead of numbers

const config = require('./config.json');
const functions = require('./functions');
const embed = new Discord.RichEmbed();
var math = require('mathjs');

client.on("debug", (m) => console.log("[debug]", m));
client.on("warn", (m) => console.log("[warn]", m));

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };

var fs = require('fs');

var json = {links: [], title: []};

var homeworks = [{discipline: "", name: "", date_lim: new Date()}];

var sleepmode = false;
/*fs.writeFile('homeworks.json', JSON.stringify(homeworks),  function(err) {
   if (err) {
      return console.error(err);
   }
   
   console.log("Data written successfully!");
});*/
fs.readFile('homeworks.json', function (err, data) {
      if (err) {
         return console.error(err);
      }
      console.log("Asynchronous read: " + data.toString());
     homeworks = JSON.parse(data);
});

functions.setEmbedd(embed);

var admin = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
    //client.channels.first().sendMessage("Systems online.")
    client.user.setGame("<- :)help ->");
    //admin = client.users.get("158531715340435456"); //TODO: get this by role
    //console.log(admin);
});

client.on('message', m => {
    
    if(m.isMentioned("158531715340435456") && sleepmode){ //TODO: array de useri pe somn
        m.channel.sendMessage("Zzz...")
    }
    
    if(!m.content.startsWith(config.prefix)) return;
    
    if(m.content.startsWith(config.prefix + 'sleepmode')){
        sleepmode = !sleepmode;
        console.log(sleepmode);
        return;
    }
    
    if(m.content.startsWith(config.prefix + 'calculate')){
        var expression = m.content.slice(config.prefix.length + 10, m.content.length);
        m.channel.sendMessage("The answer is " + math.eval(expression));
        return;
    }
    
    if(m.content.startsWith(config.prefix + 'addhomework')){
        var message = m.content.slice(config.prefix.length + 12, m.content.length);
        message = message.split(" ");
        console.log(message);
        homeworks.push({discipline: message[0], name: message[1], date_lim:new Date(message[2])});
        console.log(homeworks[homeworks.length-1]);
        
        fs.writeFile('homeworks.json', JSON.stringify(homeworks),  function(err) {
            if (err) {
                return console.error(err);
            }
        console.log("Data written successfully!");
        });
        return;
    }
    
    if(m.content.startsWith(config.prefix + 'removehomework')){
        var index = m.content.slice(config.prefix.length + 15, m.content.length);
        homeworks.splice(parseInt(index), 1);
        
        fs.writeFile('homeworks.json', JSON.stringify(homeworks),  function(err) {
            if (err) {
                return console.error(err);
            }
        console.log("Data written successfully!");
        });
        return;
    }
    
    if(m.content.startsWith(config.prefix + 'homeworks')){
        for(var i = 1; i < homeworks.length; i++){
            var temp_date = new Date(homeworks[i].date_lim); //use this for computations
            var currentTime = new Date();
            m.channel.sendMessage("`Discipline: " +homeworks[i].discipline + ", " + homeworks[i].name + ", Deadline: " + String(temp_date).slice(0, 16)+"`");
            var timeDiff = temp_date.getTime() - currentTime.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            m.channel.sendMessage("`Time remaining: " + diffDays + " days`")
        }
        return;
    }
    
    //For Voice 
    if(m.content.startsWith(config.prefix + 'connectvoice')){
        functions.connectToVoice(m);
    }
    
    else if(m.content.startsWith(config.prefix + 'disconnectvoice')){
        var voiceConnection = m.client.voiceConnections.first();
        voiceConnection.disconnect();
    }
    
    else if(m.content.startsWith(config.prefix + 'ping')){
        //console.log(m.member.roles.first());
        console.log(homeworks);
        functions.pingPong(m, client);
    }
    
    else if(m.content.startsWith(config.prefix + 'say')){
        functions.sayIt(m);
    }
    
    else if(m.content.startsWith(config.prefix + 'help')){
        //m.channel.sendEmbed(embed);
        m.channel.sendMessage(config.help);
    }
    else if(m.content.startsWith(config.prefix + 'ytplay')){
                if(m.content.charAt(9) == '<'){
                var ytlink = m.content.slice(config.prefix.length + 7, m.content.length);
                ytlink = ytlink.slice(1, ytlink.length);
                ytlink = ytlink.slice(0,-1);   
                console.log(ytlink);
                functions.playMusicYoutube(m, ytdl, streamOptions, ytlink);
                }
                else{
                    var searchq = m.content.slice(config.prefix.length + 7, m.content.length);
                    searchq = searchq.replace(/ /g,"+");
                    console.log(searchq);
                    json = functions.searchResultsYoutube(m, searchq);
                }
    }
    else if(m.content.startsWith(config.prefix + "play ") && parseInt(m.content.slice(7,m.content.length))>=0 && parseInt(m.content.slice(config.prefix.length + 5,m.content.length))<=4){
        console.log(m.content.slice(3,m.content.length));
        functions.playMusicYoutube(m, ytdl, streamOptions, json.links[2*parseInt(m.content.slice(config.prefix.length + 5,m.content.length)) +1]);
        m.channel.sendMessage("Playing " + json.title[2*parseInt(m.content.slice(config.prefix.length + 5,m.content.length)) +1]);
    }
    
    else if(m.content.startsWith(config.prefix)){
        m.channel.sendMessage("I don't recognize this.");
    }
    
});

client.login(config.token);