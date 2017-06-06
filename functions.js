const config = require('./config.json');
//Basic PING
exports.pingPong = function(m, client){
    m.channel.sendMessage("PONG! Average ping is: " + client.ping +"ms");
}

//Basic SAY
exports.sayIt = function(m){
    var messageContent = m.content;
    var toSay = messageContent.slice(config.prefix.length + 3, messageContent.length);
    m.channel.sendMessage(toSay);
    m.delete()
        .then(msg => console.log(`Deleted message from ${msg.author}`))
        .catch(console.error);
}

//Connect Voice
exports.connectToVoice = function(m){
    if(m.member.voiceChannel == undefined){
             m.channel.sendMessage("Enter in a voice channel first.");
                return;
            }
    voiceChannel = m.member.voiceChannel;
        voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playFile('./test_audio/tuturu.mp3');
        })
        .catch(console.error);
}

//Set Embed - Curently not in use
exports.setEmbedd = function(embed){
    embed.setTitle("Here is the help: ");
    //embed.setAuthor("Jinsoyun");
    embed.addField(":)ping", "Basic Ping-Pong command. Also show bot heartbeats");
    embed.setColor(0x00AE86);
}

exports.playMusicYoutube = function(m, ytdl, streamOptions, link){
            if(m.member.voiceChannel == undefined){
             m.channel.sendMessage("Enter in a voice channel first.");
                return;
            }
            voiceChannel = m.member.voiceChannel; //de facut verificare pentru link
            voiceChannel.join()
            .then(connection => {
                var stream = ytdl(link, {filter : 'audioonly'});
                var dispatcher = connection.playStream(stream, streamOptions);
            })
            .catch(console.error);
}

var cheerio = require('cheerio');
var request = require('tinyreq');
exports.searchResultsYoutube = function(m, searchq){
    var json = {links: [], title: []};
    var url = "https://www.youtube.com/results?sp=EgIQAQ%253D%253D&q=" + searchq;
                    request(url, function (err, body) {
                    let $ = cheerio.load(body);
                    var results = $("#results > ol li:nth-child(2) > ol");
                    for(var index = 1; index < 10; index+=2){
                        json.links[index] = results[0].children[index].children[0].attribs["data-context-item-id"];
                        json.links[index] = "https://www.youtube.com/watch?v=" + json.links[index];
                        json.title[index] = results[0].children[index].children[0].children[0].children[1].children[0].children[0].attribs.title; 
                    }
                    var cheapIndex =0;
                    for(var index = 1; index < 10; index+=2){
                            m.channel.sendMessage("`" + cheapIndex + ": " + json.title[index] + "`" );
                            cheapIndex++;
                    }
                        m.channel.sendMessage("`Use :)play <number> to select a song (without <>)`");
                    }); 
    return json;
    
}