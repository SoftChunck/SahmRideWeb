import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai'
import { useState } from 'react';

import { createUserWithEmailAndPassword, sendEmailVerification, User } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { addDoc, collection } from "@firebase/firestore"
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { ColorRing } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import success from '../Assets/success.gif'
const CreateAccount = ({ setCurrentScreen }) => {
    const [accountCreated, setAccountCreated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [expandGender, setExpandGender] = useState(false)
    const [gender, setGender] = useState('Male')
    const [firstNameError, setFirstNameError] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastNameError, setLastNameError] = useState(false)
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [showPassword, setShowPassword] = useState('password')
    const [password, setPassword] = useState('')

    const writeUserDetails = async (user) => {
        await addDoc(collection(firestore, "users"), {
            uid: user.uid,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            driver: false
        })
            .then((e) => {
                setAccountCreated(true)
                setLoading(false)
                console.log('User Created', e)
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
    const checkEmpty = (value) => {
        if (value.length == 0) {
            return true
        }
    }
    const validateData = () => {
        setErrorMsg(null)
        if (!firstNameError) {
            if (checkEmpty(firstName)) {
                setFirstNameError(true)
                toast.error('First Name Cant be Empty')
                setErrorMsg('First Name Cant be Empty')
                return false
            }
        }
        if (!lastNameError) {
            if (checkEmpty(lastName)) {
                setLastNameError(true)
                toast.error('Last Name Cant be Empty')
                setErrorMsg('Last Name Cant be Empty')
                return false
            }
        }
        if (!emailError) {
            if (checkEmpty(email)) {
                setEmailError(true)
                toast.error('Email Cant be Empty')
                setErrorMsg('Email Cant be Empty')
                return false
            }
            else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
                setEmailError(true)
                toast.error('Invalid Email')
                setErrorMsg('Invalid Email')
                return false
            }
        }
        if (!passwordError) {
            if (checkEmpty(password)) {
                setPasswordError(true)
                toast.error('Password Cant be Empty')
                setErrorMsg('Password Cant be Empty')
                return false
            }
            else if (password.length < 8) {
                setPasswordError(true)
                toast.error('Invalid Password , Password must be Greater then 8 Characters')
                setErrorMsg('Invalid Password , Password must be Greater then 8 Characters')
                return false
            }
        }
        if (errorMsg == null) {
            onSubmit()
        }
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
                    <div className=' transition-all duration-300 border-2 rounded-md hover:bg-primary group  border-onBackground m-1 cursor-pointer' onClick={() => {
                        setCurrentScreen('')
                    }}>
                        <AiOutlineClose className=' m-2 text-lg text-onBackground group-hover:text-background font-extrabold ' />
                    </div>
                </div>
                <p className=" my-4 text-3xl antialiased font-bold text-black drop-shadow-md">Welcome to SahmRide</p>
                <p className=' text-center my-1 antialiased text-sm text-red-500'>{errorMsg}</p>
                <div className=' flex justify-between items-center w-3/4'>
                    <input className={` w-1/2 p-2 my-2 focus:outline-none border-b-2 ${firstNameError ? ' border-red-500' : 'border-gray-500'}`} value={firstName} onChange={
                        (e) => {
                            setFirstNameError(false)
                            setFirstName(e.target.value)
                        }
                    } placeholder="First Name" />
                    <input className={` w-1/2 p-2 my-2 focus:outline-none border-b-2 ${lastNameError ? ' border-red-500' : 'border-gray-500'}`} value={lastName} onChange={
                        (e) => {
                            setLastNameError(false)
                            setLastName(e.target.value)
                        }
                    } placeholder="Last Name" />
                </div>
                <div onClick={
                    () => {
                        setExpandGender(!expandGender)
                    }
                } className=' border-b-2 border-gray-500 relative hover:bg-primary bg-background text-onBackground hover:text-background flex justify-between items-center w-3/4 p-2 inputTF'>
                    <p>{gender}</p>
                    <AiOutlineDown />
                    {
                        expandGender ?
                            <ul className=' z-20 absolute top-full left-0 bg-background text-onBackground border shadow-md w-full list-none'>
                                <li><button class=" hover:bg-primary hover:text-background w-full text-start pl-4" type="button" onClick={() => {
                                    setExpandGender(!expandGender)
                                    setGender('Male')
                                }
                                }>Male</button></li>
                                <li><button class=" hover:bg-primary hover:text-background w-full text-start pl-4" type="button" onClick={() => {
                                    setExpandGender(!expandGender)
                                    setGender('Female')
                                }}>Female</button></li>
                                <li><button class=" hover:bg-primary hover:text-background w-full text-start pl-4 mb-2" type="button" onClick={() => {
                                    setExpandGender(!expandGender)
                                    setGender('Transgender')
                                }}>Transgender</button></li>
                            </ul> :
                            <></>
                    }
                </div>

                <input className={` w-3/4 p-2 my-2 focus:outline-none border-b-2 ${emailError ? ' border-red-500' : 'border-gray-500'}`} value={email} onChange={
                    (e) => {
                        setEmailError(false)
                        setEmail(e.target.value)
                    }
                } placeholder="Email" />
                <div className={`w-3/4 relative border-b-2 ${passwordError ? ' border-red-500' : 'border-gray-500'}`}>
                    <input className={` w-3/4 p-2 mt-2 focus:outline-none`} type={showPassword} value={password} onChange={
                        (e) => {
                            setPasswordError(false)
                            setPassword(e.target.value)
                        }
                    } placeholder="Password" />
                    <div className=' h-full flex justify-center items-center absolute top-0 right-5'>
                        {showPassword === 'password' ?
                            <BsEyeFill className=' text-xl' onClick={
                                () => {
                                    setShowPassword('text')
                                }
                            } /> :
                            <BsEyeSlashFill className=' text-xl' onClick={
                                () => {
                                    setShowPassword('password')
                                }
                            } />}
                    </div>
                </div>
                <button className=' transition-all duration-300 p-2 rounded-md bg-yellow text-onBackground bg-background border-2 border-onBackground hover:bg-primary hover:text-background font-semibold antialiased shadow-md w-3/4 my-4' onClick={
                    () => {
                        validateData()
                    }
                }>Create Account</button>
                <p className='text-secondary antialiased'> already have an account? <span onClick={() => { setCurrentScreen('login') }} className=' underline-offset-2 underline antialiased text-black font-semibold cursor-pointer'>Login Now</span></p>
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
                                colors={['#2a9df4', '#2a9df4', '#2a9df4', '#2a9df4', '#2a9df4']}
                            />
                        </div> : <></>
                }
                {
                    accountCreated ?
                        <div className='top-0 left-0 absolute w-full h-full flex flex-col justify-center items-center bg-white '>
                            <iframe src={success}></iframe>
                            <p className=' lead my-2 text-center'>Verification Email Sent, Verify email to Signin</p>
                            <button className=' p-2 bg-yellow shadow-md bg-primary text-background rounded-md w-1/2 my-2' onClick={() => {
                                setCurrentScreen('signin')
                            }} >Signin</button>
                        </div> : <></>
                }
            </div>
        </div>
    );
}

export default CreateAccount;