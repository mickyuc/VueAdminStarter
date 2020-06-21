const jwt = require('jsonwebtoken')
const SECRET_KEY = 'vxpQZUtHlYZBNQub'

module.exports.authorize = (req, res, next) => {
  const token = (req.headers.authorization || '').split(/[Bb]earer /)[1]
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      next(err)
    } else {
      req.user = decoded
      next()
    }
  })
}

module.exports.signin = (req, res) => {
  const token = jwt.sign(req.user, SECRET_KEY, {
    expiresIn: '1y'
  })

  // res.set('Authorization', `Bearer ${token}`)
  res.set('Authorization', token)
  res.send(req.user)
}
