/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2875923803")

  // remove field
  collection.fields.removeById("number2287204505")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2875923803")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2287204505",
    "max": null,
    "min": null,
    "name": "each_price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
