import feature1_bg from '../Assets/Services/feature1_bg.png'
import feature2_bg from '../Assets/Services/feature2_bg.png'
import feature3_bg from '../Assets/Services/feature3_bg.png'
import feature4_bg from '../Assets/Services/feature4_bg.png'
import ridemathing from '../Assets/Services/ridematching.webp'
import payment from '../Assets/Services/payment.webp'
import chat from '../Assets/Services/chat.png'
import safety from '../Assets/Services/safety.png'

import { BsArrowRight } from 'react-icons/bs'
const Services = () => {
    return (
        <div className="">
            <div className=" container mx-auto flex justify-center items-center flex-col py-6 bg-onBackground lg:rounded-lg my-4">
                <p className=" lg:text-4xl text-3xl mt-4 text-primary fsM">Some services we offer</p>
                <p className=" fsM text-background text-center font-light lg:w-2/5 w-full text-sm my-2">With our app you can view the route of your order, from our local headquarters to the place where you are. Look for the app now!</p>
                <div className=' mt-9 text-background flex lg:flex-row flex-col items-center justify-center  lg:w-4/5 w-full'>
                    <img src={ridemathing} className=' lg:w-1/4 w-3/4' />
                    <div className=' lg:w-1/2 w-full px-2 lg:px-0'>
                        <p className=' text-primary text-xl fsM'>Ride sharing</p>
                        <p className=' text-justify italic'>Save money, reduce stress and improve air quality by making a smart commute choice. Rideshare can help you find an alternative to driving alone that fits your lifestyle.Take advantage of our ride sharing system that allows commuters to quickly and securely find a carpool, vanpool, transit, bike or walk option. Commuters are matched based on proximity, destination and travel route, as well as schedules and preferences.</p>                        
                        <p className=' text-primary'>Learn more ...</p>
                    </div>
                    <div className=' w-1/4'></div>
                </div>
                <div className=' text-background flex items-center justify-center lg:flex-row flex-col  lg:w-4/5 w-full'>                    
                    <div className=' lg:order-1 order-3 w-1/4'></div>
                    <div className=' lg:w-1/2 w-full px-2 lg:px-0 order-2'>
                        <p className=' text-primary text-xl fsM'>Payment Processing</p>
                        <p className=' italic text-justify'>The website could facilitate payments between carpoolers to help cover the cost of gas and other expenses. This could include features such as automatic payment processing, split payments, and the ability to track expenses and receipts.</p>    
                        <p className=' text-primary'>Learn more ...</p>
                    </div>
                    <img src={payment} className=' lg:order-3 order-1 lg:w-1/4 w-3/4' />
                </div>
                <div className=' text-background flex items-center justify-center  lg:flex-row flex-col  lg:w-4/5 w-full'>
                    <img src={chat} className=' lg:w-1/4 w-3/4' />
                    <div className=' lg:w-1/2 w-full px-2 lg:px-0'>
                        <p className=' text-primary text-xl fsM'>Messaging & Communication</p>
                        <p className=' italic text-justify'>This service provide a messaging platform that allows users to communicate with each other and make arrangements for carpooling.</p>                        
                        <p className=' text-primary'>Learn more ...</p>
                    </div>
                    <div className=' w-1/4'></div>
                </div>
                <div className=' text-background flex items-center justify-center  lg:flex-row flex-col  lg:w-4/5 w-fullw-4/5'>                    
                    <div className='lg:order-1 order-3 w-1/4'></div>
                    <div className=' order-2 lg:w-1/2 w-full px-2 lg:px-0'>
                        <p className=' text-primary text-xl fsM'>Safety & Security</p>
                        <p className='italic text-justify'>Safety and security features to help ensure that users feel safe and comfortable when carpooling...</p>    
                        <p className=' text-primary'>Learn more ...</p>
                    </div>
                    <img src={safety} className='lg:order-3 order-1 lg:w-1/4 w-3/4' />
                </div>
               
                {/* <div className='grid grid-cols-1 gap-[50px] xl:grid-cols-2'>
                    <div className='w-full max-w-[530px] h-[358px] relative flex flex-col items-center justify-center xl:flex-row xl:justify-start mx-auto'>
                        <div className='hidden xl:flex absolute top-0 right-0'>
                            <img src={feature1_bg} className=' blur-[1px]' />
                        </div>
                        <div className='max-w-[170px] xl:mr-7 xl:max-w-[232px]'>
                            <img src={ridemathing} />
                        </div>
                        <div className='max-w-[220px]'>
                            <h3 className='h3 my-2 fsM font-semibold'>Ride sharing</h3>
                            <p className='font-light italic mb-4 text-background'>Ride sharing service that helps users find potential carpool partners based on their location and schedule</p>

                            <div className='flex items-center gap-x-2 group'>
                                <a className='text-primary font-bold' href='#'>
                                    Learn more ...
                                </a>
                                <BsArrowRight className='text-xl text-accent-primary group-hover:ml-[5px] transition-all' />
                            </div>
                        </div>
                    </div>
                    <div className='w-full max-w-[530px] h-[358px] relative flex flex-col items-center justify-center xl:flex-row xl:justify-start mx-auto'>
                        <div className='hidden xl:flex absolute top-0 right-0'>
                            <img src={feature4_bg} className=' blur-[1px]' />
                        </div>
                        <div className='max-w-[170px] xl:mr-7 xl:max-w-[232px]'>
                            <img src={chat} />
                        </div>
                        <div className='max-w-[220px]'>
                            <h3 className='h3 my-2 fsM font-semibold'>Messaging & Communication</h3>
                            <p className='font-light italic mb-4 text-background'>This service provide a messaging platform that allows users to communicate with each other and make arrangements for carpooling.</p>

                            <div className='flex items-center gap-x-2 group'>
                                <a className='text-primary font-bold' href='#'>
                                    Learn more ...
                                </a>
                                <BsArrowRight className='text-xl text-accent-primary group-hover:ml-[5px] transition-all' />
                            </div>
                        </div>
                    </div>
                    <div className='w-full max-w-[530px] h-[358px] relative flex flex-col items-center justify-center xl:flex-row xl:justify-start mx-auto'>
                        <div className='hidden xl:flex absolute top-0 right-0'>
                            <img src={feature2_bg} className=' blur-[1px]' />
                        </div>
                        <div className='max-w-[170px] xl:mr-7 xl:max-w-[232px]'>
                            <img src={payment} />
                        </div>
                        <div className='max-w-[220px]'>
                            <h3 className='h3 my-2 fsM font-semibold'>Payment Processing</h3>
                            <p className='font-light italic mb-4 text-background'>The website could facilitate payments between carpoolers to help cover the cost of gas and other expenses. This could include features such as automatic payment processing, split payments, and the ability to track expenses and receipts.</p>

                            <div className='flex items-center gap-x-2 group'>
                                <a className='text-primary font-bold' href='#'>
                                    Learn more ...
                                </a>
                                <BsArrowRight className='text-xl text-accent-primary group-hover:ml-[5px] transition-all' />
                            </div>
                        </div>
                    </div>
                    <div className='w-full max-w-[530px] h-[358px] relative flex flex-col items-center justify-center xl:flex-row xl:justify-start mx-auto'>
                        <div className='hidden xl:flex absolute top-0 right-0'>
                            <img src={feature3_bg} className=' blur-[1px]' />
                        </div>
                        <div className='max-w-[170px] xl:mr-7 xl:max-w-[232px]'>
                            <img src={safety} />
                        </div>
                        <div className='max-w-[220px]'>
                            <h3 className='h3 my-2 fsM font-semibold'>Safety & Security</h3>
                            <p className='font-light italic mb-4 text-background'>Safety and security features to help ensure that users feel safe and comfortable when carpooling...</p>

                            <div className='flex items-center gap-x-2 group'>
                                <a className='text-primary font-bold' href='#'>
                                    Learn more ...
                                </a>
                                <BsArrowRight className='text-xl text-accent-primary group-hover:ml-[5px] transition-all' />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default Services;