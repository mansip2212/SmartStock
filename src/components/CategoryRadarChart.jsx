import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CategoryRadarChart = () => {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCategoryTotals = async () => {
      if (!user) return;
      const inventoryRef = collection(db, "users", user.uid, "inventory");
      const inventorySnapshot = await getDocs(inventoryRef);

      const categoryMap = new Map();

      for (const productDoc of inventorySnapshot.docs) {
        const product = productDoc.data();
        const productId = product.productId;
        const category = product.category || "Uncategorized";

        const orderHistoryRef = collection(db, "users", user.uid, "inventory", productId, "orderHistory");
        const orderSnapshot = await getDocs(orderHistoryRef);

        let totalQty = 0;
        orderSnapshot.forEach(orderDoc => {
          const data = orderDoc.data();
          totalQty += data.quantity || 0;
        });

        if (categoryMap.has(category)) {
          categoryMap.set(category, categoryMap.get(category) + totalQty);
        } else {
          categoryMap.set(category, totalQty);
        }
      }

      const dataArray = Array.from(categoryMap.entries()).map(([category, total]) => ({
        category,
        total
      }));

      setChartData(dataArray);
    };

    fetchCategoryTotals();
  }, [user]);

  return (
<div className="flex flex-col md:flex-row w-full">
{/* Quantity Radar Chart */}
<div className="flex-1">
<h2 className="text-2xl text-center font-semibold mb-4">Order Volume by Category</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius={150} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar name="Orders" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
</div>

{/* Sales Radar Chart */}
<div className="flex-1">
<h2 className="text-2xl text-center font-semibold mb-4">Sales Volume by Category</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius={150} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar name="Orders" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
</div>
</div>

  );
};

export default CategoryRadarChart;