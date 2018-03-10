var express = require('express');
var router = express.Router();
var colors = require('colors/safe');
require('dotenv').config();
const { WebClient } = require('@slack/client');
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Slack' });
});

router.post('/slack-interactions', function(req, res, next) {
  console.log("just got a post to interactions");
  console.log(JSON.stringify(req.body, null, 4));
  var theResponse = JSON.parse(req.body.payload);
  console.log(JSON.stringify(theResponse, null, 4));
  var thePayload = {
    text: "got your message",
    replace_original: false
  }
  res.json(thePayload);
});

router.post('/slack-slash', function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 4))
  res.send('got your message');
});

router.post('/simple-slack-slash', function(req, res, next) {
  console.log(colors.rainbow('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'));
  console.log(colors.rainbow('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'));
  console.log(colors.rainbow('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■'));
  console.log("got a request");
  console.log(JSON.stringify(req.body, null, 4));
  if (req.body.user_name) {
    var theText = 'just received a message from user ' + req.body.user_name + ": \n" + req.body.text + ".\n\n We'll do more interesting stuff in a bit."
    var thePayload = {
      text: (theText),
      attachments:
        [{
          title: "just a simple gif",
          image_url: "https://media.giphy.com/media/5hHOBKJ8lw9OM/giphy.gif"
        },
        {
            "fallback": "Would you recommend it to customers?",
            "title": "Would you recommend it to customers?",
            "callback_id": "comic_1234_xyz",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "recommend",
                    "text": "Recommend",
                    "type": "button",
                    "value": "recommend"
                },
                {
                    "name": "no",
                    "text": "No",
                    "type": "button",
                    "value": "bad"
                }
            ]
        }]
      }
    console.log(JSON.stringify(thePayload, null, 4));
    // res.send(JSON.stringify(thePayload));
    res.json(thePayload);

  }
  else {
    res.send('just received a message, but cannot figure out who sent it')
  }
});

router.post('/reallysimple-slash', function(req, res, next) {
  console.log("got a request:");
  console.log(JSON.stringify(req.body, null, 4));
  res.send('just received a message. will do more soon')
})


router.post('/shootid-slash', function(req, res, next) {
  console.log("got a request:");
  console.log(JSON.stringify(req.body, null, 4));
  res.send('just received a message. will do more soon');
  web.chat.postMessage({ channel: req.body.channel, text: 'Hello there' })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
})

router.post('/slack-events', function(req, res){
  // res.send(req.body.challenge);
  // var newSlackEvent = new SlackEvent(req.body);
  // newSlackEvent.save(function(err){
  //   if (err) {console.log("there was an error");
  //   return next(err)}
  //   else {
  //     console.log("saved event to db");
  //   }
  // })
  console.log(JSON.stringify(req.body));
  web.chat.postMessage({
  channel: req.body.channel,
  text: 'Hello there',
  attachments: [
    {
      "fallback": "Required plain-text summary of the attachment.",
      "color": "#36a64f",
      "author_name": "Bobby Tables",
      "author_link": "http://flickr.com/bobby/",
      "author_icon": "http://flickr.com/icons/bobby.jpg",
      "title": "Slack API Documentation",
      "title_link": "https://api.slack.com/",
      "text": "Optional text that appears within the attachment",
      "fields": [
        {
          "title": "Priority",
          "value": "High",
          "short": false
        }
      ],
      "image_url": "http://my-website.com/path/to/image.jpg",
      "thumb_url": "http://example.com/path/to/thumb.png",
      "footer": "Slack API",
      "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
      "ts": 123456789
    }
  ]
})
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
})

router.get('/slack-channels', function(req, res, next){
  web.channels.list()
    .then((data) => {
      console.log(JSON.stringify(data, null, 4));
      res.render('slack_channels', {title: "Slack Channel List", message: "here are your slack channels", data: data.channels})
    })
    .catch(console.error);
})

router.post('/slack-history-post', function(req, res, next){
  console.log(JSON.stringify(req.body, null, 4));
  res.redirect(('/slack-history/' + req.body.channel))
})

router.get('/slack-history/:channel', function(req, res, next){
  console.log(JSON.stringify(req.params, null, 4));
  // res.send(req.params);
  web.channels.history({channel: req.params.channel, count: 20}, function(err, data){
    console.log(JSON.stringify(data, null, 4));
    res.render('slack_history', {title: ("history for Slack Channel " + req.params.channel), message: "no message", data: data })
  })



})

module.exports = router;
