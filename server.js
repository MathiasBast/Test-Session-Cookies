const express = require('express')
const hbs = require('express-handlebars')
const router = require('./routes')
const session = require('express-session')
// =========================
const server = express()

const THREE_HOURS = 1000 * 60 * 60 * 3

const {
  NODE_ENV = 'development',
  SESS_NAME = 'SessionId',
  SESS_LIFETIME = THREE_HOURS,
  SESS_SECRET = '6jaR$k4S#k8PsEq@'
} = process.env

const IN_PROD = NODE_ENV === ' production'

// Middleware
server.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs'
}))

server.set('view engine', 'hbs')
server.use(express.static('public'))
server.use(express.urlencoded({ extended: false }))
server.use(session({
  name: SESS_NAME,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}))

module.exports = server

server.use('/', router)

