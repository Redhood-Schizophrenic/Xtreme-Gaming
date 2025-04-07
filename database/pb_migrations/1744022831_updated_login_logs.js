/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_656593255")

  // remove field
  collection.fields.removeById("autodate2852702992")

  // remove field
  collection.fields.removeById("autodate902624559")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date2852702992",
    "max": "",
    "min": "",
    "name": "login",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date902624559",
    "max": "",
    "min": "",
    "name": "logout",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_656593255")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "autodate2852702992",
    "name": "login",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "autodate902624559",
    "name": "logout",
    "onCreate": false,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("date2852702992")

  // remove field
  collection.fields.removeById("date902624559")

  return app.save(collection)
})
