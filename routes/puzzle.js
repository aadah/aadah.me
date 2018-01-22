var express = require('express')

var router = express.Router()

var config = require('../utils/puzzle_config')

router.get(config.puzzle_one, function (req, res) {
  res.status(200).render('puzzle/one')
})

router.get(config.puzzle_two, function (req, res) {
  res.status(200).render('puzzle/two')
})

router.get(config.puzzle_three, function (req, res) {
  res.status(200).render('puzzle/three')
})

router.get(config.puzzle_meta, function (req, res) {
  res.status(200).render('puzzle/meta')
})

router.post('/check', function (req, res) {
  var ans = req.body.ans

  if (ans[0].trim().toLowerCase() === config.meta_ans1) {
    ans[0] = 1
  } else {
    ans[0] = 0
  }

  if (ans[1].trim().toLowerCase() === config.meta_ans2) {
    ans[1] = 1
  } else {
    ans[1] = 0
  }

  if (ans[2].trim().toLowerCase() === config.meta_ans3) {
    ans[2] = 1
  } else {
    ans[2] = 0
  }

  var val = ans[0] + ans[1] + ans[2]

  if (val === 3) {
    res.send(config.congrats)
  } else {
    res.send(ans)
  }
})

router.get(config.congrats, function (req, res) {
  res.status(200).render('puzzle/congrats')
})

module.exports = router
