import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button.tsx";

import { useNavigate } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";
const Group = () => {
    // interface GroupType {
    //     Name: string;
    //     createdAt: string;
    //     TotalSpent: number;
    //     id: string;
    // }

    interface ExpenseProps {
        Name: string;
        createdAt: string;
        DivideTo: string[];
        createdBy: string;
        Total: number;
    }

    const [expense, setExpense] = useState<ExpenseProps[]>([]);
    const groupName = localStorage.getItem('groupName');
    // const total = localStorage.getItem('groupTotal');
    useEffect(() => {
        const fetchData = async () => {
            const id =  localStorage.getItem('groupId');
            if (id) {
                const response = await axios.get(`http://localhost:8787/api/v1/group/opengroup/id?id=${id}`);
                setExpense(response.data);
            } else {
                console.error("Group ID is not available ");
            }
        };

        fetchData();
    }, []);
    const navigate = useNavigate();
    return (
        <div>
            <div className="text-4xl flex justify-center pb-2 mt-3">{groupName}</div>
            
        <div>
        
            {expense.map((ex, index) => (
                
                <ExpenseCard 
                    key={index}
                    Name={ex.Name} 
                    createdAt={ex.createdAt.slice(0,10).split('-').reverse().join('-')} 
                    // divideTo={ex.divideTo} 
                    DivideTo={ex.DivideTo.map((di: string) => di).join(", ")}
                    createdBy={ex.createdBy} 
                    Total={ex.Total} 
                    
                ></ExpenseCard>
            ))}
        </div>
        <div className="flex justify-center pt-4">
                <Button name="Add Expense" click={() => navigate('/addexpense')}></Button>
            </div>
        </div>
    );
};

export default Group;