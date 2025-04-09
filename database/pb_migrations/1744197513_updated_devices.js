/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2153001328")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2308610364",
    "maxSelect": 4,
    "name": "rules",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Power_Off",
      "Reboot",
      "Auto_Screenshot",
      "Lockdown"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2153001328")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2308610364",
    "maxSelect": 2,
    "name": "rules",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Power_Off",
      "Reboot",
      "Auto_Screenshot",
      "Lockdown"
    ]
  }))

  return app.save(collection)
})
