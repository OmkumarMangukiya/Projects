import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button.tsx";
import UserInGroupComponent from "../components/userInGroup.tsx";
import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
const Group = () => {
  // interface GroupType {
  //     Name: string;
  //     createdAt: string;
  //     TotalSpent: number;
  //     id: string;
  // }
  interface User {
    username: string;
    MoneyLent: number;
    MoneyOwe: number;
  }
  interface ExpenseProps {
    Name: string;
    createdAt: string;
    DivideTo: { [key: string]: number }[];
    createdBy: string;
    Total: number;
  }

  const [expense, setExpense] = useState<ExpenseProps[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // const [isLoading,setisLoading] = useState(true);
  const groupName = localStorage.getItem("groupName");
  
  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("groupId");
      try {
        if (id) {
          const response = await axios.get(
            `http://localhost:8787/api/v1/group/opengroup/id?id=${id}`
          );
          setExpense(response.data);
          console.log(response.data)
        } else {
          console.error("Group ID is not available ");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      try {
        const response = await axios.get(
          "http://localhost:8787/api/v1/group/users",
          {
            headers: {
              groupid: id,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      //  finally {
      //     // setisLoading(false);
      // }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-black py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold text-green-500">{groupName}</h1>
      </header>
      <div className="flex flex-row bg-green-100 gap-9 flex-1 pl-80">
        <div className="basis-3/4 flex justify-center items-center">
          <div className="flex flex-col w-full max-w-md">
            {expense.map((ex, index) => (
              <ExpenseCard
                key={index}
                Name={ex.Name}
                createdAt={ex.createdAt.slice(0, 10).split("-").reverse().join("-")}
                DivideTo={Object.entries(ex.DivideTo).map(([key, value]) => `${key}: ${value}`).join(", ")}
                createdBy={ex.createdBy}
                Total={ex.Total}
              />
            ))}
            <div className="flex justify-center py-7">
              <Button
                name="Add Expense"
                click={() => navigate('/addexpense')}
                className="bg-green-500 text-white hover:bg-green-600"
              />
            </div>
          </div>
        </div>
        <div className="basis-1/4 bg-gray-200 flex justify-center items-start p-4">
          <div className="border-2 border-black py-2 rounded-sm w-36 bg-white">
            {users.map((us, index) => (
              <UserInGroupComponent
                key={index}
                name={us.username}
                money={us.MoneyLent - us.MoneyOwe}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
