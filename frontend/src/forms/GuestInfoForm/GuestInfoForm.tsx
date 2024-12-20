import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";


type Props = {
    hotelId: string;
    pricePerNight: number;
}

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
}

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {

    const search = useSearchContext();
    const { isloggedIn } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm<GuestInfoFormData>({
        defaultValues: {
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            childCount: search.childCount,
        },
    });

    const checkIn = watch('checkIn'); //anytime user changes these it gets picked up and get updated
    const checkOut = watch('checkOut');

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    //when users are not signed in
    const onSignInClick = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
        navigate('/sign-in', { state: { from: location } });
    };

    //when they are signed in
    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
        navigate(`/hotel/${hotelId}/booking`);
    };

    return (
        <div className="flex flex-col p-4 bg-blue-200 gap-4">
            <h3 className="text-md font-bold">${pricePerNight}</h3>
            <form onSubmit={isloggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)}>
                <div className="grid grid-cols-1 gap-4 items-center">
                    <div>
                        <DatePicker required selected={checkIn} onChange={(date) => setValue("checkIn", date as Date)} selectsStart startDate={checkIn} endDate={checkOut} minDate={minDate} maxDate={maxDate} dateFormat="dd/MM/yyyy" placeholderText="Check-in Date" className="min-w-full bg-white p-2 focus:outline-none" wrapperClassName="min-w-full" />
                    </div>
                    <div>
                        <DatePicker required selected={checkOut} onChange={(date) => setValue("checkOut", date as Date)} selectsStart startDate={checkIn} endDate={checkOut} minDate={minDate} maxDate={maxDate} dateFormat="dd/MM/yyyy" placeholderText="Check-Out Date" className="min-w-full bg-white p-2 focus:outline-none" wrapperClassName="min-w-full" />
                    </div>
                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Adults:
                            <input type="number" min={1} max={20} className="w-full p-1 focus:outline-none font-bold" {...register("adultCount", {
                                required: 'This field is required', min: {
                                    value: 1,
                                    message: 'There must be atleat one adult',
                                },
                                valueAsNumber: true,
                            })} />
                        </label>
                        <label className="items-center flex">
                            Children:
                            <input type="number" min={0} max={20} className="w-full p-1 focus:outline-none font-bold" {...register("childCount", {
                                valueAsNumber: true,
                            })} />
                        </label>
                        {errors.adultCount && (
                            <span className="text-red-500 font-semibold text-sm">{errors.adultCount.message}</span>
                        )}
                    </div>
                    {isloggedIn ? (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">Book Now</button>
                    ) : (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">Sign In to Book</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default GuestInfoForm;