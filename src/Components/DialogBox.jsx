import Model from "./Model";
import success from '../Assets/success.gif'
import { MdClose } from "react-icons/md";
import { useState } from "react";
const DialogBox = ({msg}) => {
    const [Display,setDisplay] = useState(true)
    if(Display){
        return (
            <Model
                element={
                    <div className=" flex justify-center items-center flex-col m-4 overflow-hidden bg-background rounded-md">
                        <MdClose className=" m-2 ms-auto text-lg text-onBackground " onClick={()=>{setDisplay(false)}} />
                        <img src={success} className="  w-72 aspect-auto" />
                        <p>{msg}</p>
                    </div>
                }
            />
        );
    }
    else{
        return null
    }
}

export default DialogBox;