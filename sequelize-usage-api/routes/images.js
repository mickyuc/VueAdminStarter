const path = require('path')
const fs = require('fs')
const express = require('express')
const router = express.Router()
const { MAGIC_MIME_TYPE, Magic } = require('mmmagic')

router.get('/:category?/:uid', (req, res, next) => {
  let imagePath = path.resolve(__dirname, '..', '.uploads', req.params.uid)
  if (req.params.category) {
    imagePath = path.resolve(__dirname, '..', '.uploads', req.params.category, req.params.uid)
  }

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      res.status(404).send()
    } else {
      const magic = new Magic(MAGIC_MIME_TYPE)
      magic.detectFile(imagePath, (err, mimeType) => {
        if (err) {
          next(err)
        } else {
          res.set('Content-Type', mimeType)
          res.send(data)
        }
      })
    }
  })
})

module.exports = router
