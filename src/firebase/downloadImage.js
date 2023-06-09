import RNFetchBlob from 'rn-fetch-blob';

const downloadImage = (imageURL, imageName) => {
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
        fileCache: true,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path:
                PictureDir +
                '/image_' + imageName,
                description: 'Image',
        },
    };
    config(options)
        .fetch('GET', imageURL)
            .then(res=> {
                console.log("res -> ", JSON.stringify(res));
                alert("Image downloaded successfully");
            });
}


export default downloadImage;