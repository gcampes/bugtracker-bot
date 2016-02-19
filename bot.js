/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
          \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
           \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.argv[2]) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');
var Mongoose = require('mongoose');

var db = Mongoose.connect('mongodb://127.0.0.1:27017/slack-bugtracker');
var Issue = require('./models/issue');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.argv[2]
}).startRTM();

controller.hears(['list'], 'direct_message,direct_mention,mention', function(bot, message) {
    console.log(message);
    Issue.find({}, function(err, issues) {
        issues.forEach(function(issue) {
            bot.reply(message, issue.description);
        });
    });
});

controller.hears(['new', 'create'], 'direct_message,direct_mention,mention', function(bot, message) {
    messageContent = message.text.split(' ');
    var issueDescription = (messageContent.slice(1, messageContent.length)).join(" ");

    var issue = new Issue({
        description: issueDescription,
        creator: message.user,
    });
    issue.save();

    bot.reply(message, 'Criei um bug com a seguinte descrição: ' + issueDescription);

    // bot.api.reactions.add({
    //     timestamp: message.ts,
    //     channel: message.channel,
    //     name: 'robot_face',
    // },function(err, res) {
    //     if (err) {
    //         bot.botkit.log('Failed to add emoji reaction :(',err);
    //     }
    // });


    // controller.storage.users.get(message.user,function(err, user) {
    //     if (user && user.name) {
    //         bot.reply(message,'Hello ' + user.name + '!!');
    //     } else {
    //         bot.reply(message,'Hello.');
    //     }
    // });
});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
