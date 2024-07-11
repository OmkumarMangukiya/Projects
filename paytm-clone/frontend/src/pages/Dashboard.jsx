import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

const Dashboard = () => {
  return (
    <div className="bg-slate-300 h-screen">
      <div className="flex justify-between p-1 m-4  rounded-md shadow-md  outline outline-1">
            <img src="https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo.svg" alt="" />
            <div className="flex justify-normal gap-4 p-2">
            </div>
        </div>
      <AppBar />

      <div className="flex flex-col justify-center m-8">
        <Balance value={"10,000"} />
        <Users />
      </div>
    </div>
  );
};

export default Dashboard;