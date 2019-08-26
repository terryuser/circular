const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();

//Set up express
const app = express();
const path = require('path');


//Connet to mongodb
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://admin:APW0yMShJ8aBEk8b@circulardb-9rm3u.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.Promise = global.Promise;


//Define value
const PORT = process.env.PORT = 4000;


//Get html files
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/login.html'));
    //__dirname : resolve to project folder.
});

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/login.html'));
    //__dirname : resolve to project folder.
});

app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/register.html'));
    //__dirname : resolve to project folder.
});

app.get('/register/success', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/register_success.html'));
    //__dirname : resolve to project folder.
});

app.get('/warning', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/warningPage.html'));
    //__dirname : resolve to project folder.
});

app.get('/circular', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/dashboard_circular.html'));
    //__dirname : resolve to project folder.
});

app.get('/detail', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/dashboard_detail.html'));
    //__dirname : resolve to project folder.
});

app.get('/editlist', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/dashboard_editList.html'));
    //__dirname : resolve to project folder.
});

app.get('/add', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/dashboard_add.html'));
    //__dirname : resolve to project folder.
});

app.get('/edit', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/dashboard_edit.html'));
    //__dirname : resolve to project folder.
});

app.get('/member', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/dashboard_member.html'));
    //__dirname : resolve to project folder.
});

app.get('/member/add', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/dashboard_addMember.html'));
    //__dirname : resolve to project folder.
});

//Request handling
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//Allow routers
app.use('/api_v1', require('./routers/api_v1'));


//Allow fily type access
app.use('/', express.static(__dirname + '/'));
app.use('/js/tools', express.static(__dirname + '/js'));
app.use('/js/page', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/html', express.static(__dirname + '/html'));


//Error handling
app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(422).send(err);
    //res.send({error: err.message});
})

//Listen to request
app.listen(PORT, () => {
    console.log('listening for requests')
})