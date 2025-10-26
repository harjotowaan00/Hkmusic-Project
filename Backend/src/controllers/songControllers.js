import { v2 as cloudinary } from 'cloudinary'
import streamifier from "streamifier";
import songModel from '../models/songModel.js';

const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;

        const imageFile = req.files.image[0].buffer;
        const audioFile = req.files.audio[0].buffer;

        // Upload IMAGE
        const uploadImage = () => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(imageFile).pipe(stream);
            });
        };

        // Upload AUDIO
        const uploadAudio = () => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { resource_type: "video" }, // audio treated as video
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(audioFile).pipe(stream);
            });
        };

        const imageUpload = await uploadImage();
        const audioUpload = await uploadAudio();

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const songData = { 
            name, 
            desc, 
            album, 
            image: imageUpload.secure_url, 
            file: audioUpload.secure_url, 
            duration 
        };

        const song = new songModel(songData);
        await song.save();

        res.json({ success: true, message: "Song Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
};


const listSong = async (req, res) => {
    try {
        
        const allSongs = await songModel.find({});
        res.json({success:true,songs: allSongs});
    } catch (error) {
        res.json({success: false});
    }

}

const removeSong = async (req,res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success: true,message: "Song Removed"});
    } catch (error) {
        res.json({success: false});
    }
}

export { addSong, listSong, removeSong}