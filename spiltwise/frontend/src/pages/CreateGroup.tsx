
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import axios from "axios";
import { useState} from "react";
// import { useNavigate } from "react-router-dom";
const CreateGroup=()=>{
    const [name, setName] = useState("");
    // const navigate = useNavigate();
    const handleCreateGroup = async ()=>{
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8787/api/v1/group/create', {
                name
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Group created successfully:', response.data);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    }
    return(<>
        <div className="flex items-center  mx-auto my-80 justify-center flex-col  ">
        <div className="w-fit my-5 ">
            <Input label="Name" type="string" change={(e)=>setName(e.target.value)}></Input>
            </div>
            <div className="w-fit ">
        <Button name="Create Group" click={handleCreateGroup}></Button>
        </div>
        </div>
    </>)
}
export default CreateGroup