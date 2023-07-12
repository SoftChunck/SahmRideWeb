import React, { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl, { GeolocateControl } from 'mapbox-gl';
import { User } from '../Objects/User';
import { getDownloadURL, ref as imgRef } from 'firebase/storage';
import { realtime, firestore, storage } from '../firebase'
import { get, ref, set, onChildChanged, onValue } from 'firebase/database';
import { getDoc, getDocs, doc, setDoc, collection, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Chat } from 'stream-chat-react';
import ChatComp from '../Components/Chat';
import Model from '../Components/Model';
import DialogBox from '../Components/DialogBox';
var DriverMarker = undefined
var geoLocation = new GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
})
const Trip = () => {
    const [driverLocation, setDriverLocation] = useState([-122.4194, 37.7749])
    
    const [pickupCoordinates, setPickupCoordinates] = useState([-122.4194, 37.7749])
    const [waypoints, setWaypoints] = useState('')
    const [user, setUser, selected, setSelected] = useContext(User)
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [zoom, setZoom] = useState(9);
    const [tripDuration, setTripDuration] = useState(0)
    const [tripDistance, setTripDistance] = useState(0)
    const navigate = useNavigate()
    const [driverImg,setDriverImg] = useState(undefined)

    const fetchRideDetails = async () => {
        var users = localStorage.getItem('user')
        if (users) {
            setUser(JSON.parse(users))
        }
        users = JSON.parse(users)
        console.log(users)
        // console.log(token)
        var rideDetails = await getDoc(doc(firestore, 'ridesDetail', users.uid))
        rideDetails = rideDetails.data()
        if (rideDetails == undefined) {
            navigate('/')
        }
        else {
            if (rideDetails.request == 'pending') {
                navigate('/findride')
            }
            else {
                var driverData = await get(ref(realtime, `driversLocation/${rideDetails.driverUid}`))
                onValue(ref(realtime, `driversLocation/${rideDetails.driverUid}`), (newLocation) => {
                    newLocation = newLocation.val()
                    setDriverLocation([newLocation.lng, newLocation.lat])
                })
                driverData = driverData.val()
                setDriverLocation([driverData.lng, driverData.lat])
                var query = ""
                driverData.genratedWaypoints.map((coardinates, index) => {
                    if (index != 0) {
                        new mapboxgl.Marker({
                            color: "#000000",
                            draggable: false
                        }).setLngLat([coardinates.lng, coardinates.lat])
                            .addTo(map.current);
                        query = `${query} ${coardinates.lng},${coardinates.lat};`
                    }
                })
                query = query.slice(0, -1)
                setWaypoints(query)
                // console.log(driverData.genratedWaypoints)
            }
        }
    }
    //Fetching Ride Details From DB
    useEffect(() => {
        fetchRideDetails()
    }, [])

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
            setPickupCoordinates([cord.lngLat.lng, cord.lngLat.lat])
            // setDestinationCoordinates([cord.lngLat.lng, cord.lngLat.lat])                
        });
    });

    // useEffect(() => {
    //     if (map.current) {
    //         map.current.setCenter(driverLocation)
    //         if (PickupMarker) {
    //             PickupMarker.setLngLat(driverLocation);                    
    //         }
    //         else {
    //             PickupMarker = new mapboxgl.Marker({
    //                 color: "#000000",
    //                 draggable: false
    //             }).setLngLat(driverLocation)
    //                 .addTo(map.current);
    //                     PickupMarker.on('drag', () => {
    //                         if (DestinationMarker) {
    //                             getRoute()
    //                         }
    //                     })
    //         }
    //         if (pickup && destination) {
    //             getRoute()
    //         }
    //     }
    // }, [pickupCoordinates, destinationCoordinates])

    useEffect(() => {
        map.current.setCenter(driverLocation)
        if (DriverMarker) {
            DriverMarker.setLngLat(driverLocation);
        }
        else {
            const el = document.createElement('div');
            el.className = 'marker';
            DriverMarker = new mapboxgl.Marker(
                // {
                //     color: "#EE5C29",
                //     draggable: false
                // }
                el
            ).setLngLat(driverLocation)
                .addTo(map.current);
        }
        getRoute(waypoints)
    }, [driverLocation])
    const getRoute = async function (locations) {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${driverLocation[0]},${driverLocation[1]};${locations}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
                    'line-color': '#2a9df4',
                    'line-width': 5,
                    // 'line-opacity': 0.75
                }
            });
        }
    }
    return (
        <>
            <div className=" container mx-auto">
                <div className=' relative overflow-hidden rounded-lg my-2'>
                    <div ref={mapContainer} className=" map-container" />
                    <div className=' sidebar flex lg:flex-row flex-col'>
                        <p className=' '>Distance : {(tripDistance / 1000).toFixed(2)} km</p>
                        <p className=' lg:mx-3 mx-0'>Duration : {`${(tripDuration / 3600) | 0}hr ${((tripDuration % 3600) / 60) | 0}min`}</p>
                    </div>
                </div>
                <div className=' rounded-md overflow-hidden my-2'>
                    {/* <div className=' bg-primary flex p-3'>
                        <img src={} />
                    </div> */}
                    <ChatComp />
                </div>
            </div>
        </>
    );
}

export default Trip;