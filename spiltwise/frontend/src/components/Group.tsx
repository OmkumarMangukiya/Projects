interface GroupProps {
    
  name: string;
  createdAt: string; 
  TotalSpent: number;
}

const Group: React.FC<GroupProps> = ({ name, createdAt, TotalSpent }) => {
  // Use the received props here

  return<>
  <div className="flex justify-center text-lg font-medium">
  <div className="flex grid-cols-2 mt-24">
     <div className="bg-slate-300 p-4">
     <div className="text-xl pb-1">{name}</div> 
        <div className="flex grid-cols-2 font-normal">Total = &nbsp;₹<div className="text-green-600 font-semibold"> {TotalSpent}</div> &nbsp; &nbsp; Created On = {createdAt.slice(0,10).split("-").reverse().join("-")} </div>
     </div>
  
  </div>;
  </div>
  </> 
};

export default Group;