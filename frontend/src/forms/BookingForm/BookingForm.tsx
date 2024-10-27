import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from '../../api-client'
import { useAppContext } from "../../contexts/AppContext";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
}

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    totalCost: number;
    paymentIntentId: string; //to check if it is valid before booking.
 }

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    
    const stripe = useStripe();
    const elements = useElements();
    const search = useSearchContext();
    const { hotelId } = useParams();
    const { showToast } = useAppContext();

    const { register, handleSubmit } = useForm<BookingFormData>({ // even though we only need to enter only credit card
        defaultValues: {                            //details, hooking it to form makes it easier to send it to BE.
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            totalCost: paymentIntent.totalCost,
            paymentIntentId: paymentIntent.paymentIntentId,
        }
    });

    const { mutate: bookRoom, isLoading } = useMutation(apiClient.createBooking, {
        onSuccess: () => {
            showToast({ message: 'Booking Saved', type: 'SUCCESS' });
        },

        onError: () => {
            showToast({ message: 'Error saving booking', type: 'ERROR' });
        },
    });

    const onSubmit = async (formData: BookingFormData) => {

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement,
            },
        });

        console.log("Payment confirmation result:", result); // Check result status
        if (result.paymentIntent?.status === 'succeeded') {
            bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
        } else {
            console.log("Payment failed or not confirmed:", result.paymentIntent?.status);
        };

    };

    return (
        <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5" onSubmit={handleSubmit(onSubmit)}>
            <span className="text-3xl font-bold">Confirm Your Details</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input type="text" readOnly disabled className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" {...register("firstName")} />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input type="text" readOnly disabled className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" {...register("lastName")} />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type="email" readOnly disabled className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" {...register("email")} />
                </label>
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Your Price Summary</h2>
                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: ${paymentIntent.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">Includes taxes and charges</div>
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Payment Details</h3>
                <CardElement id="payment-element" className="border rounded-md p-2 text-sm" />
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500">{isLoading ? 'Saving' : 'Confirm Booking'}</button>
            </div>
        </form>
    );
};

export default BookingForm;