# API documentation

## About Versions and Journals

The database contains two kinds of Documents - journals and versions.
When you query for a point of interest by its UUID what you are actually
referring to is its Journal-ID. The journal itself holds an Array of UUIDs to
the versions associated with the journal. Here is an example of a journal
document:
```
{
   "_id": "76100b453de20da6744eac8670000fc5",
   "_rev": "4-874ae036f130f7b401fcb29f409b0cf4",
   "context": "journal",
   "type": "place",
   "versions": [
       "76100b453de20da6744eac867000183c",
       "76100b453de20da6744eac8670002061",
       "76100b453de20da6744eac8670002c5a"
   ],
   "data": {
     "type": "Feature",
     "properties": {
        "name": "The Name",
        ...
     }
   }
}
```

And here is an example of a version document:
```
{
  "_id": "76100b453de20da6744eac8670002c5a",
  "_rev": "1-adb2c0c2185883dfcc67f670f78c5431",
  "journal": "76100b453de20da6744eac8670000fc5",
  "data": {
    "type": "Feature",
    "properties": {
      "name": "test",
      ...
    },
  },
  "author": "Douglas Adams",
  "description": "Have fun, and thanks for all the fish!",
  "context": "version",
  "timestamp": 1496915264158
}
```

When a point of interest is changed, there are actually three things happening:
1. A new version document is created
2. The UUID of the new version document is added to the list of versions inside
the journal
3. The journals data attribute is set to the contents of the new version documents
data attribute

## What you'll receive is neither. What you'll get, ...
What you will receive when querying the API are parts of version documents
What they will contain differs slightly whether or not you query for one or
multiple documents.

### ... when you ask for a single document
To know what you receive when you query for only **one** document, you
have to take a look at
[the `parseCurrentVersion` method inside the version model](server/controllers/things/models/commons/version.js)
:
```
parseCurrentVersion: function (versionDoc) {
  const data = versionDoc.data
  data._id = versionDoc.journal
  data._versionId = versionDoc._id

  if(versionDoc.status && versionDoc.status.deleted === true)
    data._deleted = true
}
```
We just take the data object of the version doc, set its `_id` to the journals
UUID and add its own UUID as the `_versionId` attribute.

### ... when you ask for multiple documents
To know what you receive when you query for multiple documents, you
have to take a look at
[the `convertArrayToFeatureCollection` method inside the lib_utils](server/controllers/lib_utils.js):

First, we create the Skeleton of a Feture-Collection:
```
var feature_collection = {
  'type': 'FeatureCollection',
  'source': `${hostname}/${item_type}${query_string}`,
  'license': 'Public Domain',
  'features': []
}
```

Then we will build the features. Each feature is built out of the data attribute
of the version document, with a bit of meta data added (in this code snipped,
item refers to our version document):
```
var feature = item.data

if (!feature.properties) {
  feature.properties = {}
}
feature.properties._timestamp = item.timestamp
feature.properties._id = item.journal
feature.properties._versionId = item._versionId
feature.properties._uri = uri_builder(item, hostname, item_type)

return feature
```

## The API Endpoints

Every time you query for more than one object a `FeatureCollection` will be
returned.

### `/things`
Journals and versions describe things. Currently there are two types of things:
`place` and `raw`. To avoid duplication I will only talk about `things`.
They share the same endpoints. When I talk about an endpoint called
`/things/:id` I am actually talking about two endpoints -
one called `/place/:id`, the other `/raw/:id`.

#### `GET /things/:id`
This endpoint is used to retrieve the most recent version of things,
where `:id` can be one of the following:

- a UUID of a thing, which will provide the most recent version of that thing
  - If the provided UUID is not found, `404` is returned
  - If the provided `:id` is not a valid UUID, `400` is returned
- `all`, which will retrieve all things currently available. This will include
things that are deleted.
- `property` or `property=`, which will retrieve all things that have a property
of that name. This won't include deleted things.
- `property=value`, which will retrieve all things that have the provided property
set to the provided value. This won't include deleted things.

The result will not include things that are marked as deleted.

#### `POST /things`
This endpoint is used to create a new thing. If successful, the id of the
created thing is returned.

##### Valid data for places
If you try to create a thing via the `/place` route, your data has to meet the
following conditions:
- The provided data needs to be valid geojson
- The provided data needs to have sane Coordinates - latitude between -90 and 90 degrees,
longitude between -180 and 180 degrees
- The provided data needs to have a property `name` with a nonempty string

If any of these conditions isn't met, `400` will be returned with an appropriate
error message.

##### Valid data for raw

Currently there are no limitations/validations for `raw` things.

#### `PUT /things/:id`
This endpoint is used to update an existing thing. To change a thing the new
version of the thing has to meet the same criteria as if you want to create it
and the API will react with the same answer: `400`, if the data you are sending
is not meeting the criteria.

If the UUID you've provided is a malformed, `400` will be returned. If the UUID
you've provided is not present, `404` will be returned.

If the update was successful, the new version of

#### `DELETE /things/:id`
This endpoint is used to mark a thing as deleted by adding a new version that
has `"status": { "deleted": true }` added to it.

If the provided UUID is not a valid UUID `400` will be returned. If nothing
can be found with the provided UUID `404` will be returned. If the thing you
are trying to delete is already deleted,`208` will be returned.

If the deletion completes successfully, the full journal document of that poi

#### `GET /things/:id/versions`
This endpoint will return all known versions of a thing identified by its UUID.

If `:id` is an invalid UUID, `400` is returned. If no thing can be found for
a valid UUID, `404` is returned.

#### `GET /things/:id/version/:versionId`
This endpoint will return a specific version of a thing. If either of the two
IDs is not a valid UUID `400` is returned. If either `:id` or `:versionId`
can't be found `404` will be returned.

### `/versions`
With these Endpoints you can dig through the history of the data provided.
You will receive them in the same format as the most recent versions available
through the /things/id

#### `GET /versions`
This will give you all versions ever recorded.

#### `GET /versions/:id`
Retrieves a specific version identified by its id.

#### `GET /versions/latest/:count`
Retrieves the newest `:count` versions, chronologically sorted from newest to
oldest.

`:count` needs to be parseable into an integer. If it is not `400` will be
returned.

#### `GET /versions/since/:pointInTime`
Retrieves a `FeatureCollection` of versions that were created since `:pointInTime`,
where `:pointInTime` needs to be a valid JavaScript timestamp.
The filtering is based on the `:_timestamp` property of each Version and `:pointInTime`
is an INCLUSIVE boundary.

If `:pointInTime` can't be parsed to a number `400` will be returned.
