var express = require('express');
var router = express.Router();
var db =require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '회사소개',pageName:'home.ejs' });
});

//로그인page
router.get('/login', function(req, res, next) {
  res.render('index', { title: '로그인',pageName:'users/login.ejs' });
});

//로그인체크
router.post('/login',function(req,res){
  const uid=req.body.uid;
  const upass=req.body.upass;
  console.log(uid,upass);
  const sql="select * from users where uid=?";
  db.get().query(sql,[uid],function(err,rows){
    if(err){
      console.log('에러:',err);
      return;
    }
    console.log(rows[0]);
    let result=0;
    if(rows[0]){
      if(rows[0].upass==upass){
        result=1;
      }else{
        result=2;
      }
    }
    res.send({result});
  });
});

module.exports = router;
