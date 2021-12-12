import React from "react";
import Spinner from "react-bootstrap/Spinner";

const LoadingSpinner = (visible) => {
  return (
    <div>
      {visible ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoadingSpinner;
