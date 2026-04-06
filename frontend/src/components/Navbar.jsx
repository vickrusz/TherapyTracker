import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Dashboard
      </Link>
      <Link to="/patients" style={{ marginRight: "1rem" }}>
        Patients
      </Link>
      <Link to="/patients/new">
        Add Patient
      </Link>
    </nav>
  );
}