import CategoryRadarChart from "../components/CategoryRadarChart";
import Navbar from "../components/NavBar";
import ProductAnalyticsGraph from "../components/ProductAnalyticsGraph";
import ChatSupportWidget from "../components/ChatSupportWidget";

function Analytics() {
  return (
    <div className="mb-10">
        <Navbar/>
        <ProductAnalyticsGraph/>
        <CategoryRadarChart/>
        <ChatSupportWidget />
    </div>
  );
}

export default Analytics;