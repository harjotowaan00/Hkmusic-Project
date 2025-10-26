import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier';
import albumModel from '../models/albumModel.js'

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body;

        let imageUpload = await new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        const album = new albumModel({
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        });

        await album.save();
        res.json({ success: true, message: "Album added" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const listAlbum = async (req, res) => {

    try {
        const allAlbum = await albumModel.find({});
        res.json({ success: true, albums: allAlbum });
    } catch (error) {
        res.json({ success: false });
    }
}

const removeAlbum = async (req, res) => {

    try {

        await albumModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Album removed" });
    } catch (error) {
        res.json({ success: false });
    }
}

export { addAlbum, listAlbum, removeAlbum }