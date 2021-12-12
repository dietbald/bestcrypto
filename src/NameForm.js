import React, { useState } from "react";

const NameForm = ({ processSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();

    processSubmit(name);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        New best crypto Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <input type="submit" value="Elect new best crypto" />
    </form>
  );
};

export default NameForm;
