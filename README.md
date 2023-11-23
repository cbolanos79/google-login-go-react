# Google login with react and go

A simple project focused on learning how to integrate frontend and backend using React and Go.
The goal is to login on Google using Google Login javascript, and check if credential is valid by sending a request to google API in backend. After validating credential, a response is sent showing if credential is valid or not.
Take into account a valid google developer account and client are required. There are a lot of tutorials on how to them.

# Flow
Show a google login in frontend using react and send credential to backend in order to validate it.

```mermaid
sequenceDiagram
  participant Frontend
  participant Backend
  participant Google API
  Frontend->>Backend: POST /login/google
  alt Success
    Backend->>Google API: verify_oauth2_token
    activate Google API
    Note right of Google API: Valid token
    Google API-->>Backend: ok
    deactivate Google API
    Backend->>Frontend: HTTP 200
  else Error
    Backend->>Google API: verify_oauth2_token
    activate Google API
    Note right of Google API: No valid token
    Google API-->>Backend: error
    deactivate Google API
    Backend->>Frontend: HTTP 422
  end
```

## API

## Validate
The purpose of this endpoint is to ensure the client exists and is a valid google user.

### Request

```json
POST /login/google
{
  "credential": "..."
}
```

`credential` is the value returned by the call to Google Login javascript library.
The purpose of this endpoint is to ensure the client exists and is valid. 
In a real world application, there would be a login endpoint which receive credential from google login and creates a JWT token if user exists in database, and is valid.

### Responses

**Valid credential**
```json
HTTP 200

{}
```

**Invalid credential**
```json
HTTP 422

{
  "error": "Error message with details"
}
