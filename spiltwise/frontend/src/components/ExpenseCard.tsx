
 interface ExpenseProps{
    Name: string;
    createdAt : string;
    DivideTo : string;
    createdBy : string;
    Total : number;
}
const ExpenseCard = ({Name,createdAt,DivideTo,createdBy,Total} : ExpenseProps)=>{
   
    return( 
        <div>
            
    <div className="flex justify-center pt-5"> 
     
        <div className="w-80 border-2 border-black rounded-md py-2 ">
            
            <div className="text-xl font-medium flex justify-center pb-2">{Name}</div>
            <hr className="my-2 border-1 border-black" />
            <div className="pl-3 py-2 ">
            <div>Created on : {createdAt}</div>
            <div>Divide to: {DivideTo}</div>
            <div>Created By :  {createdBy}</div>
            <div>Total Expense : ₹ {Total}</div>
            </div>
        </div>
    </div>
    </div>)
}
export default ExpenseCard;