module.exports = (req, res, next) => {
  // build pagination params
  req.pagination = {
    skip: req.query.page ? (req.query.page - 1) * req.query.itemsPerPage : 0,
    limit: req.query.itemsPerPage * 1
  }

  // build sort params
  if (req.query.sortBy) {
    req.sort = {}

    for (let i = 0; i < req.query.sortBy.length; i++) {
      req.sort[req.query.sortBy[i]] = req.query.sortDesc[i] === 'false' ? -1 : 1
    }
  }

  // build filter params
  if (req.query.filter) {
    const options = []

    for (let i = 0; i < req.query.filter.attribute.length; i++) {
      const attribute = req.query.filter.attribute[i]
      const type = req.query.filter.type[i]
      const operator = req.query.filter.operator[i]
      let value = req.query.filter.value[i]

      if (value) {
        switch (type) {
          case 'date':
            value = new Date(value)
            break
          case 'regexp':
            value = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            break
        }

        switch (operator) {
          case '':
            options.push({ [attribute]: value })
            break
          default:
            options.push({
              [attribute]: { [operator]: value }
            })
            break
        }
      }
    }

    if (options.length) {
      req.filter = { [req.query.mode || '$and']: options }
    }
  }

  next()
}
