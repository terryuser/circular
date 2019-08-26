const express = require('express');
const router = express.Router();
const Circular = require('../models/circular');
const School = require('../models/school');
const Group = require('../models/group');
const Member = require('../models/member')

const path = require('path');

var sendJson;


//Add school
router.post('/create/school', function(req, res, next) {

    sendJson = { message: "", loginID: "" }
    
    School.findOne({ schoolName: req.body.schoolName }, function(err, result) {
        if (result != null) {
            console.log("School Name Duplicate");
            sendJson.message = "School Name Duplicate";
            res.send(sendJson);
        } else {
            School.create(req.body).then(function(school) {
                console.log(school);

                var groupData;

                //Create admin group
                var schoolAdmin = {"name":"admin","authorityLevel":1,"schoolID":school._id};

                Group.create(schoolAdmin).then(function(group) {
                    groupData = group._id;
                    console.log(groupData);

                    //Create member for login
                    var adminID = "admin_" + school._id;
                    var schoolAdminAccount = {"userID": adminID, "groupID":groupData, "loginName": adminID, "loginPW": "admin","email": req.body.email, "lastOnline": ""};
                    console.log(schoolAdminAccount);

                    Member.create(schoolAdminAccount).then(function(member) {
                        sendJson.message = "success";
                        sendJson.loginID = member.loginName;
                        res.send(sendJson);
                    }).catch(next);
                }).catch(next);

            })
        }
        
    });
});


//Get group list
router.post('/findGrouplist/:userID', function(req, res, next) {

    Member.findOne({ userID: req.params.userID }, function(err, result) {
        if (result) {
            var group = result.groupID;

            Group.findOne({ _id: group }, function(err, resultJson) {
                console.log(resultJson);
                if (resultJson) {
                    Group.find({ schoolID: resultJson.schoolID, authorityLevel: { $gte: resultJson.authorityLevel } }, function(err, groupData) {
                        if (groupData) {
                            sendJson = { "message": "", "result": groupData, "authority": resultJson.authorityLevel};
                            sendJson.message = "success";
                            res.send(sendJson);
                        } else {
                            sendJson.message = "Not found";
                            res.send(sendJson);
                        }
                    });
                }
            });
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


//--------Member APi-----------

//Add member
router.post('/create/member', function(req, res, next) {

    sendJson = { message: "" }

    Member.create(req.body).then(function(member) {
        sendJson.message = "success";
        console.log(sendJson);
        res.send(sendJson);
    }).catch(next);
    
});

// Get member info
router.post('/member/:userID', function(req, res, next) {
    
    Member.findOne({ userID: req.params.userID }, function(err, result) {
        if (result) {
            var user_ID = result.userID;
            var group = result.groupID;
            var emailAddress = result.email;
            var lastDate = result.lastOnline;
            var school;
            var level;

            Group.findOne({ _id: group }, function(err, result) {
                school = result.schoolID;
                level = result.authorityLevel;
                sendJson = { message: "success", userID: user_ID, groupID: group, schoolID: school,authorityLevel: level, email: emailAddress, lastOnline: lastDate };
                res.send(sendJson);
            });
            
        } else {
            sendJson = { message: "noResult" };
        }
    });
});

//Login
router.post('/login', function(req, res, next) {

    sendJson = { message: "", name: "", ID: "" }

    Member.findOne({ loginName: req.body.loginName }, function(err, result) {

        if (result != null) {

            console.log("Password on DB: " + result.loginName + "      Input PW: " + req.body.loginPW);

            if (req.body.loginPW == result.loginPW) {
                sendJson.name = result.loginName;
                sendJson.ID = result.userID;
                sendJson.message = "LoginSuccess";
                console.log(sendJson);
                res.send(sendJson);
            } else {
                sendJson.message = "Login failed";
                console.log(sendJson);
                res.send(sendJson);
            }

        } else {
            sendJson.message = "Login failed, account is not exist";
            console.log("request account is not exist");
            res.send(sendJson);
        }
    });
    
});


//--------Circular APi-----------

//Add circular
router.post('/create/circular', function(req, res, next) {

    sendJson = { message: "" }

    Circular.create(req.body).then(function(circular) {
        sendJson.message = "success";
        console.log(sendJson);
        res.send(sendJson);
    }).catch(next);
    
});

//Get circular list
router.post('/circular/:page', function(req, res, next) {

    var itemPerPage =  25;
    var skipRecord = (req.params.page - 1) * itemPerPage;
    console.log("skipRecord: " + skipRecord);

    if (req.body.authorityLevel <= 2) {
        console.log("find below level" + req.body.authorityLevel + "  school: " + req.body.schoolID);

        Circular.find({schoolID: req.body.schoolID}, function(err, result) {
            if(result) {
                if (result.length > itemPerPage) {
                    var q = Circular.find({schoolID: req.body.schoolID}).sort({'date': -1}).skip(skipRecord).limit(itemPerPage);
                } else {
                    var q = Circular.find({schoolID: req.body.schoolID}).sort({'date': -1});
                }
                q.exec(function(err, result) {
                    sendJson = { "message": "", "result": result, "nextPage": true};
                    sendJson.message = "success";
                    res.send(sendJson);
                });
            } else {
                sendJson.message = "success";
                res.send(sendJson);
            }
        });
    } else {
        Circular.find({target_GruopID: req.body.groupID}, function(err, result) {
            if(result) {
                if (result.length > itemPerPage) {
                    var q = Circular.find({target_GruopID: req.body.groupID}).sort({'date': -1}).skip(skipRecord).limit(itemPerPage);
                } else {
                    var q = Circular.find({target_GruopID: req.body.groupID}).sort({'date': -1});
                }
                q.exec(function(err, result) {
                    sendJson = { "message": "", "result": result, "nextPage": true};
                    sendJson.message = "success";
                    res.send(sendJson);
                });
            } else {
                sendJson.message = "success";
                res.send(sendJson);
            }
        });
    }
    
});

//Get edit circular list
router.post('/editList/:page', function(req, res, next) {

    var itemPerPage =  25;
    var skipRecord = (req.params.page - 1) * itemPerPage;
    console.log("find " + req.body.authorityLevel + "   " + req.body.schoolID);
    console.log("skipRecord: " + skipRecord);

    Circular.find({schoolID: req.body.schoolID,releaseDate: null, authorityRequest: { $gte: req.body.authorityLevel }}, function(err, result) {
        if(result) {
            console.log(result.length + " result");
            if (result.length >= itemPerPage) {
                var q = Circular.find({schoolID: req.body.schoolID,releaseDate: null, authorityRequest: { $gte: req.body.authorityLevel }}).sort({'date': -1}).skip(skipRecord).limit(itemPerPage);
            } else {
                var q = Circular.find({schoolID: req.body.schoolID,releaseDate: null, authorityRequest: { $gte: req.body.authorityLevel }}).sort({'date': -1});
            }
            q.exec(function(err, result) {
                sendJson = { "message": "", "result": result, "nextPage": true};
                sendJson.message = "success";
                res.send(sendJson);
            });
        } else {
            sendJson.message = "no result";
            res.send(sendJson);
        }
    });
});

//Get circular detail for edit
router.post('/edit/:id', function(req, res, next) {
    Circular.findOne({ _id: req.params.id}, function(err, result) {
        sendJson = { message: "", data: result };
        res.send(sendJson);
    }).catch(next);
});

//Get circular detail for edit
router.put('/edit/:id', function(req, res, next) {
    
    Circular.findOne({ _id: req.body._id }).then(function(result) {
        if (result == null) {
            sendJson = { message: "" };
            sendJson.message = "notfind";
            console.log(sendJson);
            res.send(sendJson);
        } else {
            var query = req.body;
            console.log(query);

            if (query.releaseDate == null) {
                Circular.findOneAndUpdate(
                    { _id: req.body._id },
                    { $set: { "target_GruopID": query.target_GruopID, "title": query.title, "content": query.content,"replyMethod": query.replyMethod, "replyOption": query.replyOption} },
                    { returnNewDocument: true }).then(function(result) {
    
                    sendJson = { message: "", data: result };
                    sendJson.message = "updated";
                    console.log(sendJson);
                    res.send(sendJson);
    
                });
            } else {
                Circular.findOneAndUpdate(
                    { _id: req.body._id },
                    { $set: { "target_GruopID": query.target_GruopID, "title": query.title, "content": query.content,"replyMethod": query.replyMethod, "replyOption": query.replyOption, "releaseDate" : query.releaseDate} },
                    { returnNewDocument: true }).then(function(result) {
    
                    sendJson = { message: "", data: result };
                    sendJson.message = "updated";
                    console.log(sendJson);
                    res.send(sendJson);
    
                });
            }
            
        }
    })    
});



module.exports = router;