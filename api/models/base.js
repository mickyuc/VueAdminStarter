const { ObjectId } = require('mongodb')

module.exports = class BaseModel {
  constructor (db) {
    this._db = db
  }

  static findById (id, projection = {}) {
    return this.findOne({ _id: new ObjectId(id) }, projection)
  }

  static findOne (filter = {}, projection = {}) {
    return this.collection.findOne(filter, { projection })
  }

  static findAll (filter = {}, projection = {}, pagination = {}, sort = {}) {
    return this.collection.find(filter, pagination).sort(sort).project(projection)
  }

  static count (filter = {}) {
    return this.collection.countDocuments(filter)
  }

  static create (doc, timestamp = true) {
    if (timestamp) {
      doc.createdTime = new Date()
    }

    return this.collection.insertOne(doc)
  }

  static update (filter, $set, timestamp = true) {
    const update = {
      $set
    }

    if (timestamp) {
      update.$currentDate = { lastModifiedTime: true }
    }

    return this.collection.updateOne(filter, update)
  }

  static remove (filter) {
    return this.collection.remove(filter)
  }
}
