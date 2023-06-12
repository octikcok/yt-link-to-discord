import { Client, Events ,GatewayIntentBits } from "discord.js"
import dotenv from 'dotenv'
import rp from "request-promise"

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


var Channel = {
    "已提": "iitifox",
};

client.on('message', msg => {
    if (msg.content === '開台') {

        var myRequests = [];
        let peopleNumber = 0;
        for (name in Channel) {
            console.log("查看: " + name + " ID: " + Channel[name]);
            myRequests.push(rp(CheckOnlineStatus(Channel[name])));
        }
        Promise.all(myRequests)
            .then((arrayOfResult) => {
                arrayOfResult.forEach(function (result) {
                    console.log("arrayOfResult: ", result);
                    let resposeBody = "";
                    resposeBody = JSON.parse(result);
                    if (resposeBody.data.length != 0 && resposeBody.data[0].type == "live") {
                        console.log("有開: " + resposeBody.data[0].user_name + " ID: " + Channel[resposeBody.data[0].user_name]);
                        msg.channel.send(resposeBody.data[0].user_name + "目前有開 快去看 --> " + "https://www.twitch.tv/" + Channel[resposeBody.data[0].user_name]);
                        peopleNumber++;
                    }
                });

                if (peopleNumber == 0) {
                    msg.channel.send("目前沒人開台唷~~~~");
                }
            })
            .catch(/* handle error */);
    }
});

function CheckOnlineStatus(user_login) {
    var options = {
        url: 'https://api.twitch.tv/helix/streams?user_login=' + user_login,
        headers: {
            'Client-ID': process.env.TWID
        }
    };
    return options;
}

client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag}上線`)
})

client.login(process.env.TK)