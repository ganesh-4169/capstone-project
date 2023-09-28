const express = require('express');
const app = express();
const request=require('request');
app.use(express.static("public"));
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key1.json");

initializeApp({
  credential: cert(serviceAccount)
});
0
const db = getFirestore();
  
app.get('/signup', function (req, res) {  
  res.sendFile(__dirname + "/public/" + "signup.html")  
});

app.get('/login', function (req, res) {  
  res.sendFile(__dirname + "/public/" + "login.html") 
});

app.get("/dashboard", function (req, res) {
    res.sendFile(__dirname + "/public/" + "dashboard.html" );
});


app.post('/signupsubmit', function (req, res) {
  db.collection("Details")
    .where("email","==",req.body.email)
    .get()
    .then  ((docs)=>{
      if(docs.size>0){
        res.send("Hey user this account is already exist")
      }
      else{
  db.collection("Details").add({
    username :req.body.username,
    email: req.body.email,
    password: req.body.password 
  })
  .then(() =>{
    const successMessage="Signup Succesfull. click here to <a href='/login'>Log in</a>.";
    res.send(successMessage);
  });}
});});

app.post("/loginSubmit", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    db.collection("Details")
    .where("email","==",email)
    .where("password","==" ,password)
    .get()
    .then((docs)=>{
        console.log(docs);
        console.log(docs.size);
        if(docs.size>0){
          res.sendFile(__dirname + "/public/" + "dashboard.html" );
        }
        else{
            res.send("login failed");
        }
      })
      
});

  
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})