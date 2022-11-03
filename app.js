require('dotenv').config()
const mysqldump = require('mysqldump')
const { google } = require('googleapis');
const credentials = require('./credentials.json');
const fs = require('fs')

const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
];

const auth = new google.auth.JWT(
  credentials.client_email, null,
  credentials.private_key, scopes
);

const drive = google.drive({ version: "v3", auth });

async function dumpDb() {
    await mysqldump({
        connection: {
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
        },
        dumpToFile: './dump.sql',
    })
}


async function deleteOldBackup() {
    drive.files.list({q: "name='backup.sql'"}, async (err, resp) => {
        if (err) throw err;
        const files = resp.data.files;
        if (files.length) {
            for (let i of files) {
                await drive.files.delete({fileId: i.id})
            }
            console.log('delete complete');
        } else {
            console.log('No files found')
        }
    });
}

async function uploadNewBackup() {
    var fileMetadata = {
        'name': 'backup.sql',
        'parents':[process.env.GOOGLE_FOLDER_ID]
    };
    var media = {
        mimeType: 'application/sql',
        body: fs.createReadStream('./dump.sql') 
    };
    
    await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }).then (function(err, file) {
        if(err) {
            console.log(err);
        } else {
            console.log('Uploaded File Id: ', file.id);
        }
        });
}

//init
(async()=>{
    await dumpDb()
    await deleteOldBackup()
    await uploadNewBackup()
})()