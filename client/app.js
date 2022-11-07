const loginForm = document.querySelector("#welcome-form");
const messagesSection = document.querySelector("#messages-section")
const messagesList =document.querySelector("#messages-list")
const addMessageForm = document.querySelector("#add-messages-form")
const userNameInput = document.querySelector("#username")
const messageContentInput = document.querySelector("#message-content")
const socket = io();

var userName = null;


socket.on('message',({author, content}) => addMessage(author, content));



loginForm.addEventListener("submit", function(e){
    e.preventDefault();
    login()

})



const login = () =>{
  
    if(userNameInput.value.length === 0){        
        alert('Podaj imię albo uciekaj')
    
    }else{    
        userName = userNameInput.value;
        messagesSection.classList.add('show');
        loginForm.classList.remove('show');
        socket.emit('logIn', ({author: userName, }))
    }   
}

addMessageForm.addEventListener("submit", function(e){
    e.preventDefault();
    sendMesage()

})


    

const sendMesage = () => {
    if(messageContentInput.value.length !== 0){
        
        console.log('tak')
        addMessage(userName, messageContentInput.value);
        socket.emit('message',{author: userName, content: messageContentInput.value});
        messageContentInput.value=""
    }else{
        
        alert('Nie wpisałeś wiadomości')
        console.log('nie')
    }
}

let nextClass =""

const addMessage = (user, text) =>{
    if(user ===userName){
        nextClass = 'message--self';
    }else if(user ==='ADMIN'){
        nextClass = 'message--admin'
    }else{
        nextClass =""
    }
    const oneMessage =  '<li class="message message--received '+ nextClass +'"><h3 class="message__author">' + user + '</h3><div class="message__content">' +  text + '</div></li>'
    messagesList.innerHTML += oneMessage


}



