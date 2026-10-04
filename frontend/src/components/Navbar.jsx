import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">🌿 LeafLog</NavLink>
      <div className="links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/plants">My Plants</NavLink>
        <NavLink to="/guide">Care Guide</NavLink>
        <NavLink to="/assistant">Care Assistant</NavLink>
        <a href="/register/index.html" className="signup">Sign up</a>
      </div>
    </nav>
  );
}

export default Navbar;
