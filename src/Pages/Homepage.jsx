import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import slide from '../Assets/Sliders/slide.jpg'
import slidee from '../Assets/Sliders/slidee.jpg'
import slideee from '../Assets/Sliders/slideee.jpg'
import Services from "../Components/Services";
import Testimonials from "../Components/Testimonials";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className=" mt-4 container mx-auto flex lg:flex-row flex-col items-center px-4">
                <div className=" lg:w-1/2 lg:order-1 order-2 flex lg:block justify-center flex-col items-center">
                    <h2 className=" lg:text-start text-center text-4xl lg:text-6xl fsM font-bold lg:py-0 py-3">Share Ride Save <span className=" text-onBackground">Environment</span></h2>
                    <p className=" text-justify w-3/4">Welcome to Sahmride, the smarter and more convenient way to get around. Whether you're commuting to work, heading to the airport, or simply running errands, our platform makes it easy to find reliable transportation that fits your needs and budget</p>
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
            <Testimonials />
        </>
    );
}

export default Homepage;