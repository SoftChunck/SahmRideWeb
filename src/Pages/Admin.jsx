import { FaUsers } from "react-icons/fa";
import { MdApproval, MdEditDocument } from "react-icons/md";
import DarkLogo from '../Assets/Logo/DarkLogo.png'
import React, { useEffect, useState } from 'react'
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from '../Components/Table'
import { getDownloadURL, ref as imgRef } from 'firebase/storage';
import { realtime, firestore, storage } from '../firebase'
import { get, ref, set, onChildChanged, onValue } from 'firebase/database';
import { getDoc, getDocs, doc, setDoc, collection, deleteDoc, onSnapshot } from 'firebase/firestore';
const Admin = () => {
    const columns = React.useMemo(() => [
        {
            Header: "Name",
            accessor: 'name',
            // Cell: AvatarCell,
            // imgAccessor: "imgUrl",
            emailAccessor: "email",
        },
        
        {
            Header: "Gender",
            accessor: 'gender',
        },
        {
            Header: "Status",
            accessor: 'status',
            Cell: StatusPill,
        },
        {
            Header: "Role",
            accessor: 'role',
            Filter: SelectColumnFilter,  // new
            filter: 'includes',
        },
    ], [])
    const [data,setData] = useState([])
    const [applixcationData,setApplicationData] = useState([])
    // const data = React.useMemo(() => getData(), [])
    const readUsers = async () => {
        var usersData = []
        await getDocs(collection(firestore, 'users'))
            .then((users) => {
                users.docs.map(async (user, index) => {
                    // getDownloadURL(imgRef(storage,`images/${user.id}/profile`))
                    // .then((img)=>{
                    //     console.log(img)
                    //     usersData.push(
                    //         {
                    //             name: `${user.data().firstName} ${user.data().lastName}`,
                    //             email: `${user.id}`,
                    //             title: 'Regional Paradigm Technician',
                    //             department: 'Optimization',
                    //             status: 'Active',
                    //             role: 'Admin',
                    //             age: 27,
                    //             imgUrl: img,
                    //         }
                    //     )
                    // })
                    // .catch((e)=>{
                    //     // console.log(e.code)
                    //     usersData.push(
                    //         {
                    //             name: `${user.data().firstName} ${user.data().lastName}`,
                    //             email: `${user.id}`,
                    //             title: 'Regional Paradigm Technician',
                    //             department: 'Optimization',
                    //             status: 'Active',
                    //             role: 'Admin',
                    //             age: 27,
                    //             imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
                    //         }
                    //     )
                    // })     
                    usersData.push(
                                {
                                    application:false,
                                    name: `${user.data().firstName} ${user.data().lastName}`,
                                    email: `${user.id}`,
                                    gender: `${user.data().gender}`,
                                    status: `${user.data().driver ? 'Active' : 'Inactive'}`,
                                    role: `${user.data().driver ? 'Driver' : 'User'}`,
                                    // imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
                                }
                            )            
                    
                })
            })
            setData(usersData)
        return [...usersData]
    }
    const readApplications = async () => {
        var usersData = []
        await getDocs(collection(firestore, 'users'))
            .then((users) => {
                users.docs.map((user,index)=>{
                    if(user.data().driver == true || user.data().cnic != undefined){
                        usersData.push(
                            {
                                application : true,
                                name: `${user.data().firstName} ${user.data().lastName}`,
                                email: `${user.id}`,
                                gender: `${user.data().gender}`,
                                status: `${user.data().driver ? 'Approved' : 'Pending'}`,
                                role: `${user.data().driver ? 'Driver' : 'User'}`,
                                // imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
                            }
                        )   
                    } 
                })
            })
            setApplicationData(usersData)
    }

    const [selected,setSelected] = useState(0)

    useEffect(()=>{
        readUsers()
        readApplications()
    },[])
    
    return (
        <div className=" bg-background w-screen h-screen flex">
            <div className=" h-full bg-onBackground w-1/4  flex-col items-center flex">
                <img src={DarkLogo} className=" py-4  px-10" />
                <p className=" text-5xl text-primary fsM my-5">Admin</p>
                <ul className=" w-full">
                    <li onClick={()=>{
                        setSelected(0)
                    }} className={` w-full hover:bg-primary group cursor-pointer ${selected == 0 ? 'bg-primary' : ' bg-transparent'}`}><a className=" text-background group-hover:text-background p-4 flex items-center text-sm"><FaUsers className=" text-2xl mx-4" />All Users</a></li>
                    <li onClick={()=>{
                        setSelected(1)
                    }} className={` w-full hover:bg-primary group cursor-pointer ${selected == 1 ? 'bg-primary' : ' bg-transparent'}`}><a className=" text-background group-hover:text-background p-4 flex items-center text-sm"><MdEditDocument className=" text-2xl mx-4" />Applications</a></li>
                 </ul>
            </div>
            <div className="flex w-full flex-col mt-3">
                {
                    selected == 0 ? <Table columns={columns} data={data} /> : <></>                    
                }
                {
                    selected == 1 ? <Table columns={columns} data={applixcationData} /> : <></>
                }
            </div>
        </div>
    );
}

export default Admin;