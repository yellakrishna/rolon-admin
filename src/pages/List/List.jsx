import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../assets/assets";
import "./List.css";
import { toast } from "react-toastify";

const List = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // Fetch foods from API
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) {
        // Sort by date descending
        const sortedFoods = res.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setFoods(sortedFoods);
      }
    } catch (err) {
      console.error("❌ Failed to fetch food list:", err);
      toast.error("Error fetching food list");
    } finally {
      setLoading(false);
    }
  };

  // Remove food item
  const removeFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    try {
      setRemovingId(id);
      const res = await axios.post(`${url}/api/food/remove`, { id });
      if (res.data.success) {
        toast.success(res.data.message || "Food Removed");
        setFoods((prev) => prev.filter((food) => food._id !== id));
      } else {
        toast.error(res.data.message || "Failed to remove food");
      }
    } catch (error) {
      console.error("❌ Error removing food:", error);
      toast.error("Error removing food");
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Format date as DD/MM/YYYY HH:mm:ss (24-hour)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      
    });
  };

  return (
    <div className="page-content">
      <div className="food-list">
        <h2 className="list-title">Food Items</h2>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading food list...</p>
          </div>
        ) : foods.length === 0 ? (
          <p className="empty-message">No food items available</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-container">
              <table className="food-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Date</th>
                    <th>Tag No</th>
                    <th>Plant Name</th>
                    <th>Action</th>
                    <th>Reason</th>
                    <th>Remark</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img src={item.image} alt={item.name || item.tagNo} />
                      </td>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.tagNo || "-"}</td>
                      <td>{item.plantName || "-"}</td>
                      <td>{item.action || "-"}</td>
                      <td>{item.reason || "-"}</td>
                      <td>{item.remark || "-"}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeFood(item._id)}
                          disabled={removingId === item._id}
                        >
                          {removingId === item._id ? (
                            <>
                              <div className="spinner small"></div>
                              Removing...
                            </>
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-list">
              {foods.map((item, index) => (
                <div className="mobile-item" key={item._id}>
                  <img src={item.image} alt={item.name || item.tagNo} />
                  <div className="mobile-info">
                    <h3>
                      <strong>DATE :</strong> {formatDate(item.date)}
                    </h3>
                    <h3>
                      <strong>TAG NO :</strong> {item.tagNo || "-"}
                    </h3>
                    <p className="category">
                      <strong>PLANT NAME :</strong> {item.plantName || "-"}
                    </p>
                    <p className="price">
                      <strong>PROBLEM :</strong> {item.action || "-"}
                    </p>
                    <p className="desc">
                      <strong>SERVICES :</strong> {item.reason || "-"}
                    </p>
                    <p className="desc">
                      <strong>REMARK :</strong> {item.remark || "-"}
                    </p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFood(item._id)}
                    disabled={removingId === item._id}
                  >
                    {removingId === item._id ? (
                      <>
                        <div className="spinner small"></div>
                        Removing...
                      </>
                    ) : (
                      "Remove"
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default List;
