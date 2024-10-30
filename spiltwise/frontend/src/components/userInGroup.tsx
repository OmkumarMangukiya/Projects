interface User {
    name: string;
    money: number;
}

const UserInGroupComponent = ({ name, money }: User) => {
    const moneyClass = money < 0 ? 'text-red-500' : money > 0 ? 'text-green-500' : 'text-black';
    const moneySign = money < 0 ? "💸" : money > 0 ? "💰" : " ";

    return (
        <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="font-medium text-gray-700">{name}</span>
            <span className={`font-semibold ${moneyClass} flex items-center`}>
                {moneySign} <span className="ml-1">{money}</span>
            </span>
        </div>
    );
}

export default UserInGroupComponent;