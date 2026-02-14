# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.






###########################################################

EXPO_PUBLIC_API_BASE_URL=http://localhost:4000

admin run in port 5173


testing end point
http://localhost:4001/api/v1/vendors
http://localhost:4001/api/v1/health
http://localhost:4001/api/v1/auth/me





# TO INSTALL MONGODB FOLLOW THIS LINK DOCOMENTATION
https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-on-ubuntu/#std-label-install-mdb-community-ubuntu


# start mongodb
sudo systemctl start mongod
# once it failed  enter this command 
sudo systemctl daemon-reload
# verify if started successful
sudo systemctl status mongod
# stop mongoDB
sudo systemctl stop mongod
# restart mongoDB
sudo systemctl restart mongod
# begin using MongoDB
mongosh

# user
db.admins.insertOne({
  email: "admin@example.com",
  password: "$2b$10$CwTycUXWue0Thq9StjUM0uJ8pJbB7fE3QEzXHV8Tz6cXLZGvT6oWy", 
  // This is "trustika12@45" hashed with bcrypt
  name: "Trustika Admin",
  role: "admin",
  createdAt: new Date()
})
