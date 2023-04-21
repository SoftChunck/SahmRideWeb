import {AiOutlineClose} from 'react-icons/ai'
import { useContext, useState } from 'react';

import { collection, getDoc,doc } from "firebase/firestore";
import { ref,getDownloadURL } from "firebase/storage"
import {firestore,storage} from '../firebase';

import {  signInWithEmailAndPassword,ch, sendEmailVerification   } from 'firebase/auth';
import {auth} from "../firebase";

import { User } from '../Objects/User';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const Login = ({setCurrentScreen}) => {
    const [loading,setLoading] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [errorMsg,setErrorMsg] = useState('')
    const [showPassword,setShowPassword] = useState('password')
    const [user,setUser] = useContext(User)
    const fetchUserDetails = async (userFB) => {
        await getDoc(doc(firestore,'users',userFB.uid))
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
            })
            .catch((e)=>{
                console.log(e)
            })

    }
    const onSubmit = async () => {
        setLoading(true)
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                if(userCredential.user.emailVerified){
                    fetchUserDetails(user)
                }
                else{
                    setErrorMsg('Email Not Verified, Verification Email Sent')
                    setLoading(false)
                    sendEmailVerification(userCredential.user)
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                if(errorMessage === "Firebase: Error (auth/wrong-password).")
                {
                    setErrorMsg("Wrong Password or User Not Found")
                }
                else if(errorMessage === "Firebase: Error (auth/invalid-email).")
                {
                    setErrorMsg("Invalid Email")
                }
                setLoading(false)
            });
    }
    return ( 
        <div className=' backdrop-blur-sm z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full'>
             <div className=" bg-background border-2 shadow-lg shadow-onBackground relative lg:order-1 lg:w-1/3 w-full lg:px-5 lg:py-10 py-4 flex flex-col justify-center items-center ">
                        <div className=' absolute top-0 flex justify-end w-full max-h-max'>
                            <div className=' border-2 rounded-md hover:bg-primary group  border-onBackground m-1 cursor-pointer'>
                                <AiOutlineClose onClick={()=>{
                                    setCurrentScreen('')
                                }} className=' m-2 text-lg text-onBackground group-hover:text-background font-extrabold ' />
                            </div>
                        </div>
                        <p className=" my-4 text-3xl antialiased font-bold text-onBackground drop-shadow-md">Welcome Back</p>
                        <p className=' text-center my-1 antialiased text-sm text-red-500'>{errorMsg}</p>
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
                        <div className=' flex lg:flex-row flex-col lg:justify-between lg:items-center w-3/4 my-2'>
                            <div className=' flex-row justify-center items-center lg:my-0 my-1'>
                                <input name='remember' type={'checkbox'} className="" />
                                <label name='remember' className=' ms-1 antialiased'> Remember for 30 days  </label>
                            </div>
                            <p className=' font-semibold text-onBackground underline-offset-2 underline lg:my-0 my-1 cursor-pointer'>Forgot Password</p>
                        </div>
                        <button className=' p-2 rounded-md border-2 border-onBackground text-onBackground hover:bg-primary hover:text-background transition-all duration-300 font-semibold antialiased shadow-md w-3/4 my-4' onClick={
                            ()=>{
                                onSubmit()
                            }
                        }>Login</button>
                        <p className='text-onBackground antialiased'> dont have an account? <span onClick={()=>{setCurrentScreen('createAccount')}} className=' cursor-pointer underline-offset-2 underline antialiased text-black font-semibold'>Sign up for free </span></p>
                        {
                            loading ?
                                <div className='backdrop-blur-sm absolute w-full h-full flex justify-center items-center loadingBg'>
                                    <iframe src="https://embed.lottiefiles.com/animation/97952"></iframe>
                                </div> : <></>
                        }
                        {
                            user.loggedIn ?
                            
                                <div className='top-0 left-0 absolute w-full h-full flex flex-col justify-center items-center bg-white '>
                                    <iframe src="https://embed.lottiefiles.com/animation/19231"></iframe>
                                    <p className=' lead my-2'>Signed In Successfully</p>
                                    <button className=' p-2 rounded-md bg-yellow text-background bg-primary w-1/2 my-2' onClick={()=>{
                                        setCurrentScreen('')
                                    }} >Home</button>
                                </div> : <></>
                        }
                    </div> 
        </div>
     );
}
 
export default Login;