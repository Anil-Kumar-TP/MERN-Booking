import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: Number;
    childCount: Number;
    hotelId: string;
    saveSearchValues: (destination: string, checkIn: Date, checkOut: Date, adultCount: Number, childCount: Number) => void;
}

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
    children: React.ReactNode;
}

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    
    const [destination, setDestination] = useState<string>("");
    const [checkIn, setCheckIn] = useState<Date>(new Date());
    const [checkOut, setCheckOut] = useState<Date>(new Date());
    const [adultCount, setAdultCount] = useState<Number>(1);
    const [childCount, setChildCount] = useState<Number>(0);
    const [hotelId, setHotelId] = useState<string>("");

    const saveSearchValues = (destination: string, checkIn: Date, checkOut: Date, adultCount: Number, childCount: Number, hotelId?: string) => {
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setAdultCount(adultCount);
        setChildCount(childCount);
        if (hotelId) {
            setHotelId(hotelId);
        }
    }

    return (
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            hotelId,
            saveSearchValues,
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
}