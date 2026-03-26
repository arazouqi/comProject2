# comProject2

## Members
Ansh Matieda
Nadir Ktir
Luca Lunghi
Areij Khan
Luiza Halilaj
Max Bailey

## participants making the website and app
Nadir Ktir
Luca Lunghi

## Description
Shared repository for our school project.

## Mobile app

### requirements 
- Node.js installed
- Expo Go app installed on your phone


### Install dependencies

```bash
cd mobile
npm install
```

and for backend:
```bash
cd server
npm install
```

### running the app
start the backend server in one terminal:
```bash
cd server
npm start
```

start the app in a seperate terminal:
```bash
cd mobile
npx expo start -c
```
use the website (teacher role) to generate the qr code and then scan the qr code presented using the mobile app installed (Expo Go) on a student account

(i've made it so that you can only scan the qr code for attendence during the time and date of the event not before or after, so make an event using the teacher role that is happening now, and then scan the qr code from the website for attendence)

### logins to use (can use other ones that are in the databse)
teacher account:
username -> Nabibby (can use the email instead)
password -> 1234

student account:
username -> Big Z (can use the email instead)
password -> 1234

admin account:
username -> Luca (can use the email instead)
password -> 1234


## access the website
make sure the server is running first, then put this in the browser:
http://localhost:3000/signin.html
