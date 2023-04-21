import { useEffect, useState } from 'react';
import { BsGenderFemale, BsGenderMale, BsGenderTrans, BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import car0 from '../Assets/Cars/car0.png'
import requestPending from '../Assets/success.gif'
import { ColorRing } from 'react-loader-spinner';

import { realtime} from '../firebase'
import { get,ref } from 'firebase/database';

const AvalibleDriver = ({
    driverDetails,sendRequest,request,cancelRequest
}) => {
    const [dhover,setdhover] = useState(false)
    return ( 
        <div className={' relative lg:w-1/4 md:w-1/3 w-full flex justify-center flex-col '}
            onMouseOver={
                ()=>{
                    setdhover(true)
                }
            }
            onMouseLeave = {
                ()=>{
                    setdhover(false)
                }
            }
        >
            <div className=' relative'>
                    <img src={ driverDetails.carType==4 ? car0 : car0 } className=" aspect-square" />
                    <div className=' flex justify-evenly items-end'>
                        <div>
                            <p className=' font-semibold text-lg '>{`${driverDetails.firstName} ${driverDetails.lastName}`}</p>
                            <div className=' flex'>
                                { driverDetails.rating < 0.5 ? <BsStar /> : driverDetails.rating < 1 ? <BsStarHalf /> : <BsStarFill /> }
                                { driverDetails.rating < 1.5 ? <BsStar /> : driverDetails.rating < 2 ? <BsStarHalf /> : <BsStarFill /> }
                                { driverDetails.rating < 2.5 ? <BsStar /> : driverDetails.rating < 3 ? <BsStarHalf /> : <BsStarFill /> }
                                { driverDetails.rating < 3.5 ? <BsStar /> : driverDetails.rating < 4 ? <BsStarHalf /> : <BsStarFill /> }
                                { driverDetails.rating < 4.5 ? <BsStar /> : driverDetails.rating < 5 ? <BsStarHalf /> : <BsStarFill /> }                        
                            </div>
                            {
                                driverDetails.gender == 'Male' ?
                                <div className=' flex items-center '>                        
                                    <BsGenderMale className=' font-semibold mr-2' /> 
                                    <p className=' font-semibold'>Male</p>
                                </div> :
                                driverDetails.gender == 'Female' ?
                                <div className=' flex items-center '>                        
                                    <BsGenderFemale className=' font-semibold mr-2' /> 
                                    <p className=' font-semibold'>Female</p>
                                </div> : 
                                <div className=' flex items-center '>                        
                                    <BsGenderTrans className=' font-semibold mr-2' /> 
                                    <p className=' font-semibold'>Transgender</p>
                                </div>                       
                            }
                            
                        </div>
                        <div className=' flex justify-end '>
                            <p className=' text-2xl font-semibold drop-shadow-sm'>{`${(driverDetails.route.duration/3600)|0}hr ${((driverDetails.route.duration%3600)/60)|0}min`}</p>
                        </div>
                    </div>
                    {
                        request == 'pending' ? 
                        <div className=' absolute top-0 left-0 w-full bg-black bg-opacity-70 h-full flex flex-col justify-center items-center'>
                            {/* <img src={requestPending} className=' w-1/2 aspect-auto h-min' /> */}
                            <ColorRing
                                visible={true}
                                height="140"
                                width="140"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                            />
                            <button className=' bg-yellow text-white p-2 my-2 rounded-md ' onClick={()=>{cancelRequest()}}>Cancel Request</button>
                        </div> : <></>
                    }
            </div>    
            {
                (dhover && request !='pending') ? 
                    <div className=' flex flex-col justify-center items-center absolute w-full h-full bg-black bg-opacity-70'>
                        <div className=' flex flex-row justify-evenly text-white w-full mb-4 items-center'>
                            <div className={" w-5 h-min aspect-square bg-blue"}></div>
                            <p>Male</p>
                            <div className={" w-5 h-min aspect-square bg-yellow"}></div>
                            <p>Female</p>
                            <div className={"w-5 h-min aspect-square bg-white"}></div>
                            <p>Avalible Seats</p>
                        </div>
                        <div className=' w-1/2 aspect-square flex-wrap flex gap-2 bg- justify-evenly outline items-center outline-white'>
                            {
                                driverDetails.seatsDetail.map((value)=>{
                                    return(
                                        <div className={value==="Male" ? " w-1/3 h-min aspect-square bg-blue" : value === "Female" ? " w-1/3 h-min aspect-square bg-yellow" : " w-1/3 h-min aspect-square bg-white" }></div>
                                    )
                                })
                            }                          
                        </div>
                        <button className=' w-2/3 shadow-md text-sm antialiased p-2 bg-yellow hover:bg-white text-black my-2' onClick={
                            ()=>{
                                sendRequest(driverDetails)
                            }
                        }>Send Request</button>
                        {/* <button className=' w-2/3 shadow-sm text-sm antialiased p-2 bg-yellow hover:bg-white text-black my-2'>View Profile</button> */}
                    </div> :
                    <></>
            }
        </div>
     );
}
 
export default AvalibleDriver;