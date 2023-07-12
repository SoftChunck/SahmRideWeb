import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'
import { Button, PageButton } from './shared/Button'
import { classNames } from './shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './shared/Icons'
import Modal from './Model'
import { BiQuestionMark } from 'react-icons/bi'
import { getDownloadURL, ref, uploadBytes, } from 'firebase/storage';
import { realtime, firestore, storage } from '../firebase'
import { useState } from "react";
import { BsGenderFemale, BsGenderMale, BsGenderTrans, BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';

import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import { MdClose } from 'react-icons/md'
import { toast } from 'react-toastify'

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function StatusPill({ value }) {
  const status = value ? value.toLowerCase() : "unknown";

  return (
    <span
      className={
        classNames(
          "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
          status.startsWith("active") ? "bg-green-100 text-green-800" : null,
          status.startsWith("approved") ? "bg-green-100 text-green-800" : null,
          status.startsWith("inactive") ? "bg-yellow-100 text-yellow-800" : null,
          status.startsWith("pending") ? "bg-yellow-100 text-yellow-800" : null,
          status.startsWith("offline") ? "bg-red-100 text-red-800" : null,
        )
      }
    >
      {status}
    </span>
  );
};

export function AvatarCell({ value, column, row }) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <img className="h-10 w-10 rounded-full" src={row.original[column.imgAccessor]} alt="" />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{row.original[column.emailAccessor]}</div>
      </div>
    </div>
  )
}



function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({
    columns,
    data,
  },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination,  // new
  )

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
  const [profile, setProfile] = useState(undefined)

  const [userData, setUserData] = useState(undefined)
  const [userUid,setUserUid] = useState(undefined)
  const [viewUser, setViewUser] = useState(false)

  const approveUser = async ()=>{
    await updateDoc(doc(firestore,`users/${userUid}`),{
      driver:true
    })
    toast('User Approved')
  }
  const rejectUser = async ()=>{
    await updateDoc(doc(firestore,`users/${userUid}`),{
      driver:false,
      cnic:null,
      driverRequest:'rejected'
    })
    toast('User Rejected')
  }
  const fetchData = async (setter, path, uid) => {
    const pic = await getDownloadURL(ref(storage, `images/${uid}/${path}`))
    if (pic) {
      setter(pic)
    }
  }
  const fetchUserDetails = async (uid) => {
    setUserUid(uid)

    getDoc(doc(firestore, `users/${uid}`))
      .then((us) => {
        setUserData(us.data())
        setViewUser(true)
      })

    fetchData(setProfile, 'profile', uid)
    fetchData(setCnicFront, 'cnic/0', uid)
    fetchData(setCnicBack, 'cnic/1', uid)
    fetchData(setdrivingLicenseFront, 'drivingLicense/0', uid)
    fetchData(setdrivingLicenseBack, 'drivingLicense/1', uid)
    fetchData(setCar0, 'car/0', uid)
    fetchData(setCar1, 'car/1', uid)
    fetchData(setCar2, 'car/2', uid)
    fetchData(setCar3, 'car/3', uid)
    fetchData(setCar4, 'car/4', uid)
    fetchData(setCar5, 'car/5', uid)
  }


  // Render the UI for your table
  return (
    <>
      <div className=" ms-4 sm:flex sm:gap-x-2 lg:overflow-hidden">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>
      {/* table */}
      <div className="m-4 flex flex-col">
        <div className="-my-2 overflow-x-hidden -mx-4 sm:-mx-6 lg:-mx-8 w-full">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table {...getTableProps()} className="min-w-full divide-y divide-primary">
                <thead className=" bg-onBackground">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                          <div className="flex items-center justify-between">
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? <SortDownIcon className="w-4 h-4 text-background" />
                                  : <SortUpIcon className="w-4 h-4 text-background" />
                                : (
                                  <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row, i) => {  // new
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()} onClick={() => {
                        if (row.original.application) {
                          fetchUserDetails(row.original.email)
                        }
                      }}>
                        {row.cells.map(cell => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap"
                              role="cell"
                            >
                              {cell.column.Cell.name === "defaultRenderer"
                                ? <div className="text-sm text-gray-500">{cell.render('Cell')}</div>
                                : cell.render('Cell')
                              }
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="px-4 py-3 w-3/4 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={state.pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => nextPage()}
                disabled={!canNextPage
                }>
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
      {
        viewUser ? <Modal element={
          <div className=' bg-background flex flex-col p-4 h-4/5 overflow-y-auto'>
            <div className=' flex justify-end'>
              <MdClose className=' text-2xl text-onBackground font-semibold' onClick={() => {
                setViewUser(false)
              }} />
            </div>
            <div className='flex'>
              <img src={profile} className='rounded-full w-32 h-32 object-cover' />
              <div className=' ms-4 flex justify-center flex-col items-start'>
                <p className=' font-semibold text-lg '>{`${userData.firstName} ${userData.lastName}`}</p>
                <div className=' flex text-primary'>
                  {userData.rating < 0.5 ? <BsStar /> : userData.rating < 1 ? <BsStarHalf /> : <BsStarFill />}
                  {userData.rating < 1.5 ? <BsStar /> : userData.rating < 2 ? <BsStarHalf /> : <BsStarFill />}
                  {userData.rating < 2.5 ? <BsStar /> : userData.rating < 3 ? <BsStarHalf /> : <BsStarFill />}
                  {userData.rating < 3.5 ? <BsStar /> : userData.rating < 4 ? <BsStarHalf /> : <BsStarFill />}
                  {userData.rating < 4.5 ? <BsStar /> : userData.rating < 5 ? <BsStarHalf /> : <BsStarFill />}
                </div>
                {
                  userData.gender == 'Male' ?
                    <div className=' flex items-center '>
                      <BsGenderMale className=' font-semibold mr-2' />
                      <p className=' font-semibold'>Male</p>
                    </div> :
                    userData.gender == 'Female' ?
                      <div className=' flex items-center '>
                        <BsGenderFemale className=' font-semibold mr-2' />
                        <p className=' font-semibold'>Female</p>
                      </div> :
                      <div className=' flex items-center '>
                        <BsGenderTrans className=' font-semibold mr-2' />
                        <p className=' font-semibold'>Transgender</p>
                      </div>
                }
              </div>
            </div>
            <p className=" my-2 fsM font-bold text-xl">CNIC Pics (Front & Back) </p>
            <div className=" flex flex-wrap py-2 gap-4 items-center justify-center md:items-start md:justify-start">
              <label for="cnicFront" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {cnicFront == null ?
                  <BiQuestionMark /> :
                  <img src={cnicFront} className="w-44 h-44 object-cover " />} </label>

              <label for="cnicBack" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  cnicBack == null ?
                    <BiQuestionMark /> :
                    <img src={cnicBack} className="w-44 h-44 object-cover " />
                }
              </label>
            </div>
            <p className=" my-2 fsM font-bold text-xl">Driving License Pics (Front & Back) </p>
            <div className=" flex flex-wrap py-2 gap-4 items-center justify-center md:items-start md:justify-start">
              <label for="drivingLicenseFront" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  drivingLicenseFront == null ?
                    <BiQuestionMark /> :
                    <img src={drivingLicenseFront} className="w-44 h-44 object-cover " />
                }
              </label>

              <label for="drivingLicenseBack" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  drivingLicenseBack == null ?
                    <BiQuestionMark /> :
                    <img src={drivingLicenseBack} className="w-44 h-44 object-cover " />

                }
              </label>
            </div>
            <p className=" my-2 fsM font-bold text-xl">Vehicle Pics </p>
            <div className=" flex flex-wrap py-2 gap-4 items-center justify-center md:items-start md:justify-start">

              <label for="car0" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  car0 == null ?
                    <BiQuestionMark /> :
                    <img src={car0} className="w-44 h-44 object-cover " />
                }
              </label>

              <label for="car1" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  car1 == null ?
                    <BiQuestionMark /> :
                    <img src={car1} className="w-44 h-44 object-cover " />
                }
              </label>
              <label for="car2" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  car2 == null ?
                    <BiQuestionMark /> :
                    <img src={car2} className="w-44 h-44 object-cover " />
                }
              </label>
              <label for="car3" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  car3 == null ?
                    <BiQuestionMark /> :
                    <img src={car3} className="w-44 h-44 object-cover " />
                }
              </label>
              <label for="car4" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  car4 == null ?
                    <BiQuestionMark /> :
                    <img src={car4} className="w-44 h-44 object-cover " />
                }
              </label>
              <label for="car5" id="civi_select_avatar" class="img-company flex justify-center items-center w-44 h-44 bg-slate-500 " style={{ position: 'relative', zIndex: '1', }}>
                {
                  car5 == null ?
                    <BiQuestionMark /> :
                    <img src={car5} className="w-44 h-44 object-cover " />
                }
              </label>
            </div>
            <div>
              <button className=' btn bg-green-500 text-white' onClick={()=>{approveUser()}}>Approve</button>
              <button className=' btn bg-red-500 text-background ms-3' onClick={()=>{rejectUser()}}>Reject</button>
            </div>
          </div>
        } /> : <></>
      }
    </>
  )
}

export default Table;