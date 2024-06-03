var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//리뷰등록
router.post('/insert', function(req, res){
  const uid=req.body.uid;
  const bid=req.body.bid;
  const contents=req.body.contents;
  const sql="insert into review(uid,bid,contents) values(?,?,?)";
  db.get().query(sql, [uid,bid,contents], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

//리뷰목록 // /review/list/91?page=1&size=2
router.get('/list/:bid',function(req,res){
  const bid=req.params.bid;
  const page=parseInt(req.query.page);
  const size=parseInt(req.query.size);
  let sql="select * from view_review";
      sql+=" where bid=?";
      sql+=" order by rid desc";
      sql+=" limit ?,?";
  db.get().query(sql, [bid,(page-1)*size,size], function(err, rows){
    const documents=rows;
    sql="select count(*) count from review where bid=?";
    db.get().query(sql, [bid], function(err, rows){
      res.send({documents, count:rows[0].count});
    });
 });  
});

//리뷰삭제
router.post('/delete/:rid',function(req,res){
  const rid=req.params.rid;
  const sql="delete from review where rid=?";
  db.get().query(sql, [rid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

//리뷰수정
router.post('/update',function(req,res){
  const rid=req.body.rid;
  const contents=req.body.contents;
  const sql="update review set contents=? where rid=?";
  db.get().query(sql, [contents,rid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});
module.exports = router;