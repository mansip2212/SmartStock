import { useEffect, useState } from "react";
import { getFirestore, collection, doc, deleteDoc, getDocs, getDoc, setDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import OrderProductModal from "./OrderProductModal";
import Papa from "papaparse";

const InventoryTable = ({ refreshKey, onActionComplete }) => {
  // Initialize Firebase Auth and Firestore.
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [file, setFile] = useState(null);
  const [isUploadCSVFile, setUploadCSVFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // State variables to manage the modals.
  const [orderProductModal, setOrderProductModal] = useState(false);
  const [productToOrder, setProductToOrder] = useState(null);  // New state to handle pre-populated product
  const [removeProductModal, setRemoveProductModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

  // State variables to manage the inventory data.
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleUpload = () => {
    if (!file || !auth.currentUser) 
    {
      alert("Please select a file.");
      return;
    }

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const userId = auth.currentUser.uid;

        for (const row of results.data) {
          const {
            productId,
            name,
            category,
            remainingQty,
            price
          } = row;

          if (!productId || !name) continue;

          const productRef = doc(db, "users", userId, "inventory", productId);
          await setDoc(productRef, {
            productId,
            name,
            category,
            remainingQty: parseInt(remainingQty) || 0,
            price: parseFloat(price) || 0,
            lastModifiedAt: new Date()
          });

          const orderHistoryRef = doc(db, "users", userId, "inventory", productId, "orderHistory", `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
          await setDoc(orderHistoryRef, {
            quantity: parseInt(remainingQty) || 0,
            unitPrice: parseFloat(price) || 0,
            orderedAt: new Date(),
            notes: "Uploaded via CSV"
          });
        }

        alert("Upload complete!");
        setUploadCSVFile(false);
        setFile(null);
        setIsUploading(false);
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        alert("Failed to parse CSV file.");
        setIsUploading(false);
      }
    });
  };

  const fetchCategories = async () => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setCategories(userDoc.data().categories || []);
    }
  };

  const fetchProducts = async () => {
    const inventoryRef = collection(db, "users", user.uid, "inventory");
    const querySnapshot = await getDocs(inventoryRef);
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsList);
    setFilteredProducts(productsList);
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchProducts();
    }
  }, [user, refreshKey]);

  useEffect(() => {
    let filtered = products;
    
    if (categoryFilter) {
      filtered = filtered.filter(prod => prod.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (searchTerm) {
      filtered = filtered.filter(prod =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.productId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset pagination when filtering
  }, [categoryFilter, searchTerm, products]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle "Order More" button click
  const handleOrderMore = (product) => {
    setProductToOrder(product);  // Set product to pre-populate modal
    setOrderProductModal(true);
  };

  const handleRemoveItem = async (product) => {
    setProductToRemove(product);
    setRemoveProductModal(true);
  };

  const handleRemoveItemFromDatabase = async (productId) => {
    if (!user) return;
    setRemoveProductModal(false);
  
    const productRef = doc(db, "users", user.uid, "inventory", productId);
    const orderHistoryRef = collection(db, "users", user.uid, "inventory", productId, "orderHistory");
  
    try {
      const orderHistorySnapshot = await getDocs(orderHistoryRef);
      const deletePromises = orderHistorySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
  
      await deleteDoc(productRef);
  
      onActionComplete?.();
      fetchProducts();
      alert("Product removed successfully!");
    } catch (error) {
      console.error("Error removing product: ", error);
      alert("Failed to remove product.");
    }
  
    setProductToRemove(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
    

  return (
    <div className="container mx-auto px-4 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Inventory Overview</h2>
      {/* Filters and Search Bar */}
      <div className="flex flex-wrap justify-between items-center mb-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search by Name or ID..."
          className="border rounded-lg px-3 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="border rounded-lg px-3 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setCategoryFilter(e.target.value)}
          value={categoryFilter}>
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <div>
          <button
          onClick={() => setUploadCSVFile(true)}
          className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mx-4">
            Upload CSV File
          </button>
          <button onClick={() => setOrderProductModal(true)} className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            + Order a New Product
          </button>
        </div>
        
      </div>

      {/* Open the modal for ordering a new product or ordering more */}
      {orderProductModal && (
        <OrderProductModal 
          isOpen={orderProductModal} 
          onClose={() => { setOrderProductModal(false); setProductToOrder(null); fetchProducts(); onActionComplete();
          }} 
          prePopulatedProduct={productToOrder}  // Pass the product data here
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-100">
          <thead>
            <tr className="bg-gray-700 text-left text-white">
              <th className="p-3 border-t border-b">Product ID</th>
              <th className="p-3 border-t border-b">Product Name</th>
              <th className="p-3 border-t border-b">Remaining Qty</th>
              <th className="p-3 border-t border-b">Average Price</th>
              <th className="p-3 border-t border-b">Category</th>
              <th className="p-3 border-t border-b"></th>
              <th className="p-3 border-t border-b"></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="p-3 border-t border-b">{product.productId}</td>
                  <td className="p-3 border-t border-b">{product.name}</td>
                  <td className="p-3 border-t border-b">{product.remainingQty}</td>
                  <td className="p-3 border-t border-b">${product.price}</td>
                  <td className="p-3 border-t border-b ">{product.category}</td>
                  <td className="p-3 border-t border-b ">
                    <button className="bg-gray-700 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleOrderMore(product)}>
                        Order More
                    </button>
                  </td>
                  <td className="p-3 border-t border-b ">
                    <button className="bg-gray-700 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleRemoveItem(product)}>
                        Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {removeProductModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-80">
              <p className="mb-4">Are you sure you want to remove the product?</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setRemoveProductModal(false)} className="bg-gray-500 text-white px-8 py-2 rounded-lg cursor-pointer">No</button>
                <button onClick={() => handleRemoveItemFromDatabase(productToRemove.productId)} className="bg-green-500 text-white px-8 py-2 rounded-lg cursor-pointer">Yes</button>
              </div>
            </div>
          </div>
        )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border mx-1 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border mx-1 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {isUploadCSVFile && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Upload Inventory CSV</h3>
            <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4 w-full" />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setUploadCSVFile(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-4 py-2 rounded text-white ${isUploading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
