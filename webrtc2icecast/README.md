#WebRTC to Icecast

Gateway between webRTC and Icecast that translates streams in webRTC format to icecast one. It receives real-time stream from webRTC and sends it to Icecast.


## Install

$ git clone https://github.com/lresc/Mozilla-Student-Projects.git
$ cd webrtc2icecast
$ npm install


## Prerequisites

$ sudo aptitude install nodejs-legacy npm libshout-dev ffmpeg


## Execute

$ node webrtc2icecast/server.js

The server listen at localhost:3700

# Icecast configuration:
(It can be changed in server.js)

localhost:8000
user: source
pass: sourcepass




