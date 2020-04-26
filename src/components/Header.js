import React from "react"

const Header = props => {
  const headerStyle = {
    padding: "20px 0",
    lineHeight: "2em",
  };
  return (
    <header style={headerStyle}>
      <h1 style={{ fontSize: "25px", marginBottom: "15px", textAlign: "center"}}>
        Similar Sentences Search App
      </h1>
    </header>
  )
};

export default Header