"use client"
import Lookup from '@/data/Lookup';
import React from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useContext } from 'react';
import Colors from '@/data/Colors';
import PricingModel from '@/components/custom/PricingModel';

function Pricing() {

    const { userDetail, setUserDetail} = useContext(UserDetailContext);

  return (
    <div className="mt-2 flex flex-col items-center w-full p-10 md:px-32 lg:px-48">
      <h2 className="font-bold text-4xl text-center mb-4">Pricing</h2>
      <p className=" text-gray-400 max-w-xl text-center mt-4">
            {Lookup.PRICING_DESC}
      </p>
      
      <div className='p-5 border rounded-xl w-full flex justify-between mt-7 items-center' style={{
        backgroundColor:Colors.BACKGROUND
      }}>
        <h2 className='text-lg text-center'><span className='font-bold'>{userDetail?.token}</span> Token Left</h2>
        <div className='text-center'>
            <h2 className='font-medium'>Need more token?</h2>
            <p>Upgrade your plan below</p>
        </div>
      </div>
      <PricingModel/>
    </div>
  );
}

export default Pricing;
