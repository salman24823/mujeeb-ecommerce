"use client";

import { Spinner } from "@nextui-org/react";
import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DumpsWithPin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    // Get cart data from localStorage on initial load
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [addingToCart, setAddingToCart] = useState({}); // Track loading state for each product

  const loadCSV = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dumpsWithPins");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading CSV:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCSV();
  }, [loadCSV]);

  // Handle quantity change for each product
  const handleQuantityChange = (e, productId, stock) => {
    let quantity = e.target.value;

    // Ensure the quantity does not exceed stock
    if (quantity > stock) {
      quantity = stock; // Set to stock if the quantity exceeds it
      toast.error(`Cannot add more than ${stock} items to the cart.`);
    }

    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const addToCart = async (product) => {
    const quantity = selectedQuantities[product.bin] || 1; // Default to 1 if no quantity is selected

    // Ensure the quantity does not exceed stock
    if (quantity > product.quantity) {
      toast.error(`You cannot add more than the stock available of this product.`);
      return; // Exit early if quantity exceeds stock
    }

    // Calculate the total quantity in the cart for this product
    const existingProduct = cart.find((item) => item.bin === product.bin);
    const totalQuantityInCart = existingProduct ? existingProduct.quantity : 0;

    // Check if the quantity in cart plus the selected quantity exceeds the stock
    if (totalQuantityInCart + quantity > product.quantity) {
      toast.error(`You cannot add more than ${product.quantity} of this product to the cart.`);
      return; // Exit early if adding the quantity exceeds the stock
    }

    // Set the loading state for this product to true
    setAddingToCart((prev) => ({
      ...prev,
      [product.bin]: true,
    }));

    // Wait for 1 second before updating the cart to show the loading spinner
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex((item) => item.bin === product.bin);

    let newCart;
    if (existingProductIndex !== -1) {
      // Product is already in the cart, update the quantity
      newCart = [...cart];
      newCart[existingProductIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add new item with BIN, Type, Country, and Quantity
      newCart = [
        ...cart,
        { bin: product.bin, cardType: product.cardType, country: product.country, quantity },
      ];
    }

    // Update the cart in the state and localStorage
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    // Show success toast
    toast.success(`${product.cardType || "Product"} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
    });

    // Set the loading state for this product to false
    setAddingToCart((prev) => ({
      ...prev,
      [product.bin]: false,
    }));
  };
  

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">

      {/* Table Section */}
      <div className="bg-gray-900 border border-slate-700 p-6 rounded-lg shadow-xl">
        <div className="text-indigo-500 text-lg mb-4 flex items-center space-x-2">
          <span>Dumps with Pin</span>
        </div>

        {loading ? (
          <div className="w-full flex justify-center h-20 items-center">
            <Spinner className="w-fit" color="white" />
          </div>
        ) : (
          <div className="overflow-x-scroll text-nowrap custom-scrollbar">
            <table className="min-w-full text-sm text-gray-400">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">BIN</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Issuer</th>
                  <th className="py-3 px-4 text-left">Country</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-3 px-4 text-center text-gray-500">
                      No Products Available
                    </td>
                  </tr>
                ) : (
                  products.data.map((product) => (
                    <tr key={product.bin} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-4">{product.bin || "-"}</td>
                      <td className="py-3 px-4">{product.cardType || "-"}</td>
                      <td className="py-3 px-4">{product.issuer || "-"}</td>
                      <td className="py-3 px-4">{product.country || "-"}</td>
                      <td className="py-3 px-4">{product.quantity || "-"}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="1"
                          max={product.quantity} // Prevent input higher than available stock
                          value={selectedQuantities[product.bin] || 1}
                          onChange={(e) => handleQuantityChange(e, product.bin, product.quantity)}
                          className="w-16 bg-gray-700 text-gray-300 p-1 rounded-md"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-indigo-500 text-white py-1 px-4 rounded-md hover:bg-indigo-600"
                          disabled={addingToCart[product.bin]} // Disable button for the specific product
                        >
                          {addingToCart[product.bin] ? (
                            <Spinner size="sm" color="white" />
                          ) : (
                            "Add to Cart"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DumpsWithPin;
