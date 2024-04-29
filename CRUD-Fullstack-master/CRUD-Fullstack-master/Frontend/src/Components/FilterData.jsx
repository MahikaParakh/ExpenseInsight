import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ListOfResult.css";

function FilterData() {
  // Fetches expense data and categories
  const [result, setResult] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000");
      const data = await response.json();
      setResult(data);

      const categoryResponse = await fetch("http://localhost:3000/categories"); // Assuming an endpoint for categories
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);
    };

    fetchData();
  }, []);

  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filters expenses based on selected category
  const filteredResult =
    selectedCategory === "all"
      ? result
      : result.filter((item) => item.CategoryName === selectedCategory);

  // Handles category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handles expense deletion (similar to ListOfResults.jsx)
  const handleDelete = (e) => {
    console.log(e.target.name);
    if (confirm("Are you sure you would like to delete this expense entry?")) {
      console.log("Expense deleted.");
      fetch("http://localhost:3000", {
        method: "DELETE",
        body: JSON.stringify({
          ProductID: e.target.name,
        }),
        headers: { "Content-Type": "application/json" },
      });
      window.location.reload();
    } else {
      console.log("Deletion request cancelled.");
    }
  };

  return (
    <div className="results">
      <h1 className="title_results">Expenses (Filter by Category)</h1>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="all" key="all">All Categories</option>
        {categories.map((category) => (
          <option key={category.category_id} value={category.CategoryName}>
            {category.CategoryName}
          </option>
        ))}
      </select>

      <section className="section_all_results">
        {filteredResult.map((item, index) => (
          <section key={index} className="section_individual_result">
            <article>
              <p className="p_results">Expense Description:</p>
              <p className="product_result">{item.ProductName}</p>
              <p className="p_results">Category Name:</p>
              <p className="product_result">{item.CategoryName}</p>
              <p className="p_results">Amount:</p>
              <p className="product_result">{item.Amount}</p>
            </article>
            <div className="div_buttons_results">
              <Link to={`/modify/${item.ProductID}`}>
                <button className="modify_results">Edit</button>
              </Link>
              <button
                name={item.ProductID}
                onClick={handleDelete}
                className="delete_results"
              >
                Delete
              </button>
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}

export default FilterData;
