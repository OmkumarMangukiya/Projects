import DeleteButton from "./DeleteButton";

interface ExpenseProps {
  Name: string;
  createdAt: string;
  DivideTo: string;
  createdBy: string;
  Total: number;
  expenseId: string;
  onDeleteSuccess: () => void;
  onDeleteFailure: () => void;
}

const ExpenseCard = ({
  Name,
  createdAt,
  DivideTo,
  createdBy,
  Total,
  expenseId,
  onDeleteSuccess,
  onDeleteFailure,
}: ExpenseProps) => {
  const token = localStorage.getItem("token");
  return (
    <div className="flex justify-center pt-5">
      <div className="relative w-80 border-2 border-black rounded-md py-2 transform hover:scale-105 hover:shadow-lg  transition-all duration-300 overflow-hidden group">
        <div className="text-xl font-medium flex justify-center pb-2">
          {Name}
        </div>
        <hr className="my-2 border-1 border-black" />
        <div className="pl-3 py-2">
          <div>Created on: {createdAt}</div>
          <div>Divide to: {DivideTo}</div>
          <div>Created By: {createdBy}</div>
          <div>Total Expense: ₹ {Total}</div>
          {token && (
            <DeleteButton
              token={token}
              expenseId={expenseId}
              onDeleteSuccess={onDeleteSuccess}
              onDeleteFailure={onDeleteFailure}
            />
          )}
        </div>
        {/* Shining line effect
       <div className="absolute top-0 left-0 w-[30px] h-full bg-green-500 transform -skew-x-6 translate-x-[-150%] opacity-20 blur-md group-hover:translate-x-[1500%] transition-transform duration-[700ms] ease-in-out"></div> */}

        {/* Subtle overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div> */}
      </div>
    </div>
  );
};

export default ExpenseCard;
