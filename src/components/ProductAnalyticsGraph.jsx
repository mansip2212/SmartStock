import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import Select from "react-select";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ProductAnalyticsGraph = () => {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [startDate, setStartDate] = useState(dayjs().subtract(6, 'month').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [orderData, setOrderData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user) return;
      const inventoryRef = collection(db, "users", user.uid, "inventory");
      const inventorySnapshot = await getDocs(inventoryRef);

      const allOrderEntries = [];
      const options = [];

      for (const productDoc of inventorySnapshot.docs) {
        const product = productDoc.data();
        const productId = product.productId;
        const productName = product.name;
        options.push({ value: productId, label: `${productId} - ${productName}` });

        const orderHistoryRef = collection(db, "users", user.uid, "inventory", productId, "orderHistory");
        const orderSnapshot = await getDocs(orderHistoryRef);

        orderSnapshot.forEach(orderDoc => {
          const data = orderDoc.data();
          allOrderEntries.push({
            productId,
            productName,
            date: dayjs(data.orderedAt.toDate()).format("YYYY-MM-DD HH:mm:ss"),
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            notes: data.notes || null
          });
        });
      }

      setOrderData(allOrderEntries);
      setProductOptions(options);
      if (!selectedProductId && options.length > 0) setSelectedProductId(options[0].value);
    };

    fetchOrderHistory();
  }, [user]);

  const filteredData = orderData
    .filter(entry => entry.productId === selectedProductId)
    .filter(entry => {
      const orderDate = dayjs(entry.date);
      return orderDate.isAfter(dayjs(startDate)) && orderDate.isBefore(dayjs(endDate));
    });

  return (
    <div className="mx-4 lg:mx-16 my-6 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Product Order Analytics</h2>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <label className="font-medium">Select Product:</label>
        <Select
          className="w-64"
          options={productOptions}
          value={productOptions.find(opt => opt.value === selectedProductId)}
          onChange={(selected) => setSelectedProductId(selected.value)}
          isSearchable
          placeholder="Search product"
        />

        <label className="ml-4 font-medium">From:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="border px-3 py-2 rounded-md"
        />

        <label className="ml-2 font-medium">To:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="border px-3 py-2 rounded-md"
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" label={{ value: "Qty", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "Price ($)", angle: 90, position: "insideRight" }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const entry = payload[0].payload;
                return (
                  <div className="bg-white p-2 rounded shadow">
                    <p>Date: {label}</p>
                    <p style={{ color: '#8884d8' }}>Quantity: {entry.quantity}</p>
                    <p style={{ color: '#82ca9d' }}>Unit Price: ${entry.unitPrice}</p>
                    {entry.notes && <p style={{ color: '#e57373' }}>Notes: {entry.notes}</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="quantity" stroke="#8884d8" name="Quantity Ordered" />
          <Line yAxisId="right" type="monotone" dataKey="unitPrice" stroke="#82ca9d" name="Unit Price" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductAnalyticsGraph;
