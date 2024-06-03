var express = require('express');
var db =require('../db');
var router = express.Router();
var multer = require('multer');

var upload = multer({
  storage:multer.diskStorage({
    destination:(req, file, done)=>{
      done(null, './public/books')
    },
    filename:(req, file, done)=>{
      var filename=Date.now() + '.jpg';
      done(null, filename);
    }
  })
});

//이미지업로드
router.post('/upload',upload.single('file'), function(req, res){
  const bid=req.body.bid;
  const filename="/books/"+req.file.filename;
  const sql='update books set bigimage=?,updateDate=now() where bid=?';
  db.get().query(sql, [filename,bid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});

/* 도서등록 */
router.post('/insert', function(req, res, next) {
  const title=req.body.title;
  const price=req.body.price;
  const contents=req.body.contents;
  const isbn=req.body.isbn;
  const publisher=req.body.publisher;
  const author=req.body.authors;
  const image=req.body.thumbnail;
  //console.log(title,price,contents,isbn,publisher,author,image);

  const sql='select * from books where isbn=?';
  db.get().query(sql,[isbn],function(err,rows){
    if(rows.length==0){
      const sql1='insert into books(title,price,contents,isbn,publisher,author,image) values(?,?,?,?,?,?,?)';
      db.get().query(sql1,[title,price,contents,isbn,publisher,author,image],
                function(err,rows){
          res.send({result:1});
      })
    }else{
      res.send({result:0});
    }
  });
});

//도서목록 테스트:/books/list?page=1&size=5
router.get('/list', function(req, res){
  const page=parseInt(req.query.page);
  const size=parseInt(req.query.size);
  const key=req.query.key;
  const word=req.query.word;
  const uid=req.query.uid;
  let sql ="select *,date_format(regdate,'%Y-%m-%d %T') fmtdate,format(price,0) fmtprice,";
      sql+="(select count(*) from likes where books.bid=likes.bid) lcnt,";
      sql+="(select count(*) from likes where books.bid=likes.bid and uid=?) ucnt,";
      sql+="(select count(*) from review where books.bid=review.bid) rcnt";
      sql+=" from books ";
      sql+=` where ${key} like '%${word}%'`;
      sql+=" order by bid desc";
      sql+=" limit ?,?";

  db.get().query(sql, [uid,(page-1)*size, size], function(err, rows){
    const documents = rows;
    sql = "select count(*) total from books";
    sql+=` where ${key} like '%${word}%'`;
    db.get().query(sql, function(err, rows){
      const count=rows[0].total;
      res.send({count, documents});
    })
  });
});

//도서삭제
router.post('/delete',function(req,res){
  const bid=req.body.bid;
  const sql="delete from books where bid=?";
  db.get().query(sql,[bid],function(err,rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  })
});

//도서정보 read
router.get('/read/:bid',function(req,res){
  const bid=req.params.bid;
  const uid=req.query.uid;
  let sql="select *,date_format(regDate,'%Y-%m-%d') fmtdate,format(price,0) fmtprice,";
         sql+=" (select count(*) from likes where books.bid=likes.bid) lcnt,";
         sql+=" (select count(*) from likes where books.bid=likes.bid and uid=?) ucnt";
         sql+=" from books where bid=?";
  db.get().query(sql,[uid,bid],function(err,rows){
   res.send(rows[0]);
  });
});

//도서정보수정
router.post('/update',function(req,res){
  const bid=req.body.bid;
  const title=req.body.title;
  const price=req.body.price;
  const author=req.body.author;
  const contents=req.body.contents;
  const sql="update books set title=?,price=?,author=?,contents=?,updateDate=now() where bid=?";
  db.get().query(sql,[title,price,author,contents,bid],function(err,rows){
    if(err) {
      res.send({result:0});
    }else{
      res.send({result:1});
    }
   });
});

//조아요추가
router.post('/likes/insert',function(req,res){
  const uid=req.body.uid;
  const bid=req.body.bid;
  const sql="insert into likes(uid,bid) values(?,?)";
  db.get().query(sql,[uid,bid],function(err,rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    } 
  });
});

//좋아요취소
router.post('/likes/delete', function(req, res){
  const uid=req.body.uid;
  const bid=req.body.bid;
  const sql="delete from likes where uid=? and bid=?";
  db.get().query(sql, [uid, bid], function(err, rows){
    if(err){
      res.send({result:0});
    }else{
      res.send({result:1});
    }
  });
});
module.exports = router;
