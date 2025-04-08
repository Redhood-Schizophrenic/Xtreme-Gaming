/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2223581722")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "membership",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Standard",
      "Member"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2223581722")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Standard",
      "Member"
    ]
  }))

  return app.save(collection)
})
