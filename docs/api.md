# API documentation

## `/things`
Currently there are two types of things: `place` and `raw`. To avoid duplication
I will only talk about `things`. They share the same endpoints.

### `GET /things/:id`
This endpoint is used to retrieve things. `:id` can be:
- a UUID of a thing, which will provide the most recent version of that thing
  - If the provided UUID is not found, `404` is returned
  - If the provided `:id` is not a valid UUID, `400` is returned
- `all`, which will retreive all things currently available
- `property` or `property=`, which will retrieve all things that have a property
of that name
- `property=value`, which will retrieve all things that have the provided property
set to the provided value

### `POST /things`
This endpoint is used to create a new thing. For `place`, the following conditions
have to be met for the place to be added to the database:
- The provided data needs to be valid geojson
- The provided data needs to have sane Coordinates - latitude between -90 and 90 degrees,
longitude between -180 and 180 degrees
- The provided data needs to have a property `name` with a nonempty string

If any of there conditions are not met, `400` will be returned with an appropriate
error message

Currently there are no limitations/validataions for `raw` things.

### `PUT /things/:id`
This endpoint is used to update an existing thing. `:id` as to be a valid UUID.
The new version of the thing has to meet the same criteria as if it would be created.

// TO BE CONTINUED

### `DELETE /things/:id`
This endpoint is used to delete a thing.

// TO BE CONTINUED

### `GET /things/:id/versions`
This endpoint will return a `FeatureCollection` with all the known versions of that
thing. If `:id` is an invalid UUID, `400` is returned. If no thing can be found for
a valid UUID, `404` is returned.

### `GET /things/:id/version/:versionId`
This endpoint will return a specific version of a thing. If either of the two
IDs is not a valid UUID `400` is returned. If neither `:id` nor `:versionId` can
be found, `404` is returned.

Each thing has a property called `_versionId`, in case you wanted to know where
to get that id from.

## `/versions`
Everytime a thing is updated it will not be changed in place, instead a new version
document will be created which will be linked to the Journal of that thing. The
`/versions` endpoints provide access to these.

### `GET /versions`
Retrieves a `FeatureCollection` of all versions ever created. That one is a pretty
big request.

### `GET /versions/:id`
Retrieves a specific version by id. Invalid UUID -> `400`, UUID not found -> `404`

### `GET /versions/latest/:count`
Retrieves a `FeatureCollection` of the newest `:count` versions, chronologically sorted from newest to oldest.

`:count` needs to be parseable into an integer.

### `GET /versions/since/:pointInTime`
Retrieves a `FeatureCollection` of versions that were created since `:pointInTime`,
where `:pointInTime` needs to be a valid JavaScript timestamp.
The filtering is based on the `:_timestamp` property of each Version and `:pointInTime`
is an INCLUSIVE boundary.

If `:pointInTime` can't be parsed to a number `400` will be returned.
