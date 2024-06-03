var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//장바구니등록
router.post('/insert', function(req, res){
  const uid=req.body.uid;
  const bid=req.body.bid;
  const sql='insert into cart(uid, bid) values(?,?)';
  db.get().query(sql, [uid, bid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

//장바구니 목록
router.get('/list/',function(req,res){
  const uid=req.query.uid;
  const sql="select * from view_cart where uid=? order by regDate desc";
  db.get().query(sql,[uid],function(err,rows){
    res.send(rows);
  })
})

//수량수정
router.post('/update',function(req,res){
  const uid=req.body.uid;
  const bid=req.body.bid;
  const qnt=req.body.qnt;
  const sql="update cart set qnt=? where bid=? and uid=?";
  db.get().query(sql, [qnt, bid,uid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

//장바구니삭제
router.post('/delete',function(req,res){
  const uid=req.body.uid;
  const bid=req.body.bid;
  const sql="delete from cart where uid=? and bid=?";
  db.get().query(sql, [uid,bid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

module.exports = router;