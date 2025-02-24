"use client";

import { Button, Spinner } from "@nextui-org/react";
import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DumpsWithPin = () => {

  const label = "DumpsWithPin";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [addingToCart, setAddingToCart] = useState({});

  // Load CSV Data
  const loadCSV = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/handlePins/pins");
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

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [loadCSV]);

  // Handle quantity change
  const handleQuantityChange = (e, bin, stock) => {
    let purchaseQuantity = parseInt(e.target.value, 10) || 1;

    // Get the existing quantity of this bin in the cart
    const existingProduct = cart.find((item) => item.bin === bin);
    const totalQuantityInCart = existingProduct ? existingProduct.quantity : 0;

    if (purchaseQuantity > stock - totalQuantityInCart) {
      toast.error(
        `You cannot add more than ${stock} of this product in total.`
      );
      return;
    }

    setSelectedQuantities((prev) => ({
      ...prev,
      [bin]: Math.max(purchaseQuantity, 1), // Ensure it's at least 1
    }));

    console.log(`Stock Available for ${bin}: ${stock}`);
    console.log(`User Selected Quantity for ${bin}: ${purchaseQuantity}`);
  };

  const addToCart = async (product) => {
    const { bin, cardType, country, price, quantity: stock } = product;
    const purchaseQuantity = selectedQuantities[bin] || 1; // User selected quantity
  
    console.log(`Stock for ${bin}: ${stock}`);
    console.log(`Purchase Quantity for ${bin}: ${purchaseQuantity}`);
  
    if (purchaseQuantity > stock) {
      toast.error(`Cannot add more than ${stock} items.`);
      return;
    }
  
    const existingProduct = cart.find((item) => item.bin === bin);
    const totalQuantityInCart = existingProduct ? existingProduct.quantity : 0;
  
    if (totalQuantityInCart + purchaseQuantity > stock) {
      toast.error(`You cannot add more than ${stock} of this product in total.`);
      return;
    }
  
    setAddingToCart((prev) => ({
      ...prev,
      [bin]: true,
    }));
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    let newCart;
    if (existingProduct) {
      newCart = cart.map((item) =>
        item.bin === bin
          ? { ...item, quantity: item.quantity + purchaseQuantity, label: label }
          : item
      );
    } else {
      newCart = [
        ...cart,
        { bin, cardType, country, quantity: purchaseQuantity, price, label: label },
      ];
    }
  
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  
    toast.success(`${cardType || "Product"} added to cart!`);
  
    setAddingToCart((prev) => ({
      ...prev,
      [bin]: false,
    }));
  };

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto">
      <div className="bg-gray-900 border border-gray-600 file:er-slate-700 p-6 rounded-lg shadow-xl">
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
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">BIN (Stock)</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Issuer</th>
                  <th className="py-3 px-4 text-left">Country</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      No Products Available
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr
                      key={product.bin}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      <td className="py-3 px-4">{index + 1 || "-"}</td>
                      <td className="py-3 px-4">{product.bin || "-"}</td>
                      <td className="py-3 px-4">{product.cardType || "-"}</td>
                      <td className="py-3 px-4">{product.issuer || "-"}</td>
                      <td className="py-3 px-4">{product.country || "-"}</td>
                      <td className="py-3 px-4">{product.quantity || "-"}</td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              {
                                target: {
                                  value: Math.max(
                                    1,
                                    (selectedQuantities[product.bin] || 1) - 1
                                  ),
                                },
                              },
                              product.bin,
                              product.quantity
                            )
                          }
                          className="bg-gray-600 text-white px-2 py-1 rounded-md"
                        >
                          -
                        </button>

                        <input
                          type="number"
                          min="1"
                          max={product.quantity}
                          value={selectedQuantities[product.bin] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              e,
                              product.bin,
                              product.quantity
                            )
                          }
                          className="w-14 text-center bg-gray-700 text-gray-300 p-1 rounded-md"
                        />

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              {
                                target: {
                                  value: Math.min(
                                    product.quantity,
                                    (selectedQuantities[product.bin] || 1) + 1
                                  ),
                                },
                              },
                              product.bin,
                              product.quantity
                            )
                          }
                          className="bg-gray-600 text-white px-2 py-1 rounded-md"
                        >
                          +
                        </button>
                      </td>

                      <td className="py-3 px-4">$ {product.price || "-"}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-indigo-500 text-white py-1 px-4 rounded-md hover:bg-indigo-600"
                          disabled={addingToCart[product.bin]}
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
      <ToastContainer />
    </div>
  );
};

export default DumpsWithPin;
