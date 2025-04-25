import CategoryRadarChart from "../components/CategoryRadarChart";
import Navbar from "../components/NavBar";
import ProductAnalyticsGraph from "../components/ProductAnalyticsGraph";
import ChatSupportWidget from "../components/ChatSupportWidget";
import ProfitLossAnalytics from "../components/ProfitLossAnalytics";

function Analytics() {
  return (
    <div className="mb-10">
        <Navbar/>
        <ProfitLossAnalytics/>
        <CategoryRadarChart/>
        <ProductAnalyticsGraph/>
        <ChatSupportWidget />
    </div>
  );
}

export default Analytics;