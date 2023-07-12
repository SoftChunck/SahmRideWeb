import {AiOutlineClose} from 'react-icons/ai'
import { useContext, useState } from 'react';

import { collection, getDoc,doc } from "firebase/firestore";
import { ref,getDownloadURL } from "firebase/storage"
import {firestore,storage} from '../firebase';
import { ColorRing } from 'react-loader-spinner';

import {  signInWithEmailAndPassword,ch, sendEmailVerification,sendPasswordResetEmail   } from 'firebase/auth';
import {auth} from "../firebase";

import { User } from '../Objects/User';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

import loadingAnimation from '../Assets/loading.gif'
import { toast } from 'react-toastify';

const ForgotPassword = ({setCurrentScreen}) => {
    const [loading,setLoading] = useState(false)
    const [email,setEmail] = useState('')
    const [emailError,setEmailError] = useState(false)
    const [errorMsg,setErrorMsg] = useState('')
    const [showPassword,setShowPassword] = useState('password')
    const [user,setUser] = useContext(User)
    
    const fetchUserDetails = async (userFB) => {
        console.log('fetching Data')
        getDoc(doc(firestore,'users',userFB.uid))
            .then((querySnapshot)=>{
                if(querySnapshot.exists()){
                    getDownloadURL(ref(storage,`images/${userFB.uid}/profile`))
                        .then((imgurl)=>{
                            setUser(   
                                {
                                    uid:userFB.uid,
                                    firstName:querySnapshot.data().firstName,
                                    lastName:querySnapshot.data().lastName,
                                    gender:querySnapshot.data().gender,
                                    isDriver:querySnapshot.data().driver,
                                    profileImageUrl:imgurl,
                                    loggedIn:true
                                }
                            )                            
                            localStorage.setItem('user', JSON.stringify({
                                uid:userFB.uid,
                                firstName:querySnapshot.data().firstName,
                                lastName:querySnapshot.data().lastName,
                                gender:querySnapshot.data().gender,
                                isDriver:querySnapshot.data().driver,
                                profileImageUrl:imgurl,
                                loggedIn:true
                            }));
                            setLoading(false)
                        })
                        .catch((error)=>{
                            setUser(   
                                {
                                    uid:userFB.uid,
                                    firstName:querySnapshot.data().firstName,
                                    lastName:querySnapshot.data().lastName,
                                    gender:querySnapshot.data().gender,
                                    isDriver:querySnapshot.data().driver,
                                    profileImageUrl:null,
                                    loggedIn:true
                                }
                            )                            
                            localStorage.setItem('user', JSON.stringify({
                                uid:userFB.uid,
                                firstName:querySnapshot.data().firstName,
                                lastName:querySnapshot.data().lastName,
                                gender:querySnapshot.data().gender,
                                isDriver:querySnapshot.data().driver,
                                profileImageUrl:null,
                                loggedIn:true
                            }));
                            setLoading(false)
                            console.log(error.message)
                        })
                }
                else{
                    setLoading(false)
                    setErrorMsg('User Not Found')
                }
            })
            .catch((e)=>{
                setLoading(false)
                setErrorMsg('Network Error, Failed to Load User Details')
                console.log(e)
            })

    }
    const checkEmpty = (value) => {
        if (value.length == 0) {
            return true
        }
    }
    const validateData = () => {
        setErrorMsg(null)
        if(!emailError){
            if(checkEmpty(email)){
                setEmailError(true)
                toast.error('Email Cant be Empty')
                setErrorMsg('Email Cant be Empty')
                return false
            }
            else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
            {
                setEmailError(true)
                toast.error('Invalid Email')
                setErrorMsg('Invalid Email')
                return false
            }
        }
        if(errorMsg == null){
            onSubmit()
        }
    }
    const onSubmit = async () => {
        setLoading(true)
        sendPasswordResetEmail(auth,email)
        .then(() => {
           toast('Reset Email Sent')
           setCurrentScreen('login')
           setLoading(false)
        })
        .catch((error) => {
            toast('Invalid Email')
            setErrorMsg('Invalid Email')
            setLoading(false)
        });
    }
    return ( 
        <div className=' backdrop-blur-sm z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full'>
             <div className=" bg-background border-2 shadow-lg shadow-onBackground relative lg:order-1 lg:w-1/3 w-full lg:px-5 lg:py-10 py-4 flex flex-col justify-center items-center ">
                        <div className=' absolute top-0 flex justify-end w-full max-h-max'>
                        <div className=' transition-all duration-300 border-2 rounded-md hover:bg-primary group  border-onBackground m-1 cursor-pointer' onClick={()=>{
                                    setCurrentScreen('')
                                }}>
                                <AiOutlineClose  className=' m-2 text-lg text-onBackground group-hover:text-background font-extrabold ' />
                            </div>
                        </div>
                        <p className=" my-4 text-3xl antialiased font-bold text-onBackground drop-shadow-md">Reset Password</p>
                        <p className=' text-center my-1 antialiased text-sm text-red-500'>{errorMsg}</p>
                        <input className={ ` w-3/4 p-2 my-2 focus:outline-none border-b-2 ${ emailError ? ' border-red-500' : 'border-gray-500'}`} value={email} onChange={
                            (e)=>{
                                setEmailError(false)
                                setEmail(e.target.value)
                            }
                        } placeholder="Email" />
                        <button className=' p-2 rounded-md border-2 border-onBackground text-onBackground hover:bg-primary hover:text-background transition-all duration-300 font-semibold antialiased shadow-md w-3/4 my-4' onClick={
                            ()=>{
                                validateData()
                            }
                        }>Reset Password</button>
                        <p className='text-onBackground antialiased'> dont have an account? <span onClick={()=>{setCurrentScreen('createAccount')}} className=' cursor-pointer underline-offset-2 underline antialiased text-black font-semibold'>Sign up for free </span></p>
                        {
                            loading ?
                                <div className='backdrop-blur-sm absolute w-full h-full flex justify-center items-center loadingBg overflow-hidden'>
                                     <ColorRing
                                        visible={true}
                                        height="100"
                                        width="100"
                                        ariaLabel="blocks-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="blocks-wrapper"
                                        colors={['#2a9df4', '#2a9df4', '#2a9df4','#2a9df4','#2a9df4']}
                                    />
                                </div> : <></>
                        }
                        {
                            user.loggedIn ? setCurrentScreen('') : <></>
                             
                                // <div className='top-0 left-0 absolute w-full h-full flex flex-col justify-center items-center bg-white '>
                                //     <iframe src="https://embed.lottiefiles.com/animation/19231"></iframe>
                                //     <p className=' lead my-2'>Signed In Successfully</p>
                                //     <button className=' p-2 rounded-md bg-yellow text-background bg-primary w-1/2 my-2' onClick={()=>{
                                        
                                //     }} >Home</button>
                                // </div> : <></>
                        }
                    </div> 
        </div>
     );
}
 
export default ForgotPassword;