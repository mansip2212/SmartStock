// ProfitLossAnalytics.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { getFirestore, collection, getDocs, getDoc, doc} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ProfitLossAnalytics = () => {
  const [data, setData] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const db = getFirestore();
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const inventoryDocRef = doc(db, "users", user.uid);
      const inventoryDoc = await getDoc(inventoryDocRef);
      const categories = inventoryDoc.exists() ? inventoryDoc.data().categories || [] : [];
      setDbCategories(categories);

      const inventoryRef = collection(db, "users", user.uid, "inventory");
      const inventorySnap = await getDocs(inventoryRef);
      const summary = {};

      for (const prodDoc of inventorySnap.docs) {
        const productId = prodDoc.id;
        const prodData = prodDoc.data();
        const category = prodData.category;

        const orderHistoryRef = collection(db, "users", user.uid, "inventory", productId, "orderHistory");
        const orderSnap = await getDocs(orderHistoryRef);

        orderSnap.forEach(order => {
          const { quantity, unitPrice, costPrice, notes } = order.data();

          if (!summary[category]) {
            summary[category] = {
              category,
              revenue: 0,
              cost: 0,
              orders: [],
              totalQty: 0
            };
          }

          summary[category].revenue += quantity * unitPrice;
          summary[category].cost += quantity * costPrice;
          summary[category].totalQty += quantity;
          summary[category].orders.push({
            productId,
            quantity,
            unitPrice,
            costPrice,
            notes
          });
        });
      }

      const result = Object.values(summary).map(dep => ({
        ...dep,
        profit: dep.revenue - dep.cost
      }));

      setData(result);
    };

    fetchData();
  }, [user]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { revenue, cost, profit, totalQty } = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-bold">{label}</p>
          <p>Revenue: ${revenue.toFixed(2)}</p>
          <p>Cost: ${cost.toFixed(2)}</p>
          <p>Profit: ${profit.toFixed(2)}</p>
          <p>Total Quantity: {totalQty}</p>
        </div>
      );
    }
    return null;
  };

  const filtered = selectedCategory ? data.filter(dep => dep.category === selectedCategory) : data;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Profit/Loss by Department</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="profit" fill="#4F46E5" name="Profit/Loss" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="" disabled>Select Category</option>
            {dbCategories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

        </div>{filtered.length === 0 || selectedCategory === ""? (
          <p className="text-sm text-gray-500">No order data available.</p>
        ) : (
          filtered.map((dep, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold mb-2">{dep.category}</h3>
              <table className="text-sm w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Product ID</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Unit Price</th>
                    <th className="p-2 border">Cost Price</th>
                    <th className="p-2 border">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {dep.orders.slice(0, 10).map((order, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{order.productId}</td>
                      <td className="p-2 border">{order.quantity}</td>
                      <td className="p-2 border">${order.unitPrice.toFixed(2)}</td>
                      {/* <td className="p-2 border">${order.costPrice.toFixed(2)}</td> */}
                      <td className="p-2 border">{order.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfitLossAnalytics;
