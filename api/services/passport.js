const passport = require('passport')
const JsonStrategy = require('passport-json').Strategy
const User = require('../models/user')

passport.use(new JsonStrategy(
  {
    usernameProp: 'username',
    passwordProp: 'password',
    passReqToCallback: true
  },
  async (req, username, password, done) => {
    try {
      const user = await User.findByUsernameOrEmail(username)

      if (!user) {
        return done(null, false, { message: 'Invalid user' })
      } if (!user.password) {
        return done(null, false, { message: 'Invalid provider' })
      } if (!User.comparePassword(password, user.password.hash)) {
        return done(null, false, { message: 'Invalid password' })
      }

      await User.updateLastLoginTime(user._id)

      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }
))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id, { password: 0 })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

module.exports = passport
