import { Outlet, Link, NavLink } from "react-router-dom";

export default function App() {
  return (
    <div className="container">
      <header className="row" style={{justifyContent:'space-between'}}>
        <Link to="/" style={{textDecoration:'none'}}><h2>Property Price — Tracker</h2></Link>
        <nav className="row" style={{gap:8}}>
          <NavLink to="/" className="badge">Properties</NavLink>
        </nav>
      </header>
      <Outlet />
      <footer className="small">No auth. Demo only.</footer>
    </div>
  )
}
