 import  {v2 as cloudinary } from  coludniary;
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:  process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });
    

    // const uploadResult = await cloudinary.uploader
    // .upload(
    //     'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //         public_id: 'shoes',
    //     }
    // )
    // .catch((error) => {
    //     console.log(error);
    // });
    // console.log(uploadResult);
     const uploadResult= async (localFilePath)=>{
         try {
             if(!localFilePath)
                // CheckCondiction if File is not Exist then return Null
                 return null
                  //Upload File On cloudNiary
                 const responce=    await cloudinary.uploader.upload(localFilePath,{
                    resource_type:"auto"
                  })
                 console.log(" File Has been Uploaded  on cloudNiary SuccesFully" );
                 responce.url();
            
            
         } catch (error) {
            // Remove all Temprary local  saved File
             fs.unlinSync(localFilePath)
              return null
             console.log( error)
            
         }
     }
      export {uploadResult};