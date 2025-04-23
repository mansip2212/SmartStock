import { useEffect, useState } from "react";
import { getFirestore, collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import OrderProductModal from "./OrderProductModal";

const OutOfStockTable = ({ refreshKey, onActionComplete }) => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderProductModal, setOrderProductModal] = useState(false);
  const [productToOrder, setProductToOrder] = useState(null);

  const itemsPerPage = 5;

  const fetchOutOfStockProducts = async () => {
    if (!user) return;

    const inventoryRef = collection(db, "users", user.uid, "inventory");
    const querySnapshot = await getDocs(inventoryRef);
    const outOfStockList = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(prod => prod.remainingQty === 0);

    setOutOfStockProducts(outOfStockList);
  };

  useEffect(() => {
    fetchOutOfStockProducts();
  }, [user, refreshKey]);

  const handleOrderMore = (product) => {
    setProductToOrder(product);
    setOrderProductModal(true);
  };

  const handleRemoveItem = async (productId) => {
    if (!user) return;

    const productRef = doc(db, "users", user.uid, "inventory", productId);
    try {
      await deleteDoc(productRef);
      onActionComplete();
      setOutOfStockProducts(outOfStockProducts.filter(prod => prod.productId !== productId));
      alert("Product removed successfully!");
    } catch (error) {
      console.error("Error removing product: ", error);
      alert("Failed to remove product.");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = outOfStockProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(outOfStockProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Out of Stock Items</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-100">
          <thead>
            <tr className="bg-red-400 text-left text-white">
              <th className="p-3 border-t border-b">Product ID</th>
              <th className="p-3 border-t border-b">Product Name</th>
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
                  <td className="p-3 border-t border-b">${product.price}</td>
                  <td className="p-3 border-t border-b">{product.category}</td>
                  <td className="p-3 border-t border-b">
                    <button
                      className="bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-700"
                      onClick={() => handleOrderMore(product)}
                    >
                      Order More
                    </button>
                  </td>
                  <td className="p-3 border-t border-b">
                    <button
                      className="bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-700"
                      onClick={() => handleRemoveItem(product.productId)}
                    >
                      Remove Item
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center">No out-of-stock products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {orderProductModal && (
        <OrderProductModal
          isOpen={orderProductModal}
          onClose={() => {
            setOrderProductModal(false);
            setProductToOrder(null);
            fetchOutOfStockProducts();
            onActionComplete();
          }}
          prePopulatedProduct={productToOrder}
        />
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
    </div>
  );
};

export default OutOfStockTable;
