# API documentation

## Specifying language
Use HTTP header Accept-Language to specify the prefered language. Supported locales: en, en-gb, sv \
For more information, have a look at [MDN manual about Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language).

## Using JWT
Create your JWT using the login endpoint. For logged in routes, specify JWT as a bearer token in Authorization HTTP header. Look at the examples below.

## Endpoints

### Get competences

**Uri:** `/api/competences` \
**Method:** `GET`

#### Request
```bash
curl -X GET http://localhost:3333/api/competences
```

#### Response
```json
{
  "competences": [
    {
      "competence_id": 1,
      "name": "Sausage grill"
    },
    {
      "competence_id": 2,
      "name": "Carousel operation"
    }
  ]
}
```

### Get statuses

**Uri:** `/api/statuses` \
**Method:** `GET`

#### Request
```bash
curl -X GET http://localhost:3333/api/statuses
```

#### Response
```json
{
  "statuses": {
    "unhandled": "Unhandled",
    "approved": "Approved",
    "rejected": "Rejected"
  }
}
```


### Login

Responds with a JWT token that is used for logged in routes.

**Uri:** `/api/login` \
**Method:** `POST`

#### Request
```bash
curl -X POST \
  http://localhost:3333/api/login \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ 
    "username": "my-username",
    "password": "my-password"
  }'
```

#### Response
```json
{
  "type": "bearer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImRhdGEiOnsicm9sZSI6ImFwcGxpY2FudCJ9LCJpYXQiOjE1NTAxNjAwMTF9.MfugkhOkATpK93nMDy3G8CZNIj6QYJQD2YO2LOX7diI",
  "refreshToken": null
}
```

### Register

**Uri:** `/api/register` \
**Method:** `POST`

#### Request
```bash
curl -X POST \
  http://localhost:3333/api/register \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ 
    "name": "anders",
    "surname": "andersson",
    "email": "anders@anders.se",
    "ssn": "19500404-3213",
    "username": "something",
    "password": "my-password",
    "password_confirmation": "my-password"
  }'
```

#### Response
```json
{
  "message": "The account was created."
}
```

### Create application (role: applicant)

**Uri:** `/api/applicant/application` \
**Method:** `POST`

#### Request
```bash
curl -X POST \
  http://localhost:3333/api/applicant/application \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImRhdGEiOnsicm9sZSI6ImFwcGxpY2FudCJ9LCJpYXQiOjE1NTAxNjAwMTF9.MfugkhOkATpK93nMDy3G8CZNIj6QYJQD2YO2LOX7diI' \
  -d '{ 
    "expertiseCompetenceId": [1],
    "expertiseYearsOfExperience": [2.5],
    "availabilityFrom": ["2018-01-01", "2018-05-01"],
    "availabilityTo": ["2018-02-01", "2018-05-10"]
  }'
```

#### Response
```json
{
  "message": "You have successfully applied"
}
```

### Search for applications (role: recruiter)

**Uri:** `/api/recruiter/applications` \
**Method:** `GET`

#### Request
```bash
curl -X GET \
  'http://localhost:3333/api/recruiter/applications?from=&to=&date=&competence=&name=&page=1' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsicm9sZSI6InJlY3J1aXRlciJ9LCJpYXQiOjE1NTAxNjE2ODd9.tIfT0RYGbSI8uICpYJLqnol3uDE875nYdrH01CJDBe0'  
```

#### Response
```json
{
  "persons": [
    {
      "person_id": 2,
      "name": "Per",
      "surname": "Strand",
      "ssn": "19671212-1211",
      "email": "per@strand.kth.se",
      "username": "strand",
      "application_date": "2019-02-13T23:00:00.000Z",
      "application_status": "unhandled",
      "application_reviewed_at": null
    }
  ],
  "paginator": {
    "total": 1,
    "perPage": 10,
    "page": 1,
    "lastPage": 1
  }
}
```

### Get information about specific application (role: recruiter)

**Uri:** `/api/recruiter/applications/:personId` \
**Method:** `GET`

#### Request
```bash
curl -X GET \
  'http://localhost:3333/api/recruiter/applications/2' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsicm9sZSI6InJlY3J1aXRlciJ9LCJpYXQiOjE1NTAxNjE2ODd9.tIfT0RYGbSI8uICpYJLqnol3uDE875nYdrH01CJDBe0'
```

#### Response
```json
{
  "person": {
    "person_id": 2,
    "name": "Per",
    "surname": "Strand",
    "ssn": "19671212-1211",
    "email": "per@strand.kth.se",
    "username": "strand",
    "application_date": "2019-02-13T23:00:00.000Z",
    "application_status": "unhandled",
    "application_reviewed_at": null
  },
  "availabilities": [
    {
      "from_date": "2017-12-31T23:00:00.000Z",
      "to_date": "2018-01-31T23:00:00.000Z"
    },
    {
      "from_date": "2018-04-30T22:00:00.000Z",
      "to_date": "2018-05-09T22:00:00.000Z"
    }
  ],
  "competenceProfiles": [
    {
      "years_of_experience": 2.5,
      "competence": {
        "competence_id": 1,
        "name": "Sausage grill"
      }
    }
  ]
}
```


### Update application status (role: recruiter)

**Uri:** `/api/recruiter/applications/:personId` \
**Method:** `POST`

#### Request
```bash
curl -X POST \
  http://localhost:3333/api/recruiter/applications/2 \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsicm9sZSI6InJlY3J1aXRlciJ9LCJpYXQiOjE1NTAxNjE2ODd9.tIfT0RYGbSI8uICpYJLqnol3uDE875nYdrH01CJDBe0'
  -d '{
    "applicationStatus": "accepted"
  }'
```

#### Response
```json
{
  "message": "Successfully updated application"
}
```
