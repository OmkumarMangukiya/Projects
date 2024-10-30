import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button.tsx";
import UserInGroupComponent from "../components/userInGroup.tsx";
import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";

const Group = () => {
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
    id: string;
  }

  const [expense, setExpense] = useState<ExpenseProps[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const groupName = localStorage.getItem("groupName");

  const fetchData = async () => {
    const id = localStorage.getItem("groupId");
    try {
      if (id) {
        const response = await axios.get(
          `http://localhost:8787/api/v1/group/opengroup/id?id=${id}`
        );
        setExpense(response.data);
        console.log(response.data);
      } else {
        console.error("Group ID is not available");
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleDeleteSuccess = () => {
    fetchData(); // Re-fetch data without refreshing the page
  };

  const handleDeleteFailure = () => {
    console.error("Failed to delete the expense");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-5">
      <header className="w-full py-6 mb-5 text-center border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">{groupName}</h1>
        <p className="text-sm text-gray-700 mt-1">Manage your group expenses with ease</p>
      </header>
      
      <div className="flex flex-row w-full max-w-7xl gap-10 flex-1 bg-white p-6 border border-gray-300">
        
        <div className="basis-3/4 flex flex-col gap-5">
          {expense.map((ex, index) => (
            <div key={index}>
              <ExpenseCard
                Name={ex.Name}
                createdAt={ex.createdAt.slice(0, 10).split("-").reverse().join("-")}
                DivideTo={Object.entries(ex.DivideTo).map(([key, value]) => `${key}: ${value}`).join(", ")}
                createdBy={ex.createdBy}
                Total={ex.Total}
                expenseId={ex.id}
                onDeleteSuccess={handleDeleteSuccess}
                onDeleteFailure={handleDeleteFailure}
              />
            </div>
          ))}
          <div className="flex justify-center py-7">
            <Button
              name="Add Expense"
              click={() => navigate('/addexpense')}
              className="bg-green-500 text-white hover:bg-green-600"
            />
          </div>
        </div>

        <div className="basis-1/4 bg-gray-50 flex flex-col items-center p-5 border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">Members</h2>
          <div className="w-full space-y-2">
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