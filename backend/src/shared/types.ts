//shared between backend and frontend. return type of fetchHotels is this type so used in frontend as well
export type HotelType = {
    _id: string;
    userId: string; // user who created the hotel
    name: string; //hotel name
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: Number;
    childCount: Number;
    facilities: string[];
    pricePerNight: Number;
    starRating: Number;
    imageUrls: string[];
    lastUpdated: Date;
}
