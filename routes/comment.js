const express = require("express");
const path = require("path")
const router = express.Router();
const pool = require("../config");

// Get comment
router.get('/:blogId/comments', async function(req, res, next){
});

// Create new comment
router.post('/:blogId/comments', async function(req, res, next){
    const id = req.params.blogId
    const { comment, like, comment_by_id } = req.body

    try {
        const [rows, fields] = await pool.query(
        'INSERT INTO comments (blog_id, comment, `like`, comment_date, comment_by_id) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)',
            [id, comment, like, comment_by_id]
        )
        return res.json({
            message: `A new comment is added (ID: ${rows.insertId})`
        })
    } catch (err) {
        console.log(err)
    }
});

// Update comment
router.put('/comments/:commentId', async function(req, res, next){
    const id = req.params.blogId
    const { comment, like, comment_by_id } = req.body

    try {
        const [rows, fields] = await pool.query(
        'UPDATE comments SET comment = ?, `like` = ?, comment_date = ?, comment_by_id = ?, blog_id = ? where id = ?',
            [comment, like, comment_date, comment_by_id, blog_id, id]
        )
        return res.json({
            message: `Comment ID ${id} is updated.`,
            comment: {
                comment: comment,
                like: like,
                comment_date: comment_date,
                comment_by_id: comment_by_id,
                blog_id: blog_id
            }
        })
    } catch (err) {
        console.log(err)
    }
});

// Delete comment
router.delete('/comments/:commentId', async function(req, res, next){
    const id = req.params.commentId
    try {
      const [rows, fields] = await pool.query(
        'DELETE FROM comments where id=?',
        [id]
      )
      return res.json({
        message: `Comment ID ${id} is deleted.`,
      })
    } catch (err) {
      console.log(err)
    }
});

// Delete comment
router.put('/comments/addlike/:commentId', async function(req, res, next){
    const id = req.params.commentId
    try {
        const [rows, fields] = await pool.query(
        'SELECT * FROM comments WHERE id=?',
        [id]
        )

        let likeNum = rows[0].like
        likeNum += 1

        const [rows2, fields2] = await pool.query("UPDATE comments SET `like` = ? where id=?",
        [likeNum, id])

        return res.json({
            blogId: rows[0].blog_id,
            commentId: parseInt(id),
            likeNum: likeNum
        })
  } catch (err) {
    console.log(err)
  }
});


exports.router = router