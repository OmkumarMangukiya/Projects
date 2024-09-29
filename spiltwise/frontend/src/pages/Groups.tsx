interface GroupProps {
    Name: string;
    createdAt: string; 
    TotalSpent: number;
    id : string;
  }
import Card from "../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";
// import Skeleton from "../components/SkeletonGroup";

export default function Component() {
  const [groups, setGroups] = useState<GroupProps[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get("http://localhost:8787/api/v1/group/opengroup", {
          headers: {
            'token': `Bearer ${token}`,
          }
        });
        setGroups(response.data);
      } catch (error) {
        console.error("There was an error fetching the groups!", error);
      } finally {
        // setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-6">Groups</h1>
      <div className="space-y-4">
        {
          groups.map((group, index) => (
            <div className="p-4 bg-background border rounded-md shadow-2xl" key={index}>
              <div className="flex items-center justify-between">
                <Card name={group.Name} total={group.TotalSpent} createdAt={group.createdAt} id={group.id} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}