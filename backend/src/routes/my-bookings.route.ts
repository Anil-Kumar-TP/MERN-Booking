import express,{  Request, Response, Router } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel.model";
import { HotelType } from "../shared/types";
const router: Router = express.Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: { $elemMatch: { userId: req.userId } }, //return the hotels that has a booking that contain userId
        });
        const results = hotels.map((hotel) => { //of all the bookings,we need only the booking of logged in user.
            const userBookings = hotel.bookings.filter((booking) => booking.userId === req.userId);

            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            };

            return hotelWithUserBookings;
        });

        res.status(200).send(results);
    } catch (error: unknown) {
        console.log('error in my-bookings', error instanceof Error ? error.message : 'Error');
        res.status(500).json({ message: 'Unable to fetch bookings' });
    }
});

export default router;