const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')

module.exports = {
  add,
  checkPassword,
  showData
}

function add (myData, callback) {
  const fileName = path.join(__dirname, 'data.json')
  fs.readFile(fileName, (err, contents) => {
    if (err) return new Error('can not load')
    const json = JSON.parse(contents)
    json.users.push(myData)
    const string = JSON.stringify(json, null, 2)
    fs.writeFile(fileName, string, 'utf-8', callback)
  })
}

function checkPassword (data, callback) {
  const fileName = path.join(__dirname, 'data.json')
  fs.readFile(fileName, (err, contents) => {
    if (err) return new Error('can not load')
    const json = JSON.parse(contents)
    var indx = null
    json.users.forEach(element => {
      if (element.name === data.name) {
        indx = element.id - 1
      }
    })
    if (indx !== null) {
      const HashPassword = json.users[indx].password
      bcrypt.compare(data.password, HashPassword, function (err, result) {
        if (err) Error('not working at hashing')
        if (result) {
          var data = {
            result,
            id: json.users[indx].id
          }
          callback(null, data)
        } else {
          var aErr = new Error('User Name or password not found')
          callback(aErr, null)
        }
      })
    } else {
      var aErr = new Error('User Name or password not found')
      callback(aErr, null)
    }
  })
}

function showData (id, callback) {
  const fileName = path.join(__dirname, 'data.json')
  fs.readFile(fileName, (err, contents) => {
    if(err) return new Error('Can not load')
    const json = JSON.parse(contents)
    json.users.map(people => {
        if(people.id === id){
          data = {
            name: people.name,
            qualites: people.qualites,
            age:people.age
          }
          callback(null, data)
        }
    })
  })
}