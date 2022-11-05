# About

A simple script to backup MySQL database to Google Drive.

Feel free to contribute.

# Setup

## Create a Google Service Account

1. Go to [Google Service Accounts.](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click create a service account.
3. Go in to the newly created service account, and go to keys tab to create and download the keys.
4. Rename the key file to credentials.json and store it in the root directory.

## Enable Google Drive API

1. Go to the [Google API Console.](https://console.developers.google.com)
2. Click Enable APIs and Services.
3. Find Google Drive and enable it.

## Share Google Drive folder to API

1. Go to [Google Drive.](https://drive.google.com)
2. Select/Create a folder, right click on it and select share.
3. Grab the "client_email" from credentials.json, and share it to that email.

## Create a .env

Create a .env file in the root directly, example below.

```
HOST = example.com
DB_USER = admin
DB_PASSWORD = 123456
DATABASE = test
GOOGLE_FOLDER_ID = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

To get the Google folder ID, go to Google Drive online, then open the folder that you shared and grab the id from the URL, example below.

```
https://drive.google.com/drive/u/1/folders/[ID IS HERE]
```

# Running it

```
node app.js
```

# PM2 setup

Example command to run every day at 1am.

```
pm2 start app.js --name mysql-backup --cron "0 1 * * *"
pm2 save
```