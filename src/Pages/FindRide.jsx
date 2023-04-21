import React, { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl, { GeolocateControl } from 'mapbox-gl';
import { getDownloadURL, ref as imgRef } from 'firebase/storage';
import { realtime, firestore, storage } from '../firebase'
import { get, ref, set } from 'firebase/database';
import { getDoc, getDocs, doc, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaAngleLeft, FaAngleRight, FaQuoteLeft } from 'react-icons/fa'
import slide from '../Assets/Sliders/slide.jpg'
import slidee from '../Assets/Sliders/slidee.jpg'
import logo from '../Assets/Logo/DarkLogo.svg'
import { BsGenderFemale, BsGenderMale, BsGenderTrans, BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import slideee from '../Assets/Sliders/slideee.jpg'
import { ColorRing } from 'react-loader-spinner';
import { User } from '../Objects/User';
import chooseSeat from '../Assets/Cars/seats.png'
import { BiPlus } from 'react-icons/bi';
import { MdDone } from 'react-icons/md';
// import './Mapbox.css'
mapboxgl.accessToken = 'pk.eyJ1Ijoic29mdGNodW5jayIsImEiOiJjbGFkcmR6bHAwbW9oM3VtaGNpb3lpbDQ4In0.3mzCh9e8kmyv_MCZIpHO5w';
const priceOfFule = 280.0
const fulePerKm = 0.4
var geoLocation = new GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
})
var PickupMarker = undefined
var DestinationMarker = undefined
var requestedDriver = undefined
const FindRide = () => {
    const [select, setSelect] = useState('pickup')
    const [pickupCoordinates, setPickupCoordinates] = useState([-122.4194, 37.7749])
    const [pickup, setPickup] = useState([])
    const [destinationCoordinates, setDestinationCoordinates] = useState([-122.4194, 37.7749])
    const [user, setUser, selected, setSelected] = useContext(User)
    const [destination, setDestination] = useState([])
    const [locationSuggestion, setLocationSuggestions] = useState([])
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [zoom, setZoom] = useState(9);
    const [listIndex, setListIndex] = useState(0)
    const [avalibleDrivers, setAvalibleDrivers] = useState([])
    const [tripDuration, setTripDuration] = useState(0)
    const [tripDistance, setTripDistance] = useState(0)
    const [searchingDriver, setSearchingDriver] = useState(false)
    const [request, setRequest] = useState('none')
    var genratedWayPoitns = []
    let activeIndex = 0;
    const [selectedSeat, setSelectedSeat] = useState(99)
    // const groups = document.getElementsByClassName("card-group");
    // const handleLoveClick = () => {
    //     const nextIndex = activeIndex + 1 <= groups.length - 1 ? activeIndex + 1 : 0;

    //     const currentGroup = document.querySelector(`[data-index="${activeIndex}"]`),
    //         nextGroup = document.querySelector(`[data-index="${nextIndex}"]`);

    //     currentGroup.dataset.status = "after";

    //     nextGroup.dataset.status = "becoming-active-from-before";

    //     setTimeout(() => {
    //         nextGroup.dataset.status = "active";
    //         activeIndex = nextIndex;
    //     });
    // }

    // const handleHateClick = () => {
    //     const nextIndex = activeIndex - 1 >= 0 ? activeIndex - 1 : groups.length - 1;

    //     const currentGroup = document.querySelector(`[data-index="${activeIndex}"]`),
    //         nextGroup = document.querySelector(`[data-index="${nextIndex}"]`);

    //     currentGroup.dataset.status = "before";

    //     nextGroup.dataset.status = "becoming-active-from-after";

    //     setTimeout(() => {
    //         nextGroup.dataset.status = "active";
    //         activeIndex = nextIndex;
    //     });
    // }

    //Setting Route
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            attributionControl: false,
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-122.4194, 37.7749],
            zoom: zoom
        });
        map.current.addControl(new mapboxgl.NavigationControl());
        map.current.addControl(geoLocation, 'bottom-right');
        map.current.on('click', (cord) => {
            if (select == 'pickup')
                setPickupCoordinates([cord.lngLat.lng, cord.lngLat.lat])
            else
                setDestinationCoordinates([cord.lngLat.lng, cord.lngLat.lat])
        });
    });

    useEffect(() => {
        if (map.current) {
            map.current.setCenter(pickupCoordinates)
            if (select == 'pickup') {
                if (PickupMarker) {
                    PickupMarker.setLngLat(pickupCoordinates);
                }
                else {
                    PickupMarker = new mapboxgl.Marker({
                        color: "#000000",
                        draggable: false
                    }).setLngLat(pickupCoordinates)
                        .addTo(map.current);
                    PickupMarker.on('drag', () => {
                        if (DestinationMarker) {
                            getRoute()
                        }
                    })
                }
            }
            else {
                if (DestinationMarker) {
                    DestinationMarker.setLngLat(pickupCoordinates);
                }
                else {
                    DestinationMarker = new mapboxgl.Marker({
                        color: "#6571df",
                        draggable: false
                    }).setLngLat(pickupCoordinates)
                        .addTo(map.current);
                    DestinationMarker.on('drag', () => {
                        if (PickupMarker) {
                            getRoute()
                        }
                    })
                }
            }
            if (pickup && destination) {
                getRoute()
            }
        }
    }, [pickupCoordinates, destinationCoordinates])

    const LocationSearch = async (location) => {
        setListIndex(0)
        const result = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=sk.eyJ1Ijoic29mdGNodW5jayIsImEiOiJjbGFkd3Awbm8wcGFxM3FydHJjcWZnbXZrIn0.cHISIz_W2xWN157MUrcHXQ`);
        const jsonResult = await result.json();
        setLocationSuggestions(jsonResult.features)
    }

    const getRoute = async function () {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${PickupMarker._lngLat.lng},${PickupMarker._lngLat.lat};${DestinationMarker._lngLat.lng},${DestinationMarker._lngLat.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
            { method: 'GET' }
        );
        const json = await query.json();
        const data = json.routes[0];
        setTripDistance(data.distance)
        setTripDuration(data.duration)
        const route = data.geometry.coordinates;
        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        // if the route already exists on the map, we'll reset it using setData
        if (map.current.getSource('route')) {
            map.current.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    // 'line-opacity': 0.75
                }
            });
        }
        // add turn instructions here at the end
    }

    //Finding Driver
    const searchDrivers = async () => {
        setSearchingDriver(true)
        setAvalibleDrivers([])
        var driversList = await get(ref(realtime, "driversLocation"))
        driversList = Object.keys(driversList.val())
        driversList.forEach(async (driverUid) => {
            var driverData = await get(ref(realtime, `driversLocation/${driverUid}`))
            driverData = driverData.val()
            if (driverData.Active) {
                var routeDetails = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${driverData.lng},${driverData.lat};${PickupMarker._lngLat.lng},${PickupMarker._lngLat.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
                    { method: 'GET' }
                );
                routeDetails = await routeDetails.json();
                // console.log(routeDetails.routes[0])
                //Fetching Driver Profile Details
                var userProfile = await getDoc(doc(firestore, 'users', driverUid))
                var reviewsList = []
                var reviews = await getDocs(collection(firestore, `users/${driverUid}/reviews`))
                reviews.docs.map(async (review) => {
                    var userReviewImg = await getDownloadURL(imgRef(storage, `images/${review.id}/profile`))
                    var userReviewDetails = await getDoc(doc(firestore, 'users', review.id))
                    userReviewDetails = userReviewDetails.data()
                    reviewsList.push({
                        firstName: userReviewDetails.firstName,
                        lastName: userReviewDetails.lastName,
                        profileImg: userReviewImg,
                        rating: review.data().rating,
                        review: review.data().review
                    })
                })
                userProfile = userProfile.data()
                var profileImg = await getDownloadURL(imgRef(storage, `images/${driverUid}/profile`))
                var carImg0 = await getDownloadURL(imgRef(storage, `images/${driverUid}/car/0`))
                var carImg1 = await getDownloadURL(imgRef(storage, `images/${driverUid}/car/1`))
                var carImg2 = await getDownloadURL(imgRef(storage, `images/${driverUid}/car/2`))
                var carImg3 = await getDownloadURL(imgRef(storage, `images/${driverUid}/car/3`))
                var carImg4 = await getDownloadURL(imgRef(storage, `images/${driverUid}/car/4`))
                var carImg5 = await getDownloadURL(imgRef(storage, `images/${driverUid}/car/5`))
                var completeRoute = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${driverData.lng},${driverData.lat};${PickupMarker._lngLat.lng},${PickupMarker._lngLat.lat};${DestinationMarker._lngLat.lng},${DestinationMarker._lngLat.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
                    { method: 'GET' }
                );
                var completeRoute = await completeRoute.json();
                var driverDetails = {
                    uid: driverUid,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    gender: userProfile.gender,
                    profileImg: profileImg,
                    carType: userProfile.carType,
                    route: routeDetails.routes[0],
                    seatsDetail: driverData.seatsDetail,
                    carImg0: carImg0,
                    carImg1: carImg1,
                    carImg2: carImg2,
                    carImg3: carImg3,
                    carImg4: carImg4,
                    carImg5: carImg5,
                    reviewList: reviewsList,
                    genratedWayPoitns: [
                        { lat: driverData.lat, lng: driverData.lng },
                        { lat: PickupMarker._lngLat.lat, lng: PickupMarker._lngLat.lng },
                        { lat: DestinationMarker._lngLat.lat, lng: DestinationMarker._lngLat.lng }
                    ],
                    price: ((completeRoute.routes[0].distance / 1000).toFixed(2) * priceOfFule * fulePerKm).toFixed(0)
                }
                setAvalibleDrivers(avalibleDrivers => [...avalibleDrivers, driverDetails])
                setSearchingDriver(false)
            }
        })
        // setSearchingDriver(false)
    }
    const sendRequest = async (driverDetails) => {
        requestedDriver = driverDetails
        await setDoc(doc(firestore, "ridesDetail", user.uid), {
            driverUid: driverDetails.uid,
            destinationLat: DestinationMarker._lngLat.lat,
            destinationLng: DestinationMarker._lngLat.lng,
            pickupLat: PickupMarker._lngLat.lat,
            pickupLng: PickupMarker._lngLat.lng,
            distance: (tripDistance / 1000).toFixed(2),
            duration: `${(tripDuration / 3600) | 0}hr ${((tripDuration % 3600) / 60) | 0}min`,
            distanceFromDriver: (driverDetails.route.distance / 1000).toFixed(2),
            durationFromDriver: `${(driverDetails.route.duration / 3600) | 0}hr ${((driverDetails.route.duration % 3600) / 60) | 0}min`,
            price: driverDetails.price,
            request: 'pending',
        })
        set(ref(realtime, `driversLocation/${driverDetails.uid}/users/${user.uid}/`), 0)
        await set(ref(realtime, `driversLocation/${driverDetails.uid}/genratedWaypoints/`), null)
        await set(ref(realtime, `driversLocation/${driverDetails.uid}/genratedWaypoints/`), driverDetails.genratedWayPoitns)
        setRequest('pending')
    }
    const cancelRequest = async () => {
        await deleteDoc(doc(firestore, `ridesDetail/${user.uid}`))
        set(ref(realtime, `driversLocation/${requestedDriver.uid}/users/${user.uid}/`), null)
        await set(ref(realtime, `driversLocation/${requestedDriver.uid}/genratedWaypoints/`), null)
        setRequest('cancelled')
        console.log('Request Cancelled')
    }
    return (
        <div className=' relative'>
            <div className=" mt-4 container mx-auto flex flex-col lg:flex-row items-center lg:px-4">
                <div className=" lg:w-1/2 lg:order-1 order-2 flex lg:block justify-center flex-col items-center">
                    <h2 className=" lg:text-start text-center text-3xl lg:text-6xl fsM font-bold lg:py-0 py-3">Get Instant Ride <br /> <span className=" text-2xl lg:text-6xl text-onBackground">Share Ride Save
                        Environment</span></h2>
                    <p className=" text-justify lg:w-3/4 lg:px-0 px-1">Welcome to Sahmride, the smarter and more convenient way to get around. Whether you're commuting to work, heading to the airport, or simply running errands, our platform makes it easy to find reliable transportation that fits your needs and budget</p>
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
            <section className='container mx-auto relative my-3 flex flex-col'>
                <div className=' flex lg:flex-row flex-col justify-center items-center bg-onBackground rounded-lg p-2'>
                    <div className=' lg:order-1 order-2 lg:w-1/2 w-full h-full bg-onBackground lg:py-4 my-2 rounded-md flex flex-col justify-center items-center'>
                        <p className='  m-3 text-4xl drop-shadow-md font-semibold text-background'>Book <span className=' text-primary'>Ride</span></p>
                        <div className=' w-full px-3 lg:px-0 lg:w-3/4 relative'>
                            <input className=' w-full focus:outline-none p-3 shadow-lg' value={pickup}
                                onFocus={
                                    () => {
                                        setSelect('pickup')
                                    }
                                }
                                onChange={
                                    (e) => {
                                        setPickup(e.target.value)
                                        LocationSearch(e.target.value)
                                    }
                                }
                                onKeyDown={
                                    (event) => {
                                        if (event.key === 'Enter') {
                                            setPickup(locationSuggestion[listIndex].place_name)
                                            setPickupCoordinates(locationSuggestion[listIndex].geometry.coordinates)
                                            setLocationSuggestions([])
                                        }
                                        else if (event.key === 'ArrowDown') {
                                            if (listIndex < locationSuggestion.length - 1)
                                                setListIndex(listIndex + 1)
                                            else
                                                setListIndex(0)
                                        }
                                        else if (event.key === 'ArrowUp') {
                                            if (listIndex > 0)
                                                setListIndex(listIndex - 1)
                                            else
                                                setListIndex(locationSuggestion.length - 1)
                                        }
                                    }
                                }
                                placeholder='Select Pickup' />
                            {
                                (locationSuggestion.length > 0 && select == 'pickup') ?
                                    <ul className='z-20 px-3 lg:px-0 w-full top-full left-0 absolute bg-background list-none shadow-sm'>
                                        {
                                            locationSuggestion.map((item, index) => {
                                                return (
                                                    <li key={index} className={' text-black antialiased hover:bg-primary cursor-pointer p-1 border-b-2 ' + (index === listIndex ? ' bg-primary' : '')} onClick={
                                                        () => {
                                                            setPickup(item.place_name)
                                                            setPickupCoordinates(item.geometry.coordinates)
                                                            setLocationSuggestions([])
                                                        }
                                                    }>{item.place_name}</li>
                                                )
                                            })
                                        }
                                    </ul> : <></>
                            }
                        </div>
                        <div className=' w-full px-3 lg:px-0 lg:w-3/4 relative mt-2'>
                            <input className=' w-full focus:outline-none p-3 shadow-lg' value={destination}
                                onFocus={
                                    () => {
                                        setSelect('destination')
                                    }
                                }
                                onChange={
                                    (e) => {
                                        setDestination(e.target.value)
                                        LocationSearch(e.target.value)
                                    }
                                }
                                onKeyDown={
                                    (event) => {
                                        if (event.key === 'Enter') {
                                            setDestination(locationSuggestion[listIndex].place_name)
                                            setPickupCoordinates(locationSuggestion[listIndex].geometry.coordinates)
                                            setLocationSuggestions([])
                                        }
                                        else if (event.key === 'ArrowDown') {
                                            if (listIndex < locationSuggestion.length - 1)
                                                setListIndex(listIndex + 1)
                                            else
                                                setListIndex(0)
                                        }
                                        else if (event.key === 'ArrowUp') {
                                            if (listIndex > 0)
                                                setListIndex(listIndex - 1)
                                            else
                                                setListIndex(locationSuggestion.length - 1)
                                        }
                                    }
                                }
                                placeholder='Select Destination' />
                            {
                                (locationSuggestion.length > 0 && select == 'destination') ?
                                    <ul className=' px-3 lg:px-0 z-20 w-full top-full left-0 absolute bg-white list-none shadow-sm'>
                                        {
                                            locationSuggestion.map((item, index) => {
                                                return (
                                                    <li className={'hover:bg-primary cursor-pointer p-1 border-b-2 text-black antialiased ' + (index === listIndex ? ' bg-primary' : '')} onClick={
                                                        () => {
                                                            setDestination(item.place_name)
                                                            setPickupCoordinates(item.geometry.coordinates)
                                                            setLocationSuggestions([])
                                                        }
                                                    }>{item.place_name}</li>
                                                )
                                            })
                                        }
                                    </ul> : <></>
                            }
                        </div>                        
                        {
                            searchingDriver ?
                                <div className=' flex justify-center items-center w-full mt-2'>
                                    <ColorRing
                                        visible={true}
                                        height="40"
                                        width="40"
                                        ariaLabel="blocks-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="blocks-wrapper"
                                        colors={['#EE5C29', '#EE5C29', '#EE5C29', '#EE5C29', '#EE5C29']}
                                    />
                                </div> : 
                                <a onClick={
                                    () => {
                                        searchDrivers()
                                    }
                                } href='#avalibleDriver' className=' text-center mt-4 lg:w-1/3 lg:px-0 px-2 rounded-md py-2 border-2 border-background text-background bg-onBackground hover:bg-primary hover:text-background shadow-md '>
                                    Find Drivers
                                </a>
                        }
                        {/* {
            avalibleDrivers.length > 0 ?
            <AvalibleDriver 
                  driverDetails = {avalibleDrivers[0]}
                  sendRequest = {sendRequest}
                  one={true}
            /> : <></>
          } */}
                    </div>
                    <div className=' lg:order-2 order-1 relative lg:w-1/2 w-full overflow-hidden rounded-lg h-1/2'>
                        <div ref={mapContainer} className=" map-container" />
                        <div className=' sidebar flex lg:flex-row flex-col'>
                            <p className=' '>Distance : {(tripDistance / 1000).toFixed(2)} km</p>
                            <p className=' lg:mx-3 mx-0'>Duration : {`${(tripDuration / 3600) | 0}hr ${((tripDuration % 3600) / 60) | 0}min`}</p>
                        </div>
                    </div>
                </div>

            </section>
            <div className=" mt-4 container mx-auto hidden lg:flex flex-col lg:flex-row items-center px-4">
                {
                    avalibleDrivers.length > 0 ?
                        <>
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
                                    <SwiperSlide><img src={avalibleDrivers[0].profileImg} className=" object-cover w-full h-full" /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg0} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg1} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg2} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg3} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg4} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg5} className=" object-cover w-full h-full " /></SwiperSlide>
                                </Swiper>
                            </div>
                            <div className="lg:w-1/2 lg:order-1 order-2 flex flex-col">
                                <div className='flex'>
                                    <img src={avalibleDrivers[0].profileImg} className='rounded-full w-32 h-32 object-cover' />
                                    <div className=' ms-4 flex justify-center flex-col items-start'>
                                        <p className=' font-semibold text-lg '>{`${avalibleDrivers[0].firstName} ${avalibleDrivers[0].lastName}`}</p>
                                        <div className=' flex text-primary'>
                                            {avalibleDrivers[0].rating < 0.5 ? <BsStar /> : avalibleDrivers[0].rating < 1 ? <BsStarHalf /> : <BsStarFill />}
                                            {avalibleDrivers[0].rating < 1.5 ? <BsStar /> : avalibleDrivers[0].rating < 2 ? <BsStarHalf /> : <BsStarFill />}
                                            {avalibleDrivers[0].rating < 2.5 ? <BsStar /> : avalibleDrivers[0].rating < 3 ? <BsStarHalf /> : <BsStarFill />}
                                            {avalibleDrivers[0].rating < 3.5 ? <BsStar /> : avalibleDrivers[0].rating < 4 ? <BsStarHalf /> : <BsStarFill />}
                                            {avalibleDrivers[0].rating < 4.5 ? <BsStar /> : avalibleDrivers[0].rating < 5 ? <BsStarHalf /> : <BsStarFill />}
                                        </div>
                                        {
                                            avalibleDrivers[0].gender == 'Male' ?
                                                <div className=' flex items-center '>
                                                    <BsGenderMale className=' font-semibold mr-2' />
                                                    <p className=' font-semibold'>Male</p>
                                                </div> :
                                                avalibleDrivers[0].gender == 'Female' ?
                                                    <div className=' flex items-center '>
                                                        <BsGenderFemale className=' font-semibold mr-2' />
                                                        <p className=' font-semibold'>Female</p>
                                                    </div> :
                                                    <div className=' flex items-center '>
                                                        <BsGenderTrans className=' font-semibold mr-2' />
                                                        <p className=' font-semibold'>Transgender</p>
                                                    </div>
                                        }
                                        <p className=' text-2xl font-semibold drop-shadow-sm'>{`${(avalibleDrivers[0].route.duration / 3600) | 0}hr ${((avalibleDrivers[0].route.duration % 3600) / 60) | 0}min`}</p>
                                    </div>
                                </div>
                                <p className=' mt-3 fsM text-lg font-semibold'>Reviews:</p>
                                {
                                    avalibleDrivers[0].reviewList.map((review) => {
                                        return (
                                            <div className='my-2 mx-3 rounded-lg flex flex-col border-2 border-onBackground bg-primary bg-opacity-40'>
                                                <div className=' flex p-2 items-center'>
                                                    <img src={review.profileImg} className=' rounded-full w-14 h-14 object-cover' />
                                                    <div className='mx-4 flex flex-col'>
                                                        <p className=' fsM'>{`${review.firstName} ${review.lastName}`}</p>
                                                        <div className=' flex'>
                                                            {review.rating < 0.5 ? <BsStar /> : review.rating < 1 ? <BsStarHalf /> : <BsStarFill />}
                                                            {review.rating < 1.5 ? <BsStar /> : review.rating < 2 ? <BsStarHalf /> : <BsStarFill />}
                                                            {review.rating < 2.5 ? <BsStar /> : review.rating < 3 ? <BsStarHalf /> : <BsStarFill />}
                                                            {review.rating < 3.5 ? <BsStar /> : review.rating < 4 ? <BsStarHalf /> : <BsStarFill />}
                                                            {review.rating < 4.5 ? <BsStar /> : review.rating < 5 ? <BsStarHalf /> : <BsStarFill />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className=' text-sm font-thin text-justify px-4'>{review.review}</p>
                                            </div>
                                        )
                                    })
                                }
                                <div className='flex w-full justify-evenly items-center'>
                                    <div className=' flex items-center'>
                                        <button className=" rounded-full p-2 bg-primary text-background" onclick="handleHateClick()">
                                            <FaAngleLeft />
                                        </button>
                                        <button className=" ms-3 rounded-full p-3 bg-primary text-background" onclick="handleLoveClick()">
                                            <FaAngleRight />
                                        </button>
                                    </div>
                                    <button className=' rounded-md border-2 border-onBackground shadow-md text-sm antialiased p-2 bg-background hover:bg-primary hover:text-background text-onBackground my-2' onClick={
                                        () => {
                                            sendRequest(avalibleDrivers[0])
                                        }
                                    }>Send Request</button>
                                    <button className=' rounded-md border-2 border-onBackground shadow-md text-sm antialiased p-2 bg-background hover:bg-primary hover:text-background text-onBackground my-2' onClick={
                                        () => {
                                            cancelRequest()
                                        }
                                    }>Cancel Request</button>
                                </div>
                            </div>
                        </>
                        : <></>
                }


            </div>
            <div className=" lg:hidden mt-4 container mx-auto flex flex-col items-center px-4">
                {
                    avalibleDrivers.length > 0 ?
                        <>
                            <div className='flex my-4'>
                                <img src={avalibleDrivers[0].profileImg} className='rounded-full w-20 h-20 object-cover' />
                                <div className=' ms-4 flex justify-center flex-col items-start'>
                                    <p className=' font-semibold '>{`${avalibleDrivers[0].firstName} ${avalibleDrivers[0].lastName}`}</p>
                                    <div className=' flex text-primary text-sm'>
                                        {avalibleDrivers[0].rating < 0.5 ? <BsStar /> : avalibleDrivers[0].rating < 1 ? <BsStarHalf /> : <BsStarFill />}
                                        {avalibleDrivers[0].rating < 1.5 ? <BsStar /> : avalibleDrivers[0].rating < 2 ? <BsStarHalf /> : <BsStarFill />}
                                        {avalibleDrivers[0].rating < 2.5 ? <BsStar /> : avalibleDrivers[0].rating < 3 ? <BsStarHalf /> : <BsStarFill />}
                                        {avalibleDrivers[0].rating < 3.5 ? <BsStar /> : avalibleDrivers[0].rating < 4 ? <BsStarHalf /> : <BsStarFill />}
                                        {avalibleDrivers[0].rating < 4.5 ? <BsStar /> : avalibleDrivers[0].rating < 5 ? <BsStarHalf /> : <BsStarFill />}
                                    </div>
                                    {
                                        avalibleDrivers[0].gender == 'Male' ?
                                            <div className=' flex items-center '>
                                                <BsGenderMale className=' font-semibold mr-2' />
                                                <p className=' font-semibold'>Male</p>
                                            </div> :
                                            avalibleDrivers[0].gender == 'Female' ?
                                                <div className=' flex items-center '>
                                                    <BsGenderFemale className=' font-semibold mr-2' />
                                                    <p className=' font-semibold'>Female</p>
                                                </div> :
                                                <div className=' flex items-center '>
                                                    <BsGenderTrans className=' font-semibold mr-2' />
                                                    <p className=' font-semibold'>Transgender</p>
                                                </div>
                                    }
                                    <p className=' text-xl font-semibold drop-shadow-sm'>{`${(avalibleDrivers[0].route.duration / 3600) | 0}hr ${((avalibleDrivers[0].route.duration % 3600) / 60) | 0}min`}</p>
                                </div>
                            </div>
                            <div className='flex justify-center items-center w-full h-1/2 rounded-lg overflow-hidden'>
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
                                    <SwiperSlide><img src={avalibleDrivers[0].profileImg} className=" object-cover w-full h-full" /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg0} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg1} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg2} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg3} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg4} className=" object-cover w-full h-full " /></SwiperSlide>
                                    <SwiperSlide><img src={avalibleDrivers[0].carImg5} className=" object-cover w-full h-full " /></SwiperSlide>
                                </Swiper>
                            </div>
                            <p className=' mt-3 fsM text-lg font-semibold w-full text-start'>Reviews:</p>
                            {
                                avalibleDrivers[0].reviewList.map((review) => {
                                    return (
                                        <div className='my-2 rounded-lg flex flex-col border-2 border-onBackground bg-primary bg-opacity-40'>
                                            <div className=' flex p-2 items-center'>
                                                <img src={review.profileImg} className=' rounded-full w-14 h-14 object-cover' />
                                                <div className='mx-4 flex flex-col'>
                                                    <p className=' fsM'>{`${review.firstName} ${review.lastName}`}</p>
                                                    <div className=' flex text-sm text-primary'>
                                                        {review.rating < 0.5 ? <BsStar /> : review.rating < 1 ? <BsStarHalf /> : <BsStarFill />}
                                                        {review.rating < 1.5 ? <BsStar /> : review.rating < 2 ? <BsStarHalf /> : <BsStarFill />}
                                                        {review.rating < 2.5 ? <BsStar /> : review.rating < 3 ? <BsStarHalf /> : <BsStarFill />}
                                                        {review.rating < 3.5 ? <BsStar /> : review.rating < 4 ? <BsStarHalf /> : <BsStarFill />}
                                                        {review.rating < 4.5 ? <BsStar /> : review.rating < 5 ? <BsStarHalf /> : <BsStarFill />}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className=' text-sm font-thin text-justify px-3'>{review.review}</p>
                                        </div>
                                    )
                                })
                            }
                            <div className='flex w-full flex-col justify-evenly items-center'>
                                <div className=' flex items-center'>
                                    <button className=" rounded-full p-2 bg-primary text-background" onclick="handleHateClick()">
                                        <FaAngleLeft />
                                    </button>
                                    <button className=" ms-3 rounded-full p-3 bg-primary text-background" onclick="handleLoveClick()">
                                        <FaAngleRight />
                                    </button>
                                </div>
                            </div>
                        </>
                        : <></>
                }


            </div>
            {
                avalibleDrivers.length > 0 ?
                    <div className=' container mx-auto flex lg:flex-row flex-col justify-center items-center bg-onBackground rounded-lg my-2'>
                        <div className=' lg:order-1 order-2 lg:w-1/2 w-full h-full bg-onBackground lg:py-4 my-2 rounded-md flex flex-col justify-center items-center'>
                            <p className='  m-3 text-4xl drop-shadow-md font-semibold text-background'>Seats <span className=' text-primary'>Status</span></p>
                            <div className=' relative'>
                                <img src={chooseSeat} className=' h-96 -translate-x-5' />
                                <div className=' absolute top-40 left-[53px]'>
                                    <div className=' flex gap-[10px]'>
                                        <img src={avalibleDrivers[0].profileImg} className='  w-10 h-10 rounded-full object-cover' />
                                        <button onClick={() => { setSelectedSeat(1) }} className={` transition-all duration-500 w-10 h-10 rounded-full flex items-center justify-center ${selectedSeat == 1 ? 'bg-green-400' : 'bg-primary'}`}>
                                            {
                                                selectedSeat == 1 ?
                                                    <MdDone className=' text-white' /> : <BiPlus className=' text-white' />
                                            }
                                        </button>
                                    </div>
                                    <div className=' flex gap-[10px] mt-6'>
                                        <button onClick={() => { setSelectedSeat(2) }} className={` transition-all duration-500  w-10 h-10 rounded-full flex items-center justify-center ${selectedSeat == 2 ? 'bg-green-400' : 'bg-primary'}`}>
                                            {
                                                selectedSeat == 2 ?
                                                    <MdDone className=' text-white' /> : <BiPlus className=' text-white' />
                                            }
                                        </button>
                                        <button onClick={() => { setSelectedSeat(3) }} className={` transition-all duration-500  w-10 h-10 rounded-full flex items-center justify-center ${selectedSeat == 3 ? 'bg-green-400' : 'bg-primary'}`}>
                                            {
                                                selectedSeat == 3 ?
                                                    <MdDone className=' text-white' /> : <BiPlus className=' text-white' />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className=' flex justify-evenly items-center w-full'>
                                <button className=' rounded-md border-2 border-background shadow-md text-sm antialiased p-2 bg-onBackground hover:bg-primary hover:text-background text-background my-2' onClick={
                                    () => {
                                        sendRequest(avalibleDrivers[0])
                                    }
                                }>Send Request</button>
                                <button className=' rounded-md border-2 border-background shadow-md text-sm antialiased p-2 bg-onBackground hover:bg-primary hover:text-background text-background my-2' onClick={
                                    () => {
                                        cancelRequest()
                                    }
                                }>Cancel Request</button>
                            </div>
                        </div>
                        <div className=' lg:order-2 order-1 w-full lg:w-1/2 flex flex-col items-center justify-center '>
                            <p className='  m-3 lg:text-4xl text-2xl drop-shadow-md font-semibold text-background'>{avalibleDrivers[0].firstName} <span className=' text-primary'>{avalibleDrivers[0].lastName}</span></p>
                            <div class="card-swiper py-4 flex flex-col justify-center items-center">
                                <div class="card-groups">
                                    {
                                        avalibleDrivers.length > 0 ?
                                            avalibleDrivers.map((driverDetails) => {
                                                return (
                                                    <div class="card-group" data-index="0" data-status="active">
                                                        <div class="little-card card">
                                                            <img src={driverDetails.carImg0} className=' w-full h-full object-cover' />
                                                        </div>
                                                        <div class="big-card card">
                                                            <img src={driverDetails.carImg1} className=' w-full h-full object-cover' />
                                                        </div>
                                                        <div class="little-card card">
                                                            <img src={driverDetails.carImg2} className=' w-full h-full object-cover' />
                                                        </div>
                                                        <div class="big-card card">
                                                            <img src={driverDetails.carImg3} className=' w-full h-full object-cover' />
                                                        </div>
                                                        <div class="little-card card">
                                                            <img src={driverDetails.carImg4} className=' w-full h-full object-cover' />
                                                        </div>
                                                        <div class="big-card card">
                                                            <img src={driverDetails.carImg0} className=' w-full h-full object-cover' />
                                                        </div>
                                                        <div class="little-card card">
                                                            <img src={driverDetails.carImg5} className=' w-full h-full object-cover' />
                                                        </div>
                                                        <div class="big-card card">
                                                            <img src={driverDetails.profileImg} className=' w-full h-full object-cover' />
                                                        </div>
                                                    </div>
                                                )
                                            }) :
                                            <div className=' relative h-full w-full flex flex-col justify-center items-center'>
                                                <div className=' flex w-full justify-center items-center relative'>
                                                    <img src={logo} />
                                                    {
                                                        searchingDriver ?
                                                            <div className=' flex justify-center items-center w-full absolute top-full'>
                                                                <ColorRing
                                                                    visible={true}
                                                                    height="40"
                                                                    width="40"
                                                                    ariaLabel="blocks-loading"
                                                                    wrapperStyle={{}}
                                                                    wrapperClass="blocks-wrapper"
                                                                    colors={['#EE5C29', '#EE5C29', '#EE5C29', '#EE5C29', '#EE5C29']}
                                                                />
                                                            </div> : <></>
                                                    }
                                                </div>
                                            </div>
                                    }
                                </div>
                                {
                                    avalibleDrivers.length > 0 ?
                                        <div class="card-swiper-buttons flex w-full justify-center items-center mt-4">
                                            <p className=' text-xl fsM text-background me-4' >Change <span className=' text-primary'>Driver</span> : </p>
                                            <button className=" rounded-full p-2 bg-primary text-background" onclick="handleHateClick()">
                                                <FaAngleLeft />
                                            </button>
                                            <button className=" ms-3 rounded-full p-3 bg-primary text-background" onclick="handleLoveClick()">
                                                <FaAngleRight />
                                            </button>
                                        </div> : <></>
                                }

                            </div>
                        </div>
                    </div>
                    : <></>
            }
            {/* <section id='avalibleDriver' className='screenHeight p-4 w-full flex flex-col items-center bg-white '>
                <p className=' my-3 text-4xl drop-shadow-md font-semibold text-black'>Avalible Drivers</p>
                <div className=' h-full w-full flex justify-center items-center'>
                    <div className=' gap-3 flex flex-wrap justify-start'>
                        {
                            avalibleDrivers.length > 0 ?
                                avalibleDrivers.map((driverDetails) => {
                                    return (
                                        <AvalibleDriver
                                            driverDetails={driverDetails}
                                            sendRequest={sendRequest}
                                            request={request}
                                            cancelRequest={cancelRequest}
                                        />
                                    )
                                }) :
                                !searchingDriver ?
                                    <div className=' flex flex-col items-center justify-center'>
                                        <p className=' font-semibold text-xl antialiased'>No Driver Avalible</p>
                                    </div> :
                                    <div className=' flex flex-col items-center justify-center'>
                                        <iframe src="https://embed.lottiefiles.com/animation/75259"></iframe>
                                        <p className=' font-semibold text-xl antialiased'>Searching ...</p>
                                    </div>
                        }
                    </div>
                </div>
            </section> */}
        </div>
    );
}

export default FindRide;