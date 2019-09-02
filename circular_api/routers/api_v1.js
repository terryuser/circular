const express = require('express');
const router = express.Router();
const Circular = require('../models/circular');
const School = require('../models/school');
const Group = require('../models/group');
const Member = require('../models/member');
const Reply = require('../models/reply');

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


//Add group
router.post('/create/group', function(req, res, next) {
    Group.findOne({ name: req.body.name, schoolID: req.body.schoolID }, function(err, result) {
        if (result != null) {
            console.log("GroupName Duplicate");
            sendJson.message = "Group Name Duplicate";
            res.send(sendJson);
        } else {
            Group.create(req.body).then(function(group) {
                sendJson = {"message": "", "result": group};
                sendJson.message = "Group create success";
                res.send(sendJson);
            }).catch(next); 
        }
    });
});



//Get group list
router.post('/findGrouplist/:memberID', function(req, res, next) {

    Member.findOne({ _id: req.params.memberID }, function(err, result) {
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

//Get group info
router.post('/group/info/:groupID', function(req, res, next) {
    Group.findOne({ _id: req.params.groupID }, function(err, result) {
        sendJson = { "message": "success", "result": result };
        res.send(sendJson);
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
router.post('/member/:memberID', function(req, res, next) {
    
    Member.findOne({ _id: req.params.memberID }, function(err, result) {
        if (result) {
            var memberID = result._id;
            var user = result.userID;
            var group = result.groupID;
            var emailAddress = result.email;
            var lastDate = result.lastOnline;
            var school;
            var level;

            Group.findOne({ _id: group }, function(err, result) {
                school = result.schoolID;
                level = result.authorityLevel;
                sendJson = { "message": "success", "memberID": memberID,"userID": user, "groupID": group, "schoolID": school,"authorityLevel": level, "email": emailAddress, "lastOnline": lastDate };
                res.send(sendJson);
            });
        } else {
            sendJson = { message: "noResult" };
        }
    });

});

//Get member conunt
router.post('/member/count/:groupID', function(req, res, next) {
    Member.find({ groupID: req.params.groupID }, function(err, result) {
        sendJson = { count: result.length };
        res.send(sendJson);
    });
});

//Member reply
router.post('/member/reply/:circularID', function(req, res, next) {
    
});

//Get member from group
router.post('/member/list/:groupID', function(req, res, next) {
    Member.find({ groupID: req.params.groupID }, function(err, result) {
        sendJson = { memberList: result };
        res.send(sendJson);
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
                sendJson.ID = result._id;
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

        Circular.find({schoolID: req.body.schoolID, releaseDate: { $ne: null }}, function(err, result) {
            if(result) {
                var nextPageCheck;
                if (result.length > itemPerPage) {
                    var q = Circular.find({schoolID: req.body.schoolID, releaseDate: { $ne: null }}).sort({'date': -1}).skip(skipRecord).limit(itemPerPage);
                    nextPageCheck = true;
                } else {
                    var q = Circular.find({schoolID: req.body.schoolID, releaseDate: { $ne: null }}).sort({'date': -1});
                    nextPageCheck = false;
                }
                q.exec(function(err, result) {
                    sendJson = { "message": "success", "result": result, "nextPage": nextPageCheck, "resultCount": result.length };
                    res.send(sendJson);
                });
            } else {
                sendJson.message = "Not Found";
                res.send(sendJson);
            }
        });
    } else {
        Circular.find({target_GruopID: req.body.groupID}, function(err, result) {
            if(result) {
                var nextPageCheck;
                if (result.length > itemPerPage) {
                    var q = Circular.find({target_GruopID: req.body.groupID, releaseDate: { $ne: null }}).sort({'date': -1}).skip(skipRecord).limit(itemPerPage);
                    nextPageCheck = true;
                } else {
                    var q = Circular.find({target_GruopID: req.body.groupID, releaseDate: { $ne: null }}).sort({'date': -1});
                    nextPageCheck = false;
                }
                q.exec(function(err, result) {
                    sendJson = { "message": "success", "result": result, "nextPage": nextPageCheck, "resultCount": result.length };
                    res.send(sendJson);
                });
            } else {
                sendJson.message = "Not Found";
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

    Circular.find({schoolID: req.body.schoolID, authorityRequest: { $gte: req.body.authorityLevel }}, function(err, result) {
        if(result) {
            console.log(result.length + " result");
            var nextPageCheck;
            if (result.length >= itemPerPage) {
                var q = Circular.find({schoolID: req.body.schoolID, authorityRequest: { $gte: req.body.authorityLevel }}).sort({'date': -1}).skip(skipRecord).limit(itemPerPage);
                nextPageCheck = true;
            } else {
                var q = Circular.find({schoolID: req.body.schoolID, authorityRequest: { $gte: req.body.authorityLevel }}).sort({'date': -1});
                nextPageCheck = false;
            }
            q.exec(function(err, result) {
                sendJson = { "message": "success", "result": result, "nextPage": nextPageCheck, "resultCount": result.length };
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
        
            if (query.releaseDate == null) {
                Circular.findOneAndUpdate(
                    { _id: req.body._id },
                    { $set: { "target_GruopID": query.target_GruopID, "title": query.title, "content": query.content,"replyMethod": query.replyMethod, "replyOption": query.replyOption, "replyInput":query.replyInput} },
                    { returnNewDocument: true }).then(function(result) {
    
                    console.log(result);
                    sendJson = { message: "", data: result };
                    sendJson.message = "updated";
                    res.send(sendJson);
                });
            } else {
                Circular.findOneAndUpdate(
                    { _id: req.body._id },
                    { $set: { "target_GruopID": query.target_GruopID, "title": query.title, "content": query.content,"replyMethod": query.replyMethod, "replyOption": query.replyOption,"replyInput":query.replyInput, "releaseDate" : query.releaseDate} },
                    { returnNewDocument: true }).then(function(result) {
                    
                    console.log(result);
                    sendJson = { message: "", data: result };
                    sendJson.message = "updated";
                    res.send(sendJson);
                });
            }
            
        }
    })    
});

//Member reply update to circular DB
router.put('/circular/reply/:circularID', function(req, res, next) {
    
    Circular.findOne({ _id: req.params.circularID }, function(err, result) {
        if (result) {
            var signedList = result.signedMember;

            if (!signedList.includes(req.body.memberID)) {
                signedList.push(req.body.memberID);
                console.log(signedList);

                Circular.findOneAndUpdate(
                    { _id: req.params.circularID },
                    { $set: { "signedMember": signedList} },
                    { returnNewDocument: true }).then(function(result) {
                    
                    console.log(result);
                    sendJson = { message: "", data: result };
                    sendJson.message = "Member signed the circular";
                    res.send(sendJson);
                });
            } else {
                console.log("Already signed");
                sendJson = { message: "Already signed" };
                res.send(sendJson);
            }
        } else {
            console.log("Circular Not find");
            sendJson = { message: "Circular Not find" };
            res.send(sendJson);
        }
    });

});


//Reply DB
router.put('/replyDB/update', function(req, res, next) {
    Reply.findOne({ "circularID": req.body.circularID, "memberID": req.body.memberID }, function(err, result) {
        if (result) {
            Reply.findOneAndUpdate(
                { "circularID": req.body.circularID, "memberID": req.body.memberID },
                { $set: { "replyOption": req.body.replyOption, "replyInput": req.body.replyInput } },
                { returnNewDocument: true }).then(function(result) {
                console.log(result);
                sendJson = { message: "Reply DB updated", data: result };
                res.send(sendJson);
            });
        } else {
            Reply.create(req.body).then(function(result) {
                sendJson.message = "Member first reply";
                console.log(sendJson.message);
                res.send(sendJson);
            }).catch(next)
        }
    });
});

//Get reply list
router.post('/replyList/:cicular', function(req, res, next) {
    Reply.find({"circularID": req.params.cicular}, function(err, result){
        console.log(result);
        res.send(result);
    }); 
});

module.exports = router;