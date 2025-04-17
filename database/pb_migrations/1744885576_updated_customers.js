/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2223581722")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number1872009285",
    "max": null,
    "min": null,
    "name": "time",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2223581722")

  // remove field
  collection.fields.removeById("number1872009285")

  return app.save(collection)
})
