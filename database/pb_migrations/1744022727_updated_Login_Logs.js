/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_656593255")

  // update collection data
  unmarshal({
    "name": "login_logs"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_656593255")

  // update collection data
  unmarshal({
    "name": "Login_Logs"
  }, collection)

  return app.save(collection)
})
