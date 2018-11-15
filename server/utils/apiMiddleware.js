const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const err = new Error('Not allowed!')
    err.status = 401
    return next(err)
  }
  next()
}

const adminsOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    const err = new Error('Not allowed!')
    err.status = 401
    return next(err)
  }
  next()
}

const testingOnly = (req, res, next) => {
  if (!process.env.NODE_ENV === 'test') {
    const err = new Error('Not allowed!')
    err.status = 401
    return next(err)
  }
  next()
}

module.exports = {
  isLoggedIn,
  adminsOnly,
  testingOnly
}
