// AddressInput.js
import React, { useState } from "react";
import "../App.css";
const AddressInput = ({ onAddAddress }) => {
  const [address, setAddress] = useState("");

  const handleInputChange = (event) => {
    setAddress(event.target.value);
  };

  const handleAddAddress = () => {
    onAddAddress(address);
    setAddress("");
  };

  return (
    <div id="Job-location">
      <input
        id="input"
        type="text"
        placeholder="Enter address..."
        value={address}
        onChange={handleInputChange}
      />

      <button id="button" onClick={handleAddAddress}>
        Add Address
      </button>
    </div>
  );
};

export default AddressInput;
