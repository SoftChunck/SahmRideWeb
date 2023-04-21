import LightTextLogo from '../Assets/Logo/LightText.svg'
import DarkTextLogo from '../Assets/Logo/DarkText.svg'
import {MdDarkMode,MdLightMode, MdOutlineLogout} from 'react-icons/md'
import avtar from '../Assets/Avtar/leonardo.jpeg'
import { useContext, useState } from 'react'
import {BiLogOut, BiMenuAltRight} from 'react-icons/bi'
import {User} from '../Objects/User'
import Login from './Login'
import CreateAccount from './CreateAccount'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [user,setUser,selected,setSelected] = useContext(User)
    const [expandMenu,setExpandMenu] = useState(false)
    const [currentScreen,setCurrentScreen] = useState('')
    return ( 
        <div className=''>
            <nav className=" hidden container mx-auto py-3 flex flex-row justify-evenly items-center">
                <img src={LightTextLogo} className=' h-10 w-fit ' />
                <ul className=' gap-x-7 flex justify-evenly items-center ms-auto text-sm'>
                    <li className='group relative'>
                        <a className=' cursor-pointer hover:text-secondary font-light'>Home</a>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>
                    <li className='group relative'>
                        <a className=' cursor-pointer hover:text-secondary font-light'>Services</a>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>
                    <li className='group relative'>
                        <a className=' cursor-pointer hover:text-secondary font-light'>Testimonials</a>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>
                    <li className='group relative'>
                        <a className=' cursor-pointer hover:text-secondary font-light'>About Us</a>
                        <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                    </li>
                </ul>              
                <div className=' flex gap-x-3 ms-7'>
                    <button className=' text-sm bg-background text-onBackground border-2 border-onBackground hover:bg-primary hover:text-accent-secondary_hover transition-all duration-300 px-7 py-2 rounded-md'>Login</button>                
                    <button className=' text-sm bg-onBackground text-background border-2 border-onBackground outline-1 hover:bg-primary hover:text-accent-secondary_hover transition-all duration-300  px-7 py-2 rounded-md'>Register</button>
                </div>
                <div className=' ms-2 bg-onBackground border-2 border-onBackground text-background rounded-lg'>
                    <MdDarkMode className=' m-2' />
                </div> 
                {/* <div className=' bg-background border-2 border-onBackground text-onBackground rounded-lg'>
                    <MdLightMode className=' m-2 ' />
                </div>  */}
            </nav>
            <div className=' hidden mt-2 container mx-auto rounded-xl bg-onBackground text-background lg:flex items-center justify-center py-1'>
                <img src={DarkTextLogo} className=' h-8 mx-2 w-fit ' />
                <ul className=' gap-x-9 mx-auto flex justify-evenly items-center text-sm'>
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
                {
                    user.loggedIn ? 
                    <>
                        <p className=' text-sm fsM  me-3'>{user.firstName + ' ' + user.lastName}</p>
                        <img src={avtar} className=' w-12 h-12 object-cover rounded-full me-3' />                        
                        <div className=' hover:bg-primary cursor-pointer mx-2 bg-bgBackground border-2 border-background text-background rounded-lg'>
                            <MdOutlineLogout className=' text-lg cursor-pointer font-semibold m-2 ' onClick={()=>{
                                localStorage.clear()
                                setUser({
                                    uid:'',
                                    firstName:'',
                                    lastName:'',
                                    gender:'',
                                    isDriver:false,
                                    profileImageUrl:'',
                                    loggedIn:false,
                                })
                            }} />
                        </div>
                    </> :
                    <div className=' flex gap-x-3 ms-7 me-2'>
                        <button onClick={()=>{
                            setCurrentScreen('login')
                        }} className=' text-sm bg-background text-onBackground border-2 border-onBackground hover:bg-primary hover:text-accent-secondary_hover transition-all duration-300 px-7 py-2 rounded-md'>Login</button>                
                        <button onClick={()=>{
                            setCurrentScreen('createAccount')
                        }} className=' text-sm bg-onBackground text-background border-2 border-onBackground outline-1 hover:bg-primary hover:text-accent-secondary_hover transition-all duration-300  px-7 py-2 rounded-md'>Register</button>
                    </div>
                }
                {/* <div className=' hover:bg-primary cursor-pointer mx-2 bg-bgBackground border-2 border-background text-background rounded-lg'>
                    <MdDarkMode className=' m-2' />
                </div>  */}
            </div>
            <div className=' lg:hidden container mx-auto rounded-xl bg-onBackground text-background flex items-center justify-between py-1'>
                <img src={DarkTextLogo} className=' h-8 mx-2 w-fit ' />
                <BiMenuAltRight className=' font-bold' onClick={()=>{
                    setExpandMenu(!expandMenu)
                }} />                
            </div>
            {
                expandMenu ? 
                <div className=' container mx-auto py-3 lg:hidden rounded-xl bg-onBackground text-background flex mt-2 justify-evenly items-center '>
                    <ul className=' gap-y-4 flex flex-col justify-evenly items-center text-sm'>
                        <li className='group relative'>
                            <Link to={'/'} onClick={()=>{setSelected(0)}}  className={` cursor-pointer hover:text-background font-light ' ${selected == 0 ?  ' text-primary text-lg ' : ' text-background '}`}>Home</Link>
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
                            <Link to={'/findride'}  onClick={()=>{setSelected(4)}} className={` cursor-pointer hover:text-background font-light ' ${selected == 4 ?  ' text-primary text-lg ' : ' text-background '}`}>Find Ride</Link>
                            <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                        </li>
                        <li className='group relative'>
                            <a  onClick={()=>{setSelected(3)}} className={` cursor-pointer hover:text-background font-light ' ${selected == 3 ?  ' text-primary text-lg ' : ' text-background '}`}>About Us</a>
                            <div className=' absolute w-0 h-1 rounded-lg transition-all duration-500 group-hover:w-full bg-primary'></div>
                        </li>
                        
                    </ul>
                    {
                        user.loggedIn ? 
                        <div className=' flex flex-col justify-evenly items-center'>
                            <img src={avtar} className=' w-12 h-12 object-cover rounded-full me-3' />
                            <p className=' text-sm fsM  me-3 py-2'>{user.firstName} de caprico</p>
                            <div className=' hover:bg-primary h-fit w-fit cursor-pointer mx-2 bg-bgBackground border-2 border-background text-background rounded-lg'>
                                <MdDarkMode className=' m-2' />
                            </div>
                        </div> :
                        <div className=' flex flex-col justify-evenly items-center'>
                            <button onClick={()=>{
                                setCurrentScreen('login')
                            }} className=' text-sm bg-background text-onBackground border-2 border-onBackground hover:bg-primary hover:text-accent-secondary_hover transition-all duration-300 px-7 py-2 rounded-md'>Login</button>                
                            <button onClick={()=>{
                                setCurrentScreen('createAccount')
                            }} className=' text-sm bg-onBackground text-background border-2 border-onBackground outline-1 hover:bg-primary hover:text-accent-secondary_hover transition-all duration-300  px-7 py-2 rounded-md'>Register</button>
                            <div className=' hover:bg-primary h-fit w-fit cursor-pointer mx-2 bg-bgBackground border-2 border-background text-background rounded-lg'>
                                <MdDarkMode className=' m-2' />
                            </div>
                        </div>
                    }                     
                </div> : <></>
            }
            {
                currentScreen=='login' ? 
                <Login setCurrentScreen={setCurrentScreen} />
                : currentScreen=='createAccount' ?
                <CreateAccount  setCurrentScreen={setCurrentScreen} /> :
                <></>
            }
        </div>
     );
}
 
export default Navbar;