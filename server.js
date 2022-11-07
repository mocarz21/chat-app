const express = require('express');
const path = require('path');
const socket = require('socket.io')


const messages  = [];
let usersLogIn =[];

const app = express();


app.use(express.static(path.join(__dirname, '/client/')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server)

io.on('connection', (socket) => {
  let newUser =''
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('logIn', ({author}) => {
    messageAuthor = author
    console.log(author, 'log in on id' , socket.id)
    usersLogIn.push({name: author, id: socket.id})
    newUser = author
    socket.emit('message',({author: 'ADMIN', content: author + ' has joined the conversation!'}))
    console.log('users log in ', usersLogIn)
   })
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message',message) 
  });
  console.log('I\'ve added a listener on message event \n');
  socket.on('disconnect', () => {
    logOutUser = usersLogIn.find(user => socket.id == user.id) //czemu nie działało mi jak robiłem w ten sposób używając  logOutUser.name
    socket.broadcast.emit('message',({author: 'ADMIN', content: newUser + ' has left the conversation!'}))
    
    console.log('Oh, socket ' + socket.id + ' has left') 
    usersLogIn = usersLogIn.filter(user => user.id !== socket.id)
    console.log('users stil log in ', usersLogIn)
     
    });
});