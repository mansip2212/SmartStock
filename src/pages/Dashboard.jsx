import ChatSupportWidget from "../components/ChatSupportWidget";
import InventoryTable from "../components/InventoryTable";
import Navbar from "../components/NavBar";
import OutOfStockTable from "../components/OutofStockTable";
import { useState } from "react";

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1); // this will re-trigger useEffect in both tables
  };

  return (
    <div className="mb-10">
      <Navbar/>
      <InventoryTable refreshKey={refreshKey} onActionComplete={triggerRefresh}/>
      <OutOfStockTable refreshKey={refreshKey} onActionComplete={triggerRefresh}/>
      <ChatSupportWidget />
    </div>
  );
}

export default Dashboard;