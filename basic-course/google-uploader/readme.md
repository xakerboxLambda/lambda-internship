# Google Uploader

You can upload your photo to your google drive folder from console

# Order of execution

1. Copy code to your's dev environment
2. To install all packeges run `npm i`
3. Create a Google Cloud project on\
https://developers.google.com/workspace/guides/create-project
4. Enable Google Workspace APIs on\
https://developers.google.com/workspace/guides/enable-apis\
You need "**Google Drive API**"
5. Create a service account on\
https://developers.google.com/workspace/guides/create-credentials#create_a_service_account
6. Create credentials for a service account on\
https://developers.google.com/workspace/guides/create-credentials#create_credentials_for_a_service_account\
Download it

7. Put your credentials for a service account to the same folder as the project
8. In your `.env` enter your **Google folder id**, **TinyUrl api token**, **Path to your credentials for a service account (./credential-name.json)**
9. Open access to your google folder for everyone who has link\
Add access to folder from credentials for a service account email\
Service Account mail you can get at your json file\
**"client_email": "<YOUR_EMAIL>",**
10. Start your file with\
`npm run start`

#
> **Google folder id** you can get on you google drive folder

1. Open https://drive.google.com/
2. Create new folder
3. Open it
4. https:/drive.google.com/drive/folders/<YOUR_FOLDER_ID>

#
> **TinyUrl api Token** you can get on https://tinyurl.com/

1. Open https://tinyurl.com/
2. Create account
3. Open settings -> api
4. Create your api token
