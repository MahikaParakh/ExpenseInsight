import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ListOfResult.css";

function ListOfResult() {
  
  const [result, setResult] = useState([]);


  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  

  const handleDelete = (e) => {
    console.log(e.target.name);
    if (confirm("Are you sure you would like to delete this expense entry?")) {
      console.log("Expense deleted.");
      fetch("http://localhost:3000", {
        method: "DELETE",
        body: JSON.stringify({
          ["ProductID"]: e.target.name,
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
      <h1 className="title_results">Expenses</h1>
      <section className="section_all_results">
        {result.map((item, index) => (
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

export default ListOfResult;
