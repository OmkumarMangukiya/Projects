import Button from "./Button";
import { useNavigate } from "react-router-dom";
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