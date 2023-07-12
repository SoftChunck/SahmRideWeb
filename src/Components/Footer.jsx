import { BsFacebook, BsGithub, BsInstagram } from 'react-icons/bs';
import { useContext, useState } from 'react'
import {User} from '../Objects/User'
import DarkLogo from '../Assets/Logo/DarkLogo.png'
import { Link } from 'react-router-dom';
const Footer = () => {
    const [user,setUser,selected,setSelected] = useContext(User)
    return ( 
        <div>
            <div className=" lg:mb-2 container mx-auto bg-onBackground p-4 lg:rounded-lg flex lg:flex-row flex-col justify-between">
                <div className=' p-3 lg:w-2/5 w-full flex items-center justify-center order-1'>
                    <img src={DarkLogo} className=' h-28 object-cover aspect-auto' />
                </div>
                <ul className=' order-2 flex flex-col text-sm lg:m-0 my-2 lg:justify-evenly justify-center lg:items-start items-center lg:w-fit w-full'>
                <li className='group relative'>
                        <Link to={'/'} onClick={()=>{setSelected(0)}} className={` cursor-pointer hover:text-background font-light ' ${selected == 0 ?  ' text-primary text-lg ' : ' text-background '}`}>Home</Link>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>
                    <li className='group relative'>
                        <Link to={'/services'}  onClick={()=>{setSelected(1)}} className={` cursor-pointer hover:text-background font-light ' ${selected == 1 ?  ' text-primary text-lg ' : ' text-background '}`}>Services</Link>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>
                    {/* <li className='group relative'>
                        <a  onClick={()=>{setSelected(2)}} className={` cursor-pointer hover:text-background font-light ' ${selected == 2 ?  ' text-primary text-lg ' : ' text-background '}`}>Testimonials</a>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li> */}
                    <li className='group relative'>
                        <Link  onClick={()=>{setSelected(4)}} to={'/findride'} className={` cursor-pointer hover:text-background font-light ' ${selected == 4 ?  ' text-primary text-lg ' : ' text-background '}`}>Find Ride</Link>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>
                    <li className='group relative'>
                        <a  onClick={()=>{setSelected(3)}} className={` cursor-pointer hover:text-background font-light ' ${selected == 3 ?  ' text-primary text-lg ' : ' text-background '}`}>About Us</a>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>          
                </ul> 
                <div className=' lg:order-3 order-4'>
                    <p className=' text-background lg:text-start text-center fsM font-semibold text-sm my-4'>Product Texas, 234 Bokki Avenue <br/> Street BMW 99388</p>
                    <p className=' text-background lg:text-start text-center italic fsM text-sm mt-3'>info@producttexas.project <br /> 1-232-7788 (Main)</p>
                </div>
                <div className=' flex flex-col items-center lg:order-4 order-3'>
                    <p className=' fsM text-lg text-primary'>Social Media</p>
                    <div className=' flex gap-x-3 my-4'>
                        <div className=' hover:bg-primary hover:text-background p-3 rounded-full bg-background text-onBackground'>
                            <BsGithub />
                        </div>
                        <div className=' hover:bg-primary hover:text-background p-3 rounded-full bg-background text-onBackground'>
                            <BsFacebook />
                        </div>
                        <div className=' hover:bg-primary hover:text-background p-3 rounded-full bg-background text-onBackground'>
                            <BsInstagram />
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Footer;