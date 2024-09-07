
export interface CardProps {
    name:string;
    total : number;
    createdAt :string

}
const Card = ({name,total,createdAt} : CardProps)=>{
    return <div className="w-full ">
        <div className="flex justify-between ">
        <div className="pb-1 font-semibold">
            {name}
        </div>
        <div className="text-green-700 font-semibold ">
                {total}
            </div>
            </div>
            <div>
                {createdAt.slice(0, 10).split('-').reverse().join("/")}
            </div>
            
        
    </div>
}
export default Card;