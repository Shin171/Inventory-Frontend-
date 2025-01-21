import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const CRUD = () => {
  const url = 'https://localhost:7194/api/product'; // Change to your API URL
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    price: 0,
    inStock: false,
    category: "", // Category added here
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // Category filter state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetching data from API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(url, {
        params: { category: categoryFilter }, // Pass category filter to the API
      });
      setData(response.data);
      setFilteredData(response.data); // Initialize filtered data with all products
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save or update product
  const saveProduct = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let response;
      if (editingProduct) {
        response = await axios.put(`${url}/${editingProduct.id}`, newProduct);
        if (response.status === 200 || response.status === 204) {
          alert("Product updated successfully!");
          fetchData();
          setNewProduct({ name: "", quantity: 0, price: 0, inStock: true, category: "" });
          setEditingProduct(null);
        }
      } else {
        response = await axios.post(url, newProduct);
        if (response.status === 200 || response.status === 201) {
          alert("Product added successfully!");
          fetchData();
          setNewProduct({ name: "", quantity: 0, price: 0, inStock: true, category: "" });
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again later.");
      alert("Error saving product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredData(data); // If search is empty, show all products
    } else {
      const filtered = data.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // Edit a product
  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product });
  };

  // Delete a product
  const deleteProduct = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(`${url}/${id}`);
      if (response.status === 200 || response.status === 204) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again later.");
      alert("Error deleting product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or category filter changes
  useEffect(() => {
    fetchData();
  }, [categoryFilter]);

  return (
    <div className="container p-6 mx-auto max-w-7xl">
       <header className="flex justify-between items-center mb-6">
        <a href="/">
          <img
            src="/resources/logo.png" // Make sure this path is correct
            alt="Logo"
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-2 border-blue-500 shadow-lg"
          />
        </a>
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 animate-pulse">
          Product Inventory
        </h1>
      </header>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Form Section */}
      <form onSubmit={saveProduct} className="mb-6 p-6 bg-white shadow-lg rounded-xl border-2 border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{editingProduct ? "Edit Product" : "Add Product"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">Product Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              className="p-4 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={newProduct.quantity}
              onChange={handleChange}
              className="p-4 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              min="0"
              required
            />
          </div>
          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-lg font-medium text-gray-700">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              className="p-4 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              min="0"
              step="0.01"
              required
            />
          </div>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category:</label>
            <select
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              className="p-4 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="PC Parts">PC Parts</option>
              <option value="Laptop">Laptop</option>
            </select>
          </div>
          {/* In Stock */}
          <div className="mb-4">
            <label htmlFor="inStock" className="block text-lg font-medium text-gray-700">In Stock:</label>
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={newProduct.inStock}
              onChange={() =>
                setNewProduct((prev) => ({
                  ...prev,
                  inStock: !prev.inStock,
                }))
              }
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-4 rounded-lg w-full mt-4 hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Search Section */}
      <div className="mb-6 flex justify-center items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-4 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 w-2/3 sm:w-1/3 transition duration-300"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white p-4 rounded-r-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
        >
          Search
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-4 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <option value="">Filter by Category</option>
          <option value="Food">Food</option>
          <option value="Clothes">Clothes</option>
          <option value="PC Parts">PC Parts</option>
          <option value="Laptop">Laptop</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white border-2 border-gray-200">
        {isLoading ? (
          <div className="text-center py-6">Loading products...</div>
        ) : (
          <table className="min-w-full text-sm text-gray-500">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">In Stock</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">{product.quantity}</td>
                    <td className="px-6 py-4">P{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{product.inStock ? "In Stock" : "Out of Stock"}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => editProduct(product)}
                        className="text-yellow-600 hover:text-yellow-800 mr-4"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CRUD;
