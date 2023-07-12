const Model = ({element}) => {
    return ( 
        <div className=" z-50 flex justify-center items-center fixed top-0 left-0 bg-onBackground bg-opacity-40 w-screen h-screen overflow-hidden">
           {
            element
           }
        </div>
     );
}
 
export default Model;