import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, collection, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const OrderProductModal = ({ isOpen, onClose, prePopulatedProduct }) => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notes, setNotes] = useState("");


  useEffect(() => {
    if (user) {
      const fetchCategories = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setCategories(userDoc.data().categories || []);
        }
      };
      fetchCategories();
    }
  }, [user]);

  useEffect(() => {
    if (prePopulatedProduct) {
      // Pre-populate fields if product data is provided
      setProductId(prePopulatedProduct.productId);
      setName(prePopulatedProduct.name);
      setCategory(prePopulatedProduct.category);
      setPrice("");
      setQty(""); // You can leave qty empty or pre-populate if needed
    }
  }, [prePopulatedProduct]);

  const handleSubmit = async () => {
    setError("");
    if (!productId || !name || !qty || !price || (!category && !newCategory)) {
      setError("All fields are required");
      return;
    }
    if (isNaN(qty) || isNaN(price)) {
      setError("Quantity and Price must be numbers");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmSubmission = async () => {
    setConfirmOpen(false);
    const finalCategory = category === "Other" ? newCategory : category;
    const inventoryRef = collection(db, "users", user.uid, "inventory");
    const productRef = doc(inventoryRef, productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const existingProduct = productDoc.data();
      if (
        existingProduct.productId !== productId ||
        existingProduct.name !== name ||
        existingProduct.category !== finalCategory
      ) {
        setError("Product ID exists but details do not match");
        return;
      }
      // Weighted average price calculation
      const totalQty = existingProduct.remainingQty + parseInt(qty);
      const avgPrice = parseFloat(
        (
          (existingProduct.price * existingProduct.remainingQty + parseFloat(price) * parseInt(qty)) / 
          totalQty
        ).toFixed(2)
      );

      await updateDoc(productRef, { remainingQty: totalQty, price: avgPrice, lastModifiedAt: new Date() });
    } else {
      await setDoc(productRef, { name, productId, remainingQty: parseInt(qty), price: parseFloat(price), category: finalCategory, lastModifiedAt: new Date() });
      if (category === "Other" && !categories.includes(newCategory)) {
        await updateDoc(doc(db, "users", user.uid), { categories: [...categories, newCategory] });
      }
    }

    // Add order history entry under the product
    const orderHistoryRef = collection(db, "users", user.uid, "inventory", productId, "orderHistory");

    await addDoc(orderHistoryRef, {
      quantity: parseInt(qty),
      unitPrice: parseFloat(price),
      orderedAt: serverTimestamp(),
      notes: notes || ""
    });


    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 shadow-2xl bg-opacity-90 flex justify-center items-center">
        <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
          <h2 className="text-xl font-bold mb-4">Order Product</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input 
            type="text" 
            placeholder="Product ID" 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            className="border rounded-lg p-2 w-full mb-2"
            disabled={!!prePopulatedProduct}
          />
          <input 
            type="text" 
            placeholder="Product Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="border rounded-lg p-2 w-full mb-2"
            disabled={!!prePopulatedProduct}
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            value={qty} 
            onChange={(e) => setQty(e.target.value.replace(/\D/, ""))} 
            className="border rounded-lg p-2 w-full mb-2" 
            min="1"
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="border rounded-lg p-2 w-full mb-2" 
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="border rounded-lg p-2 w-full mb-2"
            disabled={!!prePopulatedProduct}
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
            <option value="Other">Other</option>
          </select>
          {category === "Other" && <input type="text" placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="border rounded-lg p-2 w-full mb-2" />}
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Cancel</button>
            <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer">Add Product</button>
          </div>
        </div>
        {confirmOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-80">
              <p className="mb-4">Are you sure you want to add this product?</p>
              <textarea 
                placeholder="Notes (optional)" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="border rounded-lg p-2 w-full mb-2" 
              />

              <div className="flex justify-end space-x-2">
                <button onClick={() => setConfirmOpen(false)} className="bg-gray-500 text-white px-8 py-2 rounded-lg cursor-pointer">No</button>
                <button onClick={confirmSubmission} className="bg-green-500 text-white px-8 py-2 rounded-lg cursor-pointer">Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default OrderProductModal;
