import React from "react";

const NavBar = ({ account, network, connect}) => {
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark shadow mb-5">
        <h1 className="navbar-brand my-auto"> Best crypto </h1>
        <ul className="navbar-nav">
          <li className="nav-item text-white">

            {network} -
            {account != null ? (
              account
            ) : (
              <button onClick={connect}> Connect Metamask </button>
            )}{" "}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
