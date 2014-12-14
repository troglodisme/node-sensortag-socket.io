var SensorTag = require('sensortag');

var http = require('http'),

fs = require('fs'),
index = fs.readFileSync(__dirname + '/index.html');

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
	});

var io = require('socket.io').listen(app);

SensorTag.discover(function(sensorTag) {

  sensorTag.connect(function() {

    sensorTag.discoverServicesAndCharacteristics(function() {

      sensorTag.enableAccelerometer(function() {

      sensorTag.setAccelerometerPeriod(5, function() {
      })

      sensorTag.on('accelerometerChange', function(x, y, z){
    //  console.log("\taccelerometer [x,y,z] = [%d, %d, %d]", x, y, z); 
      
        function accChange() {
      	io.sockets.emit('accX', { accX: x });
        io.sockets.emit('accY', { accY: y }); //not sure about this part
        io.sockets.emit('accZ', { accZ: z }); //not sure about this part
      };

		  accChange();
      })

        sensorTag.notifyAccelerometer(function() {
          console.log("> accelerometer is on");
        });

      });

       sensorTag.notifySimpleKey(function() {
          console.log('> key is on');
          });

        sensorTag.on('simpleKeyChange', function(left, right){

          if (left==true) {
           // console.log('1'); 
            var keyButton = 1;
          } else if (left==false){
           // console.log('0');
            keyButton = 0;
          }
          
         function keyChange(){
            io.sockets.emit('key', { key: keyButton}); //qui dovrebbe essere left

          };
          keyChange();
          })


        //start of magnetometer//

        sensorTag.enableMagnetometer(function(){

            sensorTag.setMagnetometerPeriod(20, function(){
      
            })

            sensorTag.on('magnetometerChange', function(x, y, z){
              //console.log("\tmagnetometer [x,y,z] = [%d, %d, %d]", x, y, z);
              
              function magChange() {
               io.sockets.emit('magX', { magX: x });
               io.sockets.emit('magY', { magY: y }); //not sure about this part
               io.sockets.emit('magZ', { magZ: z }); //not sure about this part

      };

      magChange();
      })
   
            sensorTag.notifyMagnetometer(function() {
             console.log('magnetometer is on');
            });

          });

        //end of magnetometer//

    });
  });
});

app.listen(3000);



