# oslash_backend_clone

This is clone of the oslash backend API. It done as a home assignment.

### Schema Design

Find the schema design from below link created using dbdiagram.io

> Link: https://dbdiagram.io/embed/6181077ad5d522682df4ae35

#### Description: 

  - User table for storing all the user profile details and the shortcuts created by the user (reference to the Shortcut table)
  
  - Shortcut table contains details like url, shortlink, descriptio, tags for the specific shortcut and refers to the user created by it.

### API routes

Find all the routes from below link created documented using hedgedoc.org

> Link: https://demo.hedgedoc.org/s/is00DQWCV

#### Description:
  - All routes with request and response body types are documented
  - All url paths are shown


## API setup

Clone the repo using git cli command:
```
gh repo clone 5war00p/oslash_backend_clone
```

Change working directory:

```
cd oslash-backend-clone
```

Install all required packages:

```
npm i
```

**.env** (Environment Variables) file setup
```
API_PORT                        # port to run server
API_VERSION                     # API version
API_BIND_ADDR                   # binding address (if any) by default set to '0.0.0.0'
DB_URI                          # mongo DB_URI
ACCESS_TKN_EXP_TIME             # expire time for access_token
REFRESH_TKN_EXP_TIME            # expire time for refresh_token
ACCESS_TOKEN_SECRET             # access_token secret
REFRESH_TOKEN_SECRET            # refresh_token secret
```
