import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Group from "../components/Group.tsx";
import axios from 'axios';
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";

interface GroupProps {
    Name: string;
    createdAt: string; 
    TotalSpent: number;
  }

const Groups = () => {
    const[groups,setGroups] = useState<GroupProps[]>([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8787/api/v1/group/opengroup");
                setGroups(response.data);
            } catch (error) {
                console.error("There was an error fetching the groups!", error);
            }
        }
        fetchData();
    }, []);
    const handleCreateGroup = async ()=>{
        axios.post(`http://localhost:8787/api/v1/group/create`, { name })
            .then(response => {
                console.log("Sign ucp successful", response);
                setGroups(prevGroups => [...prevGroups, response.data]);
                location.reload();
            })
            .catch(error => {
                console.error("There was an error signing up!", error);
            });
    }
    return (
        <>
            {groups.map((element: GroupProps) => (
                <Group name={element.Name}  createdAt={element.createdAt} TotalSpent={element.TotalSpent} />
            ))}
            <div className="w-fit flex justify-center">
            <Input label="Name" type="string" change={(e)=>setName(e.target.value)}></Input>
            </div>
            <Button click={handleCreateGroup} name="Create Group"></Button>
        </>
    );
}

export default Groups;