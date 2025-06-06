var http = require('http');

http.createServer(function (req, res) {
    res.write("i am alive");   
    res.end();  
}).listen(8080);