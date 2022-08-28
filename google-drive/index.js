const { google } = require('googleapis');
const fs = require('fs')
const scopes = [
  'https://www.googleapis.com/auth/drive'
];
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: scopes
});
const drive = google.drive({ version: "v3", auth });

class Google{

    async upload(name){
        const parts = name.split('.')
        const part = parts[parts.length - 1]
        console.log(part)
        const res = await drive.files.create({
            resource: {
              name: name,
              mimeType: 'image/' + part
            },
            media: {
              mimeType: 'image/' + part,
              body: fs.createReadStream('images/' + name)
            },
            fields: 'id'
          })
        console.log(res)
        if(res.status == 200){
          console.log(res.data.id)
          return res.data.id
        } 
    }
    
    async download(id, stream){
    drive.files.get({fileId: id, alt: 'media'}, {responseType: 'stream'},
      function(err, res){
         res.data
         .on('error', err => {
            console.log('Error', err)
         })
         .pipe(stream)
      })
    }

    async delete(id){
        console.log(id)
    drive.files.delete({ fileId: id })
    .then(
      async function (response) {
        return 'ok'
      },
      function (err) {
        console.log(err)
      }
    );
    }
    
}

module.exports = new Google()