// PlanRouteButton.js
import React from "react";
import "../App.css";
const PlanRouteButton = ({ onPlanRoute }) => {
  const handlePlanRoute = () => {
    onPlanRoute();
  };

  return (
    <div>
      <button id="plan-route" onClick={handlePlanRoute}>
        Plan Route
      </button>
    </div>
  );
};

export default PlanRouteButton;
