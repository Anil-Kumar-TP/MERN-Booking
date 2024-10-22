import express, { Request, Response, Router } from 'express'
import multer from 'multer'
import cloudinary from 'cloudinary'
import Hotel from '../models/hotel.model';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';
import { HotelType } from '../shared/types';

const router: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

//only logged in users can create hotel
router.post('/', verifyToken, [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('City is required'),
    body("country").notEmpty().withMessage('Country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Hotel type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('Price Per Night is required and must be a Number'),
    body("facilities").notEmpty().isArray().withMessage('Facilities are required'),

], upload.array("imageFiles", 6), async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body; // all other fields except images
        const uploadPromises = imageFiles.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url; //get the url from cloudinary
        });
        const imageUrls = await Promise.all(uploadPromises); // wait for all images
        newHotel.imageUrls = imageUrls; //add the image to newHotel
        newHotel.lastUpdated = new Date(); //update the newHotel 
        newHotel.userId = req.userId; // from auth

        const hotel = new Hotel(newHotel);
        await hotel.save();
        res.status(201).send(hotel);
    } catch (error: unknown) {
        console.log('error in creating hotel', error instanceof Error ? error.message : 'Error occured');
        res.status(500).json({ message: 'something went wrong' });
    }
});


router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Hotels" });
    }
});

export default router;
