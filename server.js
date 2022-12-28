const express = require ("express")
const bodyparser = require("body-parser");
const qrcode = require("qrcode");
const http = require("http");
const {Server} = require('socket.io')
const app = express()
const server = http.createServer(app);
const io = new Server(server);


const PORT = 4000 || env.process.PORT
const parser = bodyparser();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/public')
app.use('/static', express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/qrcode', async(req, res) => {
    try {
        let rand = Math.floor(Math.random()*100000000 + Math.random()*28753);
        await qrcode.toDataURL(rand.toString(), (err, url) => {
            res.render('qr', {'url':url, 'id': rand})
        })
    } catch (error) {
        console.log(error)
        res.send("not found")
    }
})

io.on("connection", (socket) => {
    let roomid;
    console.log("user connected");
    socket.on("joinroom", (id) => {
        socket.join(id);
        roomid = id;
    })
    socket.on("msg", (msg) => {
        socket.to(roomid).emit("msg", msg);
    })
    socket.on("disconnect", (msg) => {
        console.log("user disconnected")
    })
} )

server.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`)
})