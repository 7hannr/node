var express = require('express');
var router = express.Router();
var db = require('../db');

/*게시판 목록페이지 이동*/
router.get('/', function (req, res, next) {
    res.render('index.ejs', { title:'게시판',pageName:'posts/list.ejs' });
});

// 게시판 목록 데이터 불러오기
router.get('/list.json', function(req, res){
    const sql = 'select *,date_format(pdate, "%Y-%m-%d %T") fdate from posts order by pid desc';
    db.get().query(sql, function(err, rows){
      if(err){
        console.log('게시판목록불러오기:', err);
      }else{
        res.send(rows);
      }
    });
  })
//글쓰기 페이지로 이동
router.get('/insert', function(req, res){
    res.render('index.ejs', {title:'글쓰기', pageName:'posts/insert.ejs'})
});

//글을 DB저장
router.post('/insert', function(req, res){

    const title=req.body.title;
    const contents=req.body.contents;
    const uid=req.body.uid;
    console.log(title, contents, uid);
    const sql="insert into posts(title,contents,writer) values(?,?,?)";
    db.get().query(sql, [title, contents, uid], function(err, rows){
        res.redirect('/posts');
    });
});

//게시글 Read 페이지이동
router.get('/read', function(req, res){
    const pid=req.query.pid;
    console.log(pid);
    const sql="select *,date_format(pdate, '%Y-%m-%d %T') fdate from posts where pid=?";
    db.get().query(sql, [pid], function(err, rows){
        console.log(rows[0]);
        res.render('index.ejs', 
            {
                title:'게시글정보', 
                pageName:'posts/read.ejs',
                post:rows[0]
            });
    })
});

module.exports = router;