import Button from "./Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export interface CardProps {
    name:string;
    total : number;
    createdAt :string;
    id : string;
    
}
const Card = ({name,total,createdAt,id} : CardProps)=>{
    const navigate = useNavigate(); 
    const clickhandler = async()=>{
        try {

            localStorage.setItem('groupId',id);
            localStorage.setItem('groupName',name);
            localStorage.setItem('groupTotal', total.toString());
            const userId = localStorage.getItem('userId');
            const response = await axios.post(`http://localhost:8787/api/v1/group/${id}/${userId}`)
            console.log(response);
            navigate('/group');
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    }

    return( 
    <div className="w-full ">
        <div className="flex justify-between ">
                <div className="pb-1 font-semibold">
                {name}
                </div>
                <div className="text-green-700 font-semibold ">
                    {total}
                </div>
        </div>
                <div>
                {createdAt.slice(0, 10).split('-').reverse().join("/")}
                </div>
                <div>
                    <Button name="Open Group" click={clickhandler}></Button>
                </div>
        
    </div>)
}
export default Card;