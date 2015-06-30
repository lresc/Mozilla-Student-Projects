var express = require("express");
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

var ffmpeg = require('fluent-ffmpeg');
var nodeshout = require("nodeshout");

/* var source = require('icecast-source')({
    host: "localhost",
    port: 8000,
    password: 'sourcepass',
    mount: '/superCoolStuff'
}, function (err) {
  console.log("esta en funcion");
    // if err, auth has failed 
    if(err) console.log("Error " +err);
       while(true) {
     
        source.write("stream_mp3");
    }
});*/

var port = 3700;
var app = express();
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'))



//Init

var shout = nodeshout.create();
shout.setHost('localhost');
shout.setPort(8000);
shout.setUser('source');
shout.setPassword('sourcepass');
shout.setMount('deneme');
shout.setFormat(1); // 0=ogg, 1=mp3
shout.setAudioInfo('bitrate', '192');
shout.setAudioInfo('samplerate', '44100');
shout.setAudioInfo('channels', '1');

shout.open();

var stream_mp3 = new Buffer(40960);
var esta_transmitiendo = false;
// not yet implemented...
//ve.addComment('ARTIST', 'Bob Marley');


//var com = ffmpeg().input("/home/lara/Escritorio/f/arow32.pcm").inputFormat("u32le").audioChannels(2).format("mp3").output("/home/lara/Escritorio/f/app.mp3").run();
console.log("ffmepg" );



app.get("/", function(req, res){
  res.render("index");
});

app.listen(port);

binaryServer = BinaryServer({port: 9001});
console.log(" conectarse a : localhost:3700");

binaryServer.on('connection', function(client) {
  console.log("new connection");

  var out = "/home/lara/Escritorio/git/node-webrtc/browser-pcm-stream/salida.ogg";
  var file  = fs.createWriteStream('/home/lara/Escritorio/git/node-webrtc/browser-pcm-stream/salida.mp3');
 
  client.on('stream', function(stream, meta) {
   stream.on('data', function(data) {
      // console.log("stream mp3 es: " + stream_mp3[3] + stream_mp3[7]+stream_mp3[17]);
       esta_transmitiendo = true;
          while (esta_transmitiendo) {
                buffer= stream_mp3.slice(0, chunkSize-1);
                var buffer2 = new Buffer(4096);
                stream_mp3 = Buffer.concat([stream_mp3.slice(chunkSize, chunkSize.length-1), buffer2]);
                console.log("buffer es: " + buffer[2]);
                shout.send(buffer, chunkSize);
            
                shout.sync();
        }

      });

  var com = ffmpeg().input(stream).inputFormat("s16le").inputFPS(48.0).audioChannels(1).format("mp3").pipe(stream_mp3,{end:false});


  
   // stream.pipe(oe.stream());
   

 
  /*  while(true){
       /* if ((chunkSize) >  stream_mp3.byteLength) {
                chunkSize = (stream_mp3.byteLength );
            }*/
      /*  shout.send(stream_mp3, chunkSize);
        console.log('Bytes send:' + chunkSize);
        shout.sync();

    }*/

 
        var chunkSize = 4096,
            buffer = new Buffer(chunkSize);

              while (esta_transmitiendo) {
                buffer= stream_mp3.slice(0, chunkSize-1);
                console.log("buffer es: " + buffer);
                shout.send(buffer, chunkSize);
            
                shout.sync();
        }

      
 

    // send the encoded Vorbis pages to the Ogg encoder
   //ve.pipe(process.stdout);
  //  ve.pipe(oe.stream());
    //
 //  console.log("ogg 1 "+oe);

    // write the produced Ogg file with Vorbis audio to `process.stdout`
  //  oe.pipe(fs.createWriteStream(out));
 //console.log("we pipe");

   // process.stdout.pipe(fileWriter);
 /*   stream.on('load', function() {
      console.log("start of stream");
    
 
    }); */

 
    stream.on('end', function() {
      console.log("end of stream");
      shout.close();
    });
    });
});
