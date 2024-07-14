# Photo Upload and Display

## Project overview


## Setup instructons

### Backend

#### Installation

```
$ npm install
```

#### Run

```
$ npm run start
```

### Frontend

#### Installation

```
$ npm install
```

#### Run

```
$ npm run start
```


## API documentation

### GET /public

### POST /login

### POST /register

### POST /api/photos

request
```
{ "photo" "title" "description" "latitude" "longitude" }
```

response
```
{ "message" }
```

### GET /api/photos


## Any assumptions or design decisions made


Recap! This application allows each user to upload a photo (which will be saved in the 'public' folder in .jpg format). Each user can view their own photos and a brief album of each user. Additionally, you can check on the map where the photo was taken! The authentication system uses JWT, and passwords in the database are encrypted and decrypted at registration and login for added security. The authentication token lasts for 100 hours, which is adjustable. The encryption password is stored in the .env file. Furthermore, it will be necessary to download the database version (using MySQL or another system) on which the app's functionality is based. All rights reserved to the author of this project, Simone Ferraro.

