import {FaAngleLeft, FaAngleRight,FaQuoteLeft} from 'react-icons/fa'
import avtar from '../Assets/Avtar/david.jpeg'
import leonardo from '../Assets/Avtar/leonardo.jpeg'
const Testimonials = () => {
    return ( 
        <div className=" container mx-auto flex lg:flex-row flex-col justify-evenly items-center py-6 my-4">            
            <div className=' lg:block flex justify-center items-center flex-col'>
                <p className=" text-lg text-primary fsM font-semibold">...Testimonials</p>
                <p className=" text-onBackground text-4xl fsM font-bold my-2 lg:text-start text-center">Dont Belive Me <br/> Check What Our Users <br /> Think Of Us</p>
                <div className=' my-3 lg:block hidden'>
                    <button className=" rounded-full p-2 bg-primary text-background">
                        <FaAngleLeft />
                    </button>
                    <button className=" ms-3 rounded-full p-3 bg-primary text-background">
                        <FaAngleRight />
                    </button>
                </div>
            </div>
            <div className=' relative shadow-2xl lg:w-1/4 w-full p-4 justify-center flex items-center flex-col mt-16'>
                <img src={avtar} className=' rounded-full object-cover w-28 h-28 absolute top-0 -translate-y-1/2' />
                <FaQuoteLeft  className='mt-16 mb-2 text-primary text-2xl'/>
                <p className=' font-semibold fsM text-lg '>David Laid</p>
                <p className=' text-sm text-justify text-opacity-70 '>I've been using SahmRide for a few months now, and it's been a game-changer for my daily commute. I used to spend hours in traffic every day, but now I can carpool with other parents and get to work in a fraction of the time. The messaging platform is really convenient, and I love that I can split the cost of gas with my carpool partners. Highly recommend!</p>
            </div>
            <div className=' relative shadow-2xl lg:w-1/4 w-full p-4 justify-center flex items-center flex-col mt-16'>
                <img src={leonardo} className=' h-28 object-cover rounded-full w-28 absolute top-0  -translate-y-1/2' />
                <FaQuoteLeft  className='mt-16 mb-2 text-primary text-2xl'/>
                <p className='font-semibold fsM text-lg'>Leonardo de Caprico</p>
                <p className=' text-sm text-justify text-opacity-70 '>I've been using SahmRide for a few months now, and it's been a game-changer for my daily commute. I used to spend hours in traffic every day, but now I can carpool with other parents and get to work in a fraction of the time. The messaging platform is really convenient, and I love that I can split the cost of gas with my carpool partners. Highly recommend!</p>
            </div>
            <div className=' my-3 lg:hidden block'>
                    <button className=" rounded-full p-2 bg-primary text-background">
                        <FaAngleLeft />
                    </button>
                    <button className=" ms-3 rounded-full p-3 bg-primary text-background">
                        <FaAngleRight />
                    </button>
            </div>

            
        </div>
     );
}
 
export default Testimonials;