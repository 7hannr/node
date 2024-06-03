var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');

var upload = multer({
  storage:multer.diskStorage({
    destination:(req, file, done)=>{
      done(null, './public/photos')
    },
    filename:(req, file, done)=>{
      var filename=Date.now() + '.jpg';
      done(null, filename);
    }
  })
});

//사진업로드
router.post('/photo', upload.single('file'), function(req, res){
  const uid=req.body.uid;
  const fileName='/photos/' + req.file.filename;
  const sql='update users set photo=? where uid=?';
  db.get().query(sql, [fileName, uid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//사용자목록
router.get('/list', function(req, res){
  const sql='select * from users order by regDate desc';
  db.get().query(sql, function(err, rows){
    res.send(rows);
  });
});

//사용자정보 /users/read/blue
router.get('/read/:uid', function(req, res){
  const uid=req.params.uid;
  const sql='select * from users where uid=?';
  db.get().query(sql, [uid], function(err, rows){
    res.send(rows[0]);
  });
});

//로그인체크
router.post('/login', function(req, res){
  const uid=req.body.uid;
  const upass=req.body.upass;
  const sql='select * from users where uid=?';
  db.get().query(sql, [uid], function(err, rows){
    const row=rows[0];
    let result=0;
    if(row != null){
      if(row.upass == upass){
        result=1;
      }else{
        result=2;
      }
    }
    res.send({result});
  });
});

//회원가입
router.post('/insert', function(req, res){
  const uid=req.body.uid;
  const upass=req.body.upass;
  const uname=req.body.uname;
  const sql='insert into users(uid,upass,uname) values(?,?,?)';
  db.get().query(sql, [uid, upass, uname], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

//회원정보수정
router.post('/update', function(req, res){
  const uid=req.body.uid;
  const uname=req.body.uname;
  const address1=req.body.address1;
  const address2=req.body.address2;
  const phone=req.body.phone;
  const sql='update users set uname=?,address1=?,address2=?,phone=? where uid=?';
  db.get().query(sql,[uname,address1,address2,phone,uid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

module.exports = router;