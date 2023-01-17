const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const viewsRoutes = require('./routes/views.routes');

const PORT = process.env.PORT || 9090;
const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(viewsRoutes);

const httpServer = app.listen(PORT, ()=>{});

const messages = [];

const io = new Server(httpServer);

io.on('connection', (socket)=>{
    socket.on('login', (user)=>{
        socket.emit('message-logs', messages);
        socket.broadcast.emit('new-user', user)
    })

    socket.on('message', (data)=>{
        messages.push(data);
        io.emit('message-logs', messages);
    })

});