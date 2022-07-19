import 'dotenv/config';

import { createReadStream } from 'fs';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import inquirer from "inquirer";
import path from 'path';
import axios from "axios";

const GOOGLE_FOLDER_ID = process.env.GOOGLE_FOLDER_ID;
const TINY_URL_API_TOKEN = process.env.TINY_URL_API_TOKEN;
const CREDENTIAL_FOR_SERVICE_ACCOUNT = process.env.CREDENTIAL_FOR_SERVICE_ACCOUNT;

const auth = new GoogleAuth({
  keyFile: CREDENTIAL_FOR_SERVICE_ACCOUNT,
  scopes: 'https://www.googleapis.com/auth/drive'
});

const service = google.drive({ version: 'v3', auth });

async function uploadBasic(photoName, filePath) {
  try {
    const fileMetaData = {
      'name': photoName,
      'parents': [GOOGLE_FOLDER_ID]
    };

    const media = {
      mimeType: 'image/jpeg',
      body: createReadStream(filePath),
    };

    const response = await service.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id',
    });

    console.log('Upload successful');
    return response.data.id;

  } catch (err) {}
}

async function main() {
  try {
    let userPhoto = {
      type: 'input',
      name: 'photoLink',
      message: 'Drag and drop your image here, please. Press \'ENTER\' to upload: ',
    }
    const photoPath = await inquirer.prompt(userPhoto);
    const photoName = path.basename(photoPath.photoLink);
    const photoExtension = path.extname(photoPath.photoLink);

    console.log(`Path to file: ${photoPath.photoLink}\nFile name: ${photoName}\nFile extension: ${photoExtension.slice(1, photoExtension.length)}`)

    let ChangePhotoName = {
      type: 'confirm',
      name: 'isChangePhoto',
      message: `Your\'s photo name is \'${photoName}. Would you like to change it?: `,
    }
    const isChangePhotoName = await inquirer.prompt(ChangePhotoName);

    let fileId;
    if (isChangePhotoName.isChangePhoto) {
      let PhotoName = {
        type: 'input',
        name: 'newPhotoName',
        message: `Enter your new photo name (Without file extension like \'.jpg, .png. .etc\') `,
      }
      const newPhotoName = await inquirer.prompt(PhotoName);
      const fullNewPhotoName = `${newPhotoName.newPhotoName}${photoExtension}`;

      console.log(`Your new photo name: ${fullNewPhotoName}`);

      fileId = await uploadBasic(fullNewPhotoName, photoPath.photoLink); //Выгружаю фото и получаю айди этого файла

    } else {
      fileId = await uploadBasic(photoName, photoPath.photoLink); //Выгружаю фото и получаю айди этого файла
    }

    const fileUrl = await service.files.get({
      fileId,
    });

    const fileIdFromUrl = path.basename(fileUrl.config.url);

    const photoUrl = `https://drive.google.com/file/d/${fileIdFromUrl}/view`;

    const makeTinyUrl = {
      type: 'confirm',
      name: 'tinyUrl',
      message: `Would you like to get shorten your link?: `,
    }

    const isMakeTinyUrl = await inquirer.prompt(makeTinyUrl);

    if (isMakeTinyUrl.tinyUrl) {
      const responseTinyUrl = await axios.post('https://api.tinyurl.com/create',
        {
          url: photoUrl
        },
        {
          headers: { Authorization: `Bearer ${TINY_URL_API_TOKEN}` }
        })

      console.log(`Your shorten photo url is '${responseTinyUrl.data.data.tiny_url}'`);
    } else {
      console.log(`Your photo url is '${photoUrl}'`);
    }
  }catch(err){
    console.log('Something went wrong. Please, try again...')
  }
}
main();