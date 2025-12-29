import React, { useState } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const [data, setData] = useState({
    // name: "",
    // description: "",
    // price: "",
    category: "Vegetarian",
    sno: 1,     
    date: new Date().toISOString().split("T")[0],
    tagNo: " ",
    plantName: " ",
    reason: " ",
    action: " ",
    remark: " ",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 Form Submit Handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Client-side validations
    if (!image) return toast.error("Please select an image");
    // if (!data.name.trim()) return toast.error("Please enter a product name");
    // if (!data.description.trim())
    //   return toast.error("Please enter a description");
    if (!data.category.trim())
      return toast.error("Please select a category"); 
    if (!data.date.trim())
      return toast.error("Please select a valid date"); 
    if (!data.sno || Number(data.sno) <= 0)
      return toast.error("Please enter a valid SNO");
if (!data.tagNo.trim())
      return toast.error("Please enter a valid Tag Number");
    if (!data.plantName.trim())
      return toast.error("Please enter a valid Plant Name");  
    if (!data.reason.trim())
      return toast.error("Please enter a valid Reason");  
    if (!data.action.trim())
      return toast.error("Please enter a valid Action");  
    if (!data.remark.trim())
      return toast.error("Please enter a valid Remark");  
  

    // if (!data.price || Number(data.price) <= 0)
    //   return toast.error("Please enter a valid price");

    try {
      setLoading(true);

      // Prepare form data
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("image", image);

      // API call
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Food Added Successfully");

        // Reset form
        setData({
          // name: "",
          // description: "",
          // price: "",
          category: "Vegetarian", // ✅ Matches select
          sno: 1,     
          date: new Date().toISOString().split("T")[0],
          tagNo: " ",   
          plantName: " ",
          reason: " ",  
          action: " ",
          remark: " ",
        });
        setImage(null);
        document.getElementById("image").value = "";
      } else {
        toast.error(response.data.message || "Failed to add food");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding food");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Input Change Handler
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-content">
      <div className="add">
        <form className="flex-col" onSubmit={onSubmitHandler}>
          {/* Image Upload */}
          <div className="add-img-upload flex-col">
            <p>Upload image</p>
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Preview"
              />
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              accept="image/*"
              required
            />
          </div>

         


            {/* <div className="add-product-name flex-col">
            <p>S.NO</p>
            <input
              name="sno"
              onChange={onChangeHandler}
              value={data.sno}
              type="number"
              placeholder="Type here"
              required
            />
          </div> */}

            <div className="add-product-name flex-col">
            <p>TAG NO</p>
            <input
              name="tagNo"
              onChange={onChangeHandler}
              value={data.tagNo}
              type="text"
              placeholder="Type here"
              required
            />
          </div>

          <div className="add-product-name flex-col">
            <p>PLANT NAME</p>
            <input
              name="plantName"
              onChange={onChangeHandler}
              value={data.plantName}
              type="text"
              placeholder="Type here"
              required
            />
          </div>

            <div className="add-product-name flex-col">
            <p>DATE</p>
            <input
              name="date"
              onChange={onChangeHandler}
              value={data.date}
              type="date"
              placeholder="Type here"
              required
            />
          </div>

            <div className="add-product-description flex-col">
            <p>PROBLEM</p>
            <textarea
              name="action"
              onChange={onChangeHandler}
              value={data.action}
              type="text"
              placeholder="Type here"
              required
            />
          </div>

            <div className="add-product-description flex-col">
            <p>SERVICES</p>
            <textarea
              name="reason"
              onChange={onChangeHandler}
              value={data.reason}
              type="text"
              placeholder="Type here"
              required
            />
          </div>

            <div className="add-product-name flex-col">
            <p>REMARK</p>
            <textarea
              name="remark"
              onChange={onChangeHandler}
              value={data.remark}
              type="text"
              placeholder="Type here"
              required
            />
          </div>

          {/* Category & Price */}
          <div className="add-category-price">
            {/* Category */}
            <div className="add-category flex-col">
              <p>Product category</p>
              <select
                name="category"
                onChange={onChangeHandler}
                value={data.category}
              >
                <option value="CMS">CMS</option>
                <option value="ALKALIES">ALKALIES</option>
                
              </select>
            </div>

            {/* Price */}
            
          </div>

          {/* Submit Button */}
          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Adding...
              </>
            ) : (
              "ADD"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
