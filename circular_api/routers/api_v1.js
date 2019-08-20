const express = require('express');
const router = express.Router();
const Circular = require('../models/circular');
const School = require('../models/school');
const Group = require('../models/group');

const path = require('path');

var sendJson;

//Add school
router.post('/create/school', function(req, res, next) {

    sendJson = { message: "" }
    
    School.findOne({ loginID: req.body.loginID }, function(err, result) {
        if (result != null) {

        } else {
            School.create(req.body).then(function(school) {
                console.log(school);

                var schoolAdmin = {"name":"admin","authorityLevel":1,"schoolID":school._id};
                
                Group.create(schoolAdmin).then(function(group) {
                    console.log(group);
                    sendJson.message = "success";
                    res.send(sendJson);
                }).catch(next);

            })
        }
        
    });
});

//Get school info
router.post('/school/:loginID', function(req, res, next) {

    sendJson = { message: "", id: "" }

    School.findOne({ loginID: req.params.loginID }, function(err, result) {
        if (result) {
            res.send(result);
        }
    });
    
});

//Get school group
router.post('/group/:schoolID', async function(req, res, next) {

    Group.find({ schoolID: req.params.schoolID }, function(err, groupData) {
        if (groupData) {
            sendJson = { "message": "", "result": groupData};
            sendJson.message = "success";
            res.send(sendJson);
        } else {
            sendJson.message = "Not found";
            res.send(sendJson);
        }
    });

});

//Add member
router.post('/create/circular', function(req, res, next) {

    sendJson = { message: "" }

    Circular.create(req.body).then(function(member) {
        sendJson.message = "success";
        console.log(sendJson);
        res.send(sendJson);
    }).catch(next);
    
});

//Login
router.post('/create/school', function(req, res, next) {

    sendJson = { message: "", name: "", ID: "" }

    Member.findOne({ name: req.body.name }, function(err, result) {

        if (result != null) {

            console.log("Password on DB: " + result.name + "      Input PW: " + req.body.password);

            if (req.body.password == result.name) {
                sendJson.name = result.name;
                sendJson.message = "LoginSuccess";
                console.log(sendJson);
                res.send(sendJson);
            } else {
                sendJson.message = "LoginFailed";
                console.log(sendJson);
                res.send(sendJson);
            }

        } else {
            sendJson.message = "LoginFailed";
            console.log("request account is not exist");
            res.send(sendJson);
        }
    });
    
});

//Add circular
router.post('/create/circular', function(req, res, next) {

    sendJson = { message: "" }

    Circular.create(req.body).then(function(member) {
        sendJson.message = "success";
        console.log(sendJson);
        res.send(sendJson);
    }).catch(next);
    
});



module.exports = router;