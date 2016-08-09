# hapi-method-demo
Shows methods doing their magic

## Requirements
A redis server running at localhost:6379

## How to use
Start the server with `node index.js` which starts a server at localhost:8080

To add a token run POST localhost:8080/auth/token with a `userId` and `token` field.

Ex:

```
curl -X POST -H "Content-Type: application/json" -d '{
    "userId": "abc123",
    "token": "abc123"
}' "http://localhost:8080/auth/token"
```

To retrieve (validate) a token run GET localhost:8080/auth/token?token=<token>

Ex:
```
curl -X GET "http://localhost:8080/auth/token?token=abc123"
```

## Example Responses
* Trying to retrieve a token that does not exist should return a 401
* After creating a token it will be "persisted". 
* Subsequent requests for that token will result in the cached version being served. 