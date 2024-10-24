import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from '../api-client'
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";

const Search = () => {

    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities:selectedFacilities,
    };


    const { data: hotelData } = useQuery(["searchHotels", searchParams], () => {
        const response = apiClient.searchHotels(searchParams);
        return response;
    });

    const handleStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = e.target.value;
        setSelectedStars((prevStars) => e.target.checked ? [...prevStars, starRating] : prevStars.filter((star) => star !== starRating)); //adding or removing stars
    }

    const handleHotelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = e.target.value;
        setSelectedHotelTypes((prevHotelTypes) => e.target.checked ? [...prevHotelTypes, hotelType] : prevHotelTypes.filter((type) => type !== hotelType)); //adding or removing stars
    }

    const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const facility = e.target.value;
        setSelectedFacilities((prevFacilities) => e.target.checked ? [...prevFacilities, facility] : prevFacilities.filter((type) => type !== facility)); //adding or removing stars
    }

    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">Filter by:</h3>
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange} />
                    <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange} />
                    <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleFacilityChange}/>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">{hotelData?.pagination.total} Hotels found{" "}
                        {search.destination ? `in ${search.destination}` : ""}
                    </span>
                    {/* {SORT OPTIONS} */}
                </div>
                {hotelData?.data.map((hotel) => (
                    <SearchResultsCard hotel={hotel} />
                ))}
                <div>
                    <Pagination page={hotelData?.pagination.page || 1} pages={hotelData?.pagination.pages || 1} onPageChange={(page)=>setPage(page)}/>
                </div>
            </div>
        </div>
    )
}

export default Search;