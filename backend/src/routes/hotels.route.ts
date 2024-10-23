import express, { Request, Response, Router } from 'express'
import Hotel from '../models/hotel.model';
import { HotelSearchResponse } from '../shared/types';
const router: Router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);
        const pageSize = 5; //hotels in each page
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1"); //page number in frontend
        const skip = (pageNumber - 1) * pageSize; //if page = 3, (3-1) * 5 = 10. skip first 10 and give form 11.
        const hotels = await Hotel.find(query).skip(skip).limit(pageSize);
        const total = await Hotel.countDocuments(query);
        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize)
            },
        };
        res.json(response);
    } catch (error:unknown) {
        console.log('error in search route', error instanceof Error ? error.message : 'Error');
        res.status(500).json({ message: 'Something went wrong' });
    }
})


const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        try {
            constructedQuery.$or = [
                { city: new RegExp(queryParams.destination, "i") },
                { country: new RegExp(queryParams.destination, "i") },
            ];
        } catch (error) {
            console.error('Error constructing search query:', error);
            throw error;
        }
    }

    if (queryParams.adultCount && /^\d+$/.test(queryParams.adultCount)) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    };

   if (queryParams.childCount && /^\d+$/.test(queryParams.childCount)) {
       constructedQuery.childCount = {
           $gte: parseInt(queryParams.childCount),
       };
    };

    return constructedQuery; // Return the constructed query object
};

export default router;