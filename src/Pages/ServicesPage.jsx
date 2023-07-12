import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import slide from '../Assets/Sliders/slide.jpg'
import slidee from '../Assets/Sliders/slidee.jpg'
import slideee from '../Assets/Sliders/slideee.jpg'
import ridemathing from '../Assets/Services/ridematching.webp'
import payment from '../Assets/Services/payment.webp'
import chat from '../Assets/Services/chat.png'
import safety from '../Assets/Services/safety.png'
import { useNavigate } from "react-router-dom";
import Services from "../Components/Services";
const ServicesPage = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className=" my-4 container mx-auto flex lg:flex-row flex-col items-center px-4">
                <div className=" lg:w-1/2 lg:order-1 order-2 flex lg:block justify-center flex-col items-center">
                    <h2 className=" lg:text-start text-center text-4xl lg:text-6xl fsM font-bold lg:py-0 pt-2">Services</h2>
                    <p className=" lg:text-start text-center fsM font-bold lg:py-0 pb-2 text-onBackground text-2xl lg:text-4xl">We Offer</p>
                    <p className=" text-justify w-3/4">At SahmRide, we offer a range of services that help you save money, reduce your carbon footprint, and make your daily commute or occasional travel more enjoyable. Our platform connects drivers and passengers who are going the same way, allowing them to share rides and split the costs.</p>
                    <button className=' mt-5 text-sm bg-background text-onBackground border-2 border-onBackground hover:bg-primary hover:text-accent-secondary_hover transition-all duration-300 px-7 py-2 rounded-md' onClick={() => {
                        navigate('/findride')
                    }}>Find Ride</button>
                </div>
                <div className=' lg:order-2 order-1 flex lg:w-1/2 w-full h-1/2 rounded-lg overflow-hidden'>
                    <Swiper
                        loop={true}
                        autoplay={
                            {
                                delay: 2500,
                                disableOnInteraction: false,
                            }
                        }
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{
                            bullets: true,
                        }}
                        modules={[Pagination, Autoplay]}
                    >
                        <SwiperSlide><img src={slide} className=" object-cover w-full h-full" /></SwiperSlide>
                        <SwiperSlide><img src={slidee} className=" object-cover w-full h-full " /></SwiperSlide>
                        <SwiperSlide><img src={slideee} className=" object-cover w-full h-full " /></SwiperSlide>
                    </Swiper>
                </div>
            </div>
            <Services />
            
            <div className=" container mx-auto flex justify-center items-center flex-col py-6 rounded-lg my-4">
                {/* <div className=' bg-onBackground rounded-lg w-full px-2 lg:px-0 flex justify-center items-center flex-col'>
                            <p className=' lg:text-4xl text-3xl mt-4 text-primary fsM'>Ride sharing</p>
                            <p className=' fsM text-background text-center font-light lg:w-3/4 w-full text-sm my-2'>Save money, reduce stress and improve air quality by making a smart commute choice. Rideshare can help you find an alternative to driving alone that fits your lifestyle.Take advantage of our ride sharing system that allows commuters to quickly and securely find a carpool, vanpool, transit, bike or walk option. Commuters are matched based on proximity, destination and travel route, as well as schedules and preferences.</p>                       
                            <p className=' text-justify text-background'></p>                       
                </div> */}
                {/* <div className=' rounded-lg w-full px-2 lg:px-0 flex justify-center items-center flex-col'>
                            <p className=' lg:text-4xl text-3xl mt-4 text-primary fsM'>Ride sharing</p>
                            <p className=' fsM text-onBackground text-center font-light lg:w-3/4 w-full text-sm my-2'>Save money, reduce stress and improve air quality by making a smart commute choice. Rideshare can help you find an alternative to driving alone that fits your lifestyle.Take advantage of our ride sharing system that allows commuters to quickly and securely find a carpool, vanpool, transit, bike or walk option. Commuters are matched based on proximity, destination and travel route, as well as schedules and preferences.</p>                       
                            <p className=' text-justify'>Save money, reduce stress and improve air quality by making a smart commute choice. Rideshare can help you find an alternative to driving alone that fits your lifestyle.Take advantage of our ride sharing system that allows commuters to quickly and securely find a carpool, vanpool, transit, bike or walk option. Commuters are matched based on proximity, destination and travel route, as well as schedules and preferences.</p>                       
                </div> */}
            </div>
        </>
    );
}

export default ServicesPage;