interface GroupProps {
    Name: string;
    createdAt: string; 
    TotalSpent: number;
  }

import Card from "../components/Card";
  import { useEffect,useState } from "react";
// import {useNavigate} from "react-router-dom"
import axios from "axios";
import CreateGroup from "./CreateGroup";
export default function Component() {
    const[groups,setGroups] = useState<GroupProps[]>([]);
    
    // const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("http://localhost:8787/api/v1/group/opengroup", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setGroups(response.data);
            } catch (error) {
                console.error("There was an error fetching the groups!", error);
            }
        }
        fetchData();
    }, []);
      
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Groups</h1>
      <div className="space-y-4">
        {groups.map((group) => (
          <div className="p-4 bg-background border rounded-lg">
            <div className="flex items-center justify-between">
              <Card name={group.Name} total={group.TotalSpent} createdAt={group.createdAt}></Card>
              
            </div>
            
            
          </div>
        ))}
      </div>
      <CreateGroup></CreateGroup>
    </div>
 
     )
}