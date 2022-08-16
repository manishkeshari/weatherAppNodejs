const http = require("http");
const fs = require("fs");
var requests = require("requests");
var geoip = require('geoip-lite');
const ip = require('quick-getip');
const requestIp = require('request-ip');

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal)=>{
    let temparature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temparature = temparature.replace("{%tempminimum%}",orgVal.main.temp_min);
    temparature = temparature.replace("{%tempmax%}",orgVal.main.temp_max);
    temparature = temparature.replace("{%place%}",orgVal.name);
    temparature = temparature.replace("{%country%}",orgVal.sys.country);
    temparature = temparature.replace("{%temparaturestatus%}",orgVal.weather[0].main);
    return temparature;
}
const server =http.createServer((req, res) => {
    if(req.url=="/"){
        
        //ip().then(ip=>{ 
            var clientIp = requestIp.getClientIp(req);
            currIP=clientIp;
           //console.log(currIP);
       
           var ipnew = currIP;
           //un comment below 3 lines of code to get actual location of the user.
           //it will not work on your local server as localhost ip is 127.0.0.1
           // to run it on live server just uncomment the below 3 lines and comment static cityname and countryname variables below.
        //    var geo = geoip.lookup(ipnew);
        //    var cityname=geo.city;
        //    var countryname=geo.country;

           var cityname="Kolkata";
           var countryname="IN"; 
        //    //prints location of the user using his ip address
        //    console.log(geo);
        //    console.log(geo.city);
        //    console.log(geo.country);

       
       

            requests("https://api.openweathermap.org/data/2.5/weather?q="+cityname+','+countryname+"&units=metric&APPID=dd42fad7087c74604b7e174b7412ca41")
                .on('data', function (chunk) {
                    const objData = JSON.parse(chunk);
                    const arrayData = [objData];
                    //console.log(arrayData);
                    //console.log(arrayData[0].main.temp);
                    const realTimeData = arrayData.map((val) => replaceVal(homeFile, val)).join();

                    res.write(realTimeData);
                    //console.log(realTimeData);
                })
                .on('end', function (err) {
                    if (err) return console.log('connection closed due to errors', err);
                    res.end();
                    //console.log('end');
                });
        
        //});

    }
});

server.listen(8000,"localhost");