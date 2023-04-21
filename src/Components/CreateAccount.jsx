import {AiOutlineClose, AiOutlineDown} from 'react-icons/ai'
import { useState } from 'react';

import {  createUserWithEmailAndPassword,sendEmailVerification,User } from 'firebase/auth';
import { auth,firestore } from '../firebase';
import { addDoc, collection } from "@firebase/firestore"
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const CreateAccount = ({setCurrentScreen}) => {
    const [accountCreated,setAccountCreated] = useState(false)
    const [loading,setLoading] = useState(false)

    const [errorMsg,setErrorMsg] = useState('')
    const [expandGender,setExpandGender]= useState(false)
    const [gender,setGender] = useState('Male')
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [showPassword,setShowPassword] = useState('password')
    const [password,setPassword] = useState('')

    const writeUserDetails = async (user) => {
        await addDoc(collection(firestore, "users"), {
                    uid: user.uid,
                    firstName:firstName,
                    lastName:lastName,
                    gender:gender,
                    driver:false
                 })
                .then((e)=>{
                    setAccountCreated(true)
                    setLoading(false)
                    console.log('User Created',e)
                    sendEmailVerification(user)
                }
                )
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMsg(error.message)
                    console.log(errorCode, errorMessage);
                });
    }
    const onSubmit = async () => {
        setLoading(true)
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              writeUserDetails(user)

          })
          .catch((error) => {
              setLoading(false)
              const errorCode = error.code;
              const errorMessage = error.message;
              setErrorMsg(error.message)
              console.log(errorCode, errorMessage);
          });
   
     
      }
    return ( 
        <div className=' backdrop-blur-sm z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full'>
            <div className=" bg-white shadow-lg relative lg:order-1 lg:w-1/3 w-full lg:px-5 lg:py-10 py-6 flex flex-col justify-center items-center ">
                        <div className=' absolute top-0 flex justify-end  w-full max-h-max'>
                        <div className=' transition-all duration-300 border-2 rounded-md hover:bg-primary group  border-onBackground m-1 cursor-pointer'>
                                <AiOutlineClose onClick={()=>{
                                    setCurrentScreen('')
                                }} className=' m-2 text-lg text-onBackground group-hover:text-background font-extrabold ' />
                            </div>
                        </div>                       
                        <p className=" my-4 text-3xl antialiased font-bold text-black drop-shadow-md">Welcome to SahmRide</p>
                        <p className=' text-center my-1 antialiased text-sm text-red-500'>{errorMsg}</p>
                        <div className=' flex justify-center items-center w-3/4'>
                            <input className=" p-2 w-1/2 mr-1 my-2 inputTF focus:outline-none " value={firstName} onChange={
                                (e)=>{
                                    setFirstName(e.target.value)
                                }
                            } placeholder="First Name" />
                            <input className=" p-2 w-1/2 ml-1 my-2 inputTF focus:outline-none " value={lastName} onChange={
                                (e)=>{
                                    setLastName(e.target.value)
                                }
                            } placeholder="Last Name" />
                        </div>
                        <div onClick={
                            ()=>{
                                setExpandGender(!expandGender)
                            }
                        } className=' relative hover:bg-primary bg-background text-onBackground hover:text-background flex justify-between items-center w-3/4 p-2 inputTF'>
                            <p>{gender}</p>
                            <AiOutlineDown />
                            {
                            expandGender ? 
                            <ul className=' z-20 absolute top-full left-0 bg-background text-onBackground border shadow-md w-full list-none'>
                                    <li><button class=" hover:bg-primary hover:text-background w-full text-start pl-4" type="button" onClick={()=>{
                                         setExpandGender(!expandGender)
                                        setGender('Male')}
                                    }>Male</button></li>
                                    <li><button class=" hover:bg-primary hover:text-background w-full text-start pl-4" type="button" onClick={()=>{
                                         setExpandGender(!expandGender)
                                        setGender('Female')}}>Female</button></li>
                                    <li><button class=" hover:bg-primary hover:text-background w-full text-start pl-4 mb-2" type="button" onClick={()=>{
                                         setExpandGender(!expandGender)
                                        setGender('Transgender')}}>Transgender</button></li>
                            </ul> :
                            <></>
                            }
                        </div>
                        
                        <input className=" p-2 w-3/4 my-2 inputTF focus:outline-none " value={email} onChange={
                            (e)=>{
                                setEmail(e.target.value)
                            }
                        } placeholder="Email" />
                        <div className=' w-3/4 relative'>
                            <input className=" w-full p-2 my-2 inputTF focus:outline-none" type={showPassword} value={password} onChange={
                                (e)=>{
                                    setPassword(e.target.value)
                                }
                            } placeholder="Password" />
                            <div className=' h-full flex justify-center items-center absolute top-0 right-5'>
                                {showPassword === 'password' ? 
                                    <BsEyeFill className=' text-xl' onClick={
                                        ()=>{
                                            setShowPassword('text')
                                        }
                                    } /> :
                                    <BsEyeSlashFill className=' text-xl' onClick={
                                        ()=>{
                                            setShowPassword('password')
                                        }
                                    } />}
                            </div>
                        </div>
                        <button className=' transition-all duration-300 p-2 rounded-md bg-yellow text-onBackground bg-background border-2 border-onBackground hover:bg-primary hover:text-background font-semibold antialiased shadow-md w-3/4 my-4' onClick={
                            ()=>{
                                onSubmit()
                            }
                        }>Create Account</button>
                        <p className='text-secondary antialiased'> already have an account? <span onClick={()=>{setCurrentScreen('login')}} className=' underline-offset-2 underline antialiased text-black font-semibold cursor-pointer'>Login Now</span></p>
                        {
                            loading ?
                                <div className='backdrop-blur-sm top-0 left-0 absolute w-full h-full flex justify-center items-center loadingBg'>
                                    <iframe src="https://embed.lottiefiles.com/animation/97952"></iframe>
                                </div> : <></>
                        }
                        {
                            accountCreated ?
                                <div className='top-0 left-0 absolute w-full h-full flex flex-col justify-center items-center bg-white '>
                                    <iframe src="https://embed.lottiefiles.com/animation/19231"></iframe>
                                    <p className=' lead my-2 text-center'>Verification Email Sent, Verify email to Signin</p>
                                    <button className=' p-2 bg-yellow shadow-md bg-primary text-background rounded-md w-1/2 my-2' onClick={()=>{
                                        setCurrentScreen('signin')
                                    }} >Signin</button>
                                </div> : <></>
                        }
                    </div>
        </div>
     );
}
 
export default CreateAccount;