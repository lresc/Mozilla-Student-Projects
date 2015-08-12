var express = require("express");
var BinaryServer = require('binaryjs').BinaryServer;
var ffmpeg = require('fluent-ffmpeg');
var bodyParser = require('body-parser');
var nodeshout = require("nodeshout");

  //Init Icecast var
  var shout = nodeshout.create();


  //Init server listenner
  var port = 3700;
  var app = express();
  app.set('views', __dirname + '/public');
  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.json());         
  app.use(bodyParser.urlencoded({ extended: true }));     

  app.get("/", function(req, res){
      console.log("get");
    res.sendFile(__dirname +"/public/index.html");
  });

 app.post('/', function(req, res) {
    console.log("post");
    //Init ICecast connection

     
    /*  shout.setHost('localhost');
      shout.setPort(8000);
      shout.setUser('source');
      shout.setPassword('sourcepass');
      shout.setMount('deneme');
      shout.setFormat(1); // 0=ogg, 1=mp3
      shout.setAudioInfo('bitrate', '192');
      shout.setAudioInfo('samplerate', '44100');
      shout.setAudioInfo('channels', '1');*/
      
      shout.setHost(req.body['server']);
      shout.setPort(req.body['port']);
      shout.setUser(req.body['user']);
      shout.setPassword(req.body['userpass']);
      shout.setMount(req.body['mountName']);
      shout.setFormat(1); // 0=ogg, 1=mp3
      shout.setAudioInfo('bitrate', '192');
      shout.setAudioInfo('samplerate', '44100');
      shout.setAudioInfo('channels', '1');
      var openvar = shout.open();
      console.log(openvar);
      if(openvar == 0)
        res.sendFile(__dirname +"/public/icecast_connection.html");
      else{
        //res.sendFile(__dirname +"/public/index.html");
        res.send("No se pudo establecer la conexión con el servidor Icecast, compruebe que los datos introducidos sean correctos");

      }
});

  app.listen(port);

  binaryServer = BinaryServer({port: 9001});
  console.log(" conectarse a : localhost:3700");

  binaryServer.on('connection', function(client) {
    console.log("new connection");

    client.on('stream', function(stream, meta) {
  
        var com = ffmpeg().input(stream).inputFormat("s16le").inputFPS(48.0).audioChannels(1).format("mp3");
        var ffstream = com.pipe();

        ffstream.on('data', function(chunk) {
           console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
             // sync, hace que se duerma el proceso hasta que pueda volver a enviar a Icecast  
           shout.sync();
           shout.send(chunk, chunk.length);
        });
 
        stream.on('end', function() {
          console.log("end of stream");
          shout.close();
        });
    });
  });
