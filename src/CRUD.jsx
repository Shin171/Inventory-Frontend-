import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaInfoCircle } from "react-icons/fa"; 

// Modal Component for About Information
const AboutModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">How the System Works</h2>
        <p className="text-gray-300">
          This Shin product inventory management system allows you to:
          <ul className="list-disc ml-6">
            <li>Add, edit, and delete products.</li>
            <li>Filter products by category (Food, Clothes, PC Parts).</li>
            <li>Search for products by name.</li>
            <li>Track product quantities and availability (in stock or out of stock).</li>
          </ul>
        </p>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const CRUD = () => {
  const url = 'https://localhost:7194/api/product'; 
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    price: 0,
    inStock: false,
    category: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // Category filter state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false); // Modal visibility state
  const [selectedIds, setSelectedIds] = useState([]); // To store selected product IDs for deletion

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

  // Handle select/unselect product
  const toggleSelection = (id) => {
    setSelectedIds((prevSelectedIds) => 
      prevSelectedIds.includes(id) 
        ? prevSelectedIds.filter((itemId) => itemId !== id) 
        : [...prevSelectedIds, id]
    );
  };

  // Handle "Delete Selected" action
  const deleteSelectedProducts = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete selected products?");
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`${url}/${id}`))
      );
      fetchData();
      setSelectedIds([]); // Clear the selected IDs after deletion
    } catch (error) {
      console.error("Error deleting products:", error);
      setError("Failed to delete selected products. Please try again later.");
      alert("Error deleting products. Please try again.");
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
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // Edit a product
  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product });
  };

  // Fetch data when component mounts or category filter changes
  useEffect(() => {
    fetchData();
  }, [categoryFilter]);

  return (
    <div className="container p-6 mx-auto max-w-7xl bg-gray-900 text-white">
      {/* Navbar with Logo, Title, and About Button */}
      <header className="flex justify-between items-center mb-6 bg-gray-800 text-white p-4">
        <a href="/">
          <img
            src="/resources/logo.png" // Make sure this path is correct
            alt="Logo"
            className="h-16 w-16 rounded-full object-cover"
          />
        </a>
        <h1 className="text-3xl font-bold text-center flex-grow">Product Inventory</h1>
        <button
          onClick={() => setShowAboutModal(true)}
          className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <FaInfoCircle size={24} />
        </button>
      </header>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Form Section */}
      <form onSubmit={saveProduct} className="mb-6 p-6 bg-gray-800 shadow-lg rounded-xl border-2 border-gray-700 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">{editingProduct ? "Edit Product" : "Add Product"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium text-gray-300">Product Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              className="text-black p-4 w-full border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-lg font-medium text-gray-300">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={newProduct.quantity}
              onChange={handleChange}
              className="text-black p-4 w-full border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition duration-300 ease-in-out"
              min="0"
              required
            />
          </div>
          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-lg font-medium text-gray-300">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              className="text-black p-4 w-full border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition duration-300 ease-in-out"
              min="0"
              step="0.01"
              required
            />
          </div>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-lg font-medium text-gray-300 ">Category:</label>
            <select
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              className=" text-black p-4 w-full border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition duration-300 ease-in-out"
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
            <label htmlFor="inStock" className="block text-lg font-medium text-gray-300">In Stock:</label>
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

      {/* Search Filter */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={handleSearch}
          className="text-black p-4 w-1/2 sm:w-1/4 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition duration-300"
          placeholder="Search by name or category"
        />
        <button
          onClick={deleteSelectedProducts}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          disabled={selectedIds.length === 0}
        >
          Delete Selected
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-gray-800 border-2 border-gray-700">
        {isLoading ? (
          <div className="text-center py-6">Loading products...</div>
        ) : (
          <>
            <table className="min-w-full text-sm text-gray-500">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={() => {
                        if (selectedIds.length === filteredData.length) {
                          setSelectedIds([]); // Unselect all
                        } else {
                          setSelectedIds(filteredData.map((product) => product.id)); // Select all
                        }
                      }}
                      checked={selectedIds.length === filteredData.length}
                    />
                  </th>
                  <th className="px-6 py-3 text-left ">#</th>
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
                    <tr key={product.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelection(product.id)}
                        />
                      </td>
                      <td className="px-6 py-4  text-gray-300">{index + 1}</td>
                      <td className="px-6 py-4  text-gray-300">{product.name}</td>
                      <td className="px-6 py-4  text-gray-300">{product.category}</td>
                      <td className="px-6 py-4  text-gray-300">{product.quantity}</td>
                      <td className="px-6 py-4  text-gray-300">P{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4  text-gray-300">{product.inStock ? "In Stock" : "Out of Stock"}</td>
                      <td className="px-6 py-4  text-gray-300">
                        <button
                          onClick={() => editProduct(product)}
                          className="text-yellow-600 hover:text-yellow-800 mr-4"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            const isConfirmed = window.confirm(`Are you sure you want to delete ${product.name}?`);
                            if (isConfirmed) {
                              axios.delete(`${url}/${product.id}`).then(fetchData);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* About Modal */}
      <AboutModal show={showAboutModal} onClose={() => setShowAboutModal(false)} />

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-6">
        <p>&copy; 2025 January : Daniel Rasheed Quillosa </p>
      </footer>
    </div>
  );
};

export default CRUD;
