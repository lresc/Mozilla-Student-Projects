(function(window) {
  var client = new BinaryClient('ws://localhost:9001');
       $("").show();

  client.on('open', function() {
    window.Stream = client.createStream();

    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, success, function(e) {
        alert('Error capturing audio.');
      });
    } else alert('getUserMedia not supported in this browser.');

    var recording = false;

   $("#buttonStart").click(function(){
      recording = true;
       $("#buttonStart").hide();
       $("#buttonStop").show();
    });

   $("#buttonStop").click(function(){
       recording = false;
      window.Stream.end();
      window.location.href = "http://localhost:3700";
    });

    

    function success(e) {
      audioContext = window.AudioContext || window.webkitAudioContext;
      context = new audioContext();

      // the sample rate is in context.sampleRate
      audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = function(e){
        if(!recording) return;
        console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        window.Stream.write(convertoFloat32ToInt16(left));
      }
      //convertoFloat32ToInt16

      audioInput.connect(recorder)
      recorder.connect(context.destination); 
    }

    function convertoFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l)

      while (l--) {
        buf[l] = buffer[l]*0x7FFF;    //convert to 16 bit
      }
      return buf.buffer
    }
  });
})(this);
