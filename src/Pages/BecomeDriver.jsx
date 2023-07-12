import { BiPlus, BiSend } from "react-icons/bi";
import { getDoc, getDocs, doc, setDoc, collection, deleteDoc,onSnapshot, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, } from 'firebase/storage';
import { realtime, firestore, storage } from '../firebase'
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";
import DialogBox from "../Components/DialogBox";

var user = undefined
const BecomeDriver = () => {
    // const [pics, setPics] = useState({
    //     'cnic': [null,null],
    //     'drivingLicence': [null,null],
    //     'car': [null,null,null,null,null,null]
    // })
    const [cnicFront, setCnicFront] = useState(undefined)
    const [cnicBack, setCnicBack] = useState(undefined)
    const [drivingLicenseFront, setdrivingLicenseFront] = useState(undefined)
    const [drivingLicenseBack, setdrivingLicenseBack] = useState(undefined)
    const [car0, setCar0] = useState(undefined)
    const [car1, setCar1] = useState(undefined)
    const [car2, setCar2] = useState(undefined)
    const [car3, setCar3] = useState(undefined)
    const [car4, setCar4] = useState(undefined)
    const [car5, setCar5] = useState(undefined)

    const [carName, setCarName] = useState('')
    const [carModel, setCarModel] = useState('')
    const [CNIC, setCNIC] = useState('')
    const [drivingLicience, setdrivingLicense] = useState('')

    const [errorMsg, setErrorMsg] = useState('')
    const [drivingLicenseError, setDrivingLicenseError] = useState(false)
    const [carModelError, setCarModelError] = useState(false)
    const [cnicError, setCnicError] = useState(false)
    const [carNameError, setCarNameError] = useState(false)
    const [requestSent,setRequestSent] = useState(false)

    const fetchData = async (setter, path) => {
        const pic = await getDownloadURL(ref(storage, `images/${user.uid}/${path}`))
        if (pic) {
            setter(pic)
        }
    }
    const fetchAllData = async () => {
        fetchData(setCnicFront, 'cnic/0')
        fetchData(setCnicBack, 'cnic/1')
        fetchData(setdrivingLicenseFront, 'drivingLicense/0')
        fetchData(setdrivingLicenseBack, 'drivingLicense/1')
        fetchData(setCar0, 'car/0')
        fetchData(setCar1, 'car/1')
        fetchData(setCar2, 'car/2')
        fetchData(setCar3, 'car/3')
        fetchData(setCar4, 'car/4')
        fetchData(setCar5, 'car/5')
    }
    const checkEmpty = (value) => {
        if (value.length == 0) {
            return true
        }
    }
    const validateData = () => {
        var numOnly = /^[\d]*$/g;

        setErrorMsg(null)
        if (!cnicError) {
            if (CNIC.length < 13 || !(numOnly.test(CNIC)) || checkEmpty(CNIC)) {
                setCnicError(true)
                setErrorMsg('CNIC Error')
                return false
            }
        }
        if(!carModelError){
            if(checkEmpty(carModel)){
                setCarModelError(true)
                setErrorMsg('Empty Vehicle Model')
                return false
            }
        }
        if(!carNameError){
            if(checkEmpty(carName)){
                setCarNameError()
                setErrorMsg('Empty Vehicle Name')
                return false
            }
        }
        if(!drivingLicenseError)
        {
            if(checkEmpty(drivingLicience)){
                setDrivingLicenseError()
                setErrorMsg('Empty Driving License')
                return false
            }
        }
        if(errorMsg == null && cnicFront && cnicBack && drivingLicenseBack && drivingLicenseFront && car0 && car1 && car2 && car3 && car4 && car5){
            return true
        }
    }
    const sendDriverRequest = ()=>{
        if(validateData()){
            updateDoc(doc(firestore,`users/${user.uid}`),{
                cnic:CNIC,
                vehicleModel:carModel,
                vehicleName:carName,
                drivingLicense:drivingLicience,
                driverRequest:'pending',
                driver:false,
            })
            .then(()=>{
                setRequestSent(true)
            })
            .catch((e)=>{
                console.log(e)
            })
        }
    }
    useEffect(() => {
        var users = localStorage.getItem('user')
        if (users) {
            user = JSON.parse(users)
        }
        fetchAllData()
    }, [])
    const uploadImage = async (image, setter, path) => {
        const buffer = await image.arrayBuffer();
        const result = await uploadBytes(ref(storage, `images/${user.uid}/${path}`), buffer)
        setter(await getDownloadURL(ref(storage, `images/${user.uid}/${path}`)))
    }

    return (
        <div className=" container mx-auto my-2">
            <div className=" border-2 border-onBackground rounded-lg p-2">
                {/* <div className=" flex w-full gap-x-2">
                    <input type="text" placeholder="First Name" className=" p-2 border-b-2 border-onBackground " />
                    <input type="text" placeholder="Last Name" className=" p-2 border-b-2 border-onBackground " />
                </div> */}
                <p className=" my-2 fsM font-bold text-xl">Vehicle Details</p>
                <div className=" flex gap-2 flex-wrap">
                    <input value={carName} onChange={(e) => {
                        setCarName(e.target.value)
                        setCarNameError(false)
                    }} type="text" maxLength={39} placeholder="Vehicle Name" className={`focus:outline-none p-2 border-b-2 ${carNameError ? 'border-red-500 text-red-500 ' : 'border-onBackground text-onBackground'} `} />
                    <input value={carModel} onChange={(e) => {
                        setCarModel(e.target.value)
                        setCarModelError(false)
                    }} type="text" maxLength={39} placeholder="Model No." className={`focus:outline-none p-2 border-b-2 ${carModelError ? 'border-red-500 text-red-500 ' : 'border-onBackground text-onBackground'} `} />
                    <input value={CNIC} onChange={(e) => {
                        setCNIC(e.target.value)
                        setCnicError(false)
                    }} type='text' placeholder="CNIC" className={`focus:outline-none p-2 border-b-2 ${cnicError ? 'border-red-500 text-red-500 ' : 'border-onBackground text-onBackground'} `} maxLength={13} />
                    <input value={drivingLicience} onChange={(e) => {
                        setdrivingLicense(e.target.value)
                        setDrivingLicenseError(false)
                    }} type='text' maxLength={13} placeholder="Driving License No." className={`focus:outline-none p-2 border-b-2 ${drivingLicenseError ? 'border-red-500 text-red-500 ' : 'border-onBackground text-onBackground'} `} />
                </div>
                <p className=" my-2 fsM font-bold text-xl">CNIC Pics (Front & Back) </p>
                <div className=" flex flex-wrap py-2 gap-4 items-center justify-center md:items-start md:justify-start">
                    <label for="cnicFront" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {cnicFront == null ?
                            <BiPlus /> :
                            <img src={cnicFront} className="w-44 h-44 object-cover " />} </label>
                    <input
                        type="file"
                        id='cnicFront'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCnicFront, 'cnic/0')
                        }}
                    />
                    <label for="cnicBack" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            cnicBack == null ?
                                <BiPlus /> :
                                <img src={cnicBack} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='cnicBack'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCnicBack, 'cnic/1')
                        }}
                    />
                </div>
                <p className=" my-2 fsM font-bold text-xl">Driving License Pics (Front & Back) </p>
                <div className=" flex flex-wrap py-2 gap-4 items-center justify-center md:items-start md:justify-start">
                    <label for="drivingLicenseFront" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            drivingLicenseFront == null ?
                                <BiPlus /> :
                                <img src={drivingLicenseFront} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='drivingLicenseFront'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setdrivingLicenseFront, 'drivingLicense/0')
                        }}
                    />
                    <label for="drivingLicenseBack" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            drivingLicenseBack == null ?
                                <BiPlus /> :
                                <img src={drivingLicenseBack} className="w-44 h-44 object-cover " />

                        }
                    </label>
                    <input
                        type="file"
                        id='drivingLicenseBack'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setdrivingLicenseBack, 'drivingLicense/1')
                        }}
                    />
                </div>
                <p className=" my-2 fsM font-bold text-xl">Vehicle Pics </p>
                <div className=" flex flex-wrap py-2 gap-4 items-center justify-center md:items-start md:justify-start">

                    <label for="car0" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            car0 == null ?
                                <BiPlus /> :
                                <img src={car0} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='car0'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCar0, 'car/0')
                        }}
                    />

                    <label for="car1" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            car1 == null ?
                                <BiPlus /> :
                                <img src={car1} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='car1'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCar1, 'car/1')
                        }}
                    />
                    <label for="car2" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            car2 == null ?
                                <BiPlus /> :
                                <img src={car2} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='car2'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCar2, 'car/2')
                        }}
                    />
                    <label for="car3" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            car3 == null ?
                                <BiPlus /> :
                                <img src={car3} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='car3'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCar3, 'car/3')
                        }}
                    />
                    <label for="car4" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            car4 == null ?
                                <BiPlus /> :
                                <img src={car4} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='car4'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCar4, 'car/4')
                        }}
                    />
                    <label for="car5" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                        {
                            car5 == null ?
                                <BiPlus /> :
                                <img src={car5} className="w-44 h-44 object-cover " />
                        }
                    </label>
                    <input
                        type="file"
                        id='car5'
                        className=" hidden"
                        onChange={(event) => {
                            uploadImage(event.target.files[0], setCar5, 'car/5')
                        }}
                    />
                </div>
                <div className=" w-full flex justify-center items-center">
                    {
                        requestSent ? 
                        <>
                            <DialogBox msg={'Request Sent'} />
                            <div className=" flex border-2 border-onBackground p-2 items-center rounded-md justify-center">
                                <MdDone className=" text-green-500 text-lg font-bold me-1" />
                                <p>Request Submitted Successfully</p>
                            </div>
                        </> : 
                        <button className=" btn w-1/2 md:w-1/3 lg:w-1/4" onClick={() => { sendDriverRequest() }}>Send Request</button>
                    }
                </div>
            </div>
        </div>
    );
}

export default BecomeDriver;