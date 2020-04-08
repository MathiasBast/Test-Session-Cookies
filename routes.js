const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const myData = require('./data.json')
const utils = require('./utils')

router.get('/', (req, res) => {
  console.log(req.session)
  res.render('home', myData)
})

router.get('/add', (req, res) => {
  res.render('add', myData)
})

router.post('/add', (req, res) => {
  const { name, age, qualites, password } = req.body
  let data = {
    id: myData.users.length + 1,
    name,
    age,
    qualites,
    password
  }
  bcrypt.hash(data.password, saltRounds, function (err, hash) {
    if (err) console.error(err)
    data.password = hash
    utils.add(data, err => {
      if (err) return res.sendStatus(500)
      res.redirect('/add')
    })
  })
})

router.get('/see_passwords', (req, res) => {
  res.render('passwords')
})

router.post('/see_passwords', (req, res) => {
  const { name, password } = req.body
  let data = {
    name,
    password
  }
  utils.checkPassword(data, (err, data) => {
    if (err) {
      data = {
        error: "Can not find Username or Password"
      }
      res.render('passwords', data)
    } else {
      req.session.userID = data.id
      res.redirect('/')
    }
  })
})

router.get('/data', (req, res) => {
  id = req.session.userID
  if(id) {
    utils.showData(id, (err, data) => {
      if(err) console.error("problem ", err)
      else {
        res.render('data', data)
      }
    })
  }
  else {
    res.redirect('/')
  }
})

router.get('/log_out', (req,res) => {
  req.session.userID = 0
  res.redirect('/')
})

module.exports = router

