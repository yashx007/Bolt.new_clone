"use client"
import Lookup from '@/data/Lookup';
import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useContext } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function PricingModel() {

  const { userDetail, setUserDetail} = useContext(UserDetailContext);

  const [selectedOption,setSelectedOption]=useState()


  const UpdateToken = useMutation(api.users.UpdateToken)


  // Handle successful payment
  const onPaymentSuccess = async() => {
     const token = userDetail?.token+Number(selectedOption?.value)
     console.log(token)
     await UpdateToken({
      token:token,
      userId:userDetail?._id
     })
  };

  // Handle payment creation
  const createOrder = (data, actions, pricing) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: pricing.price,
            currency_code: 'USD',
          },
        },
      ],
    });
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div key={index} className="border p-7 rounded-xl flex flex-col gap-3" >
          <h2 className="font-bold text-2xl">{pricing.name}</h2>
          <h2 className="font-medium text-lg">{pricing.tokens} Tokens</h2>
          <p className="text-gray-400">{pricing.desc}</p>

          <h2 className="font-bold text-4xl text-center mt-6">{pricing.price}</h2>

          <PayPalButtons
            disabled={!userDetail}
            onClick={()=>{setSelectedOption(pricing);console.log(pricing.value)}}
            style={{
              layout: 'horizontal',
            }}
            createOrder={(data, actions) => createOrder(data, actions, pricing)}
            onApprove={() => onPaymentSuccess()}
            onCancel={() => console.log('Payment Cancelled')}
            onError={(err) => console.error('Payment Error:', err)}
          />
        </div>
      ))}
    </div>
  );
}

export default PricingModel;
