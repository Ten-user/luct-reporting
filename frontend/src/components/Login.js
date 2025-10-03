// frontend/src/components/Login.js
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "lecturer",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      let res;
      if (isRegister) {
        res = await API.post("/auth/register", form);
      } else {
        res = await API.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
      }

      // ✅ Save user details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("role", res.data.user.role);

      // ✅ Redirect based on role
      const role = res.data.user.role;
      if (role === "student") navigate("/monitoring");
      else if (role === "lecturer") navigate("/classes");
      else if (role === "prl") navigate("/courses");
      else if (role === "pl") navigate("/lectures");
      else navigate("/reports");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error");
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h3>{isRegister ? "Register" : "Login"}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              {isRegister && (
                <div className="mb-3">
                  <label className="form-label">Full name</label>
                  <input
                    name="name"
                    onChange={onChange}
                    value={form.name}
                    className="form-control"
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  onChange={onChange}
                  value={form.email}
                  className="form-control"
                  type="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  onChange={onChange}
                  value={form.password}
                  className="form-control"
                  type="password"
                  required
                />
              </div>
              {isRegister && (
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    className="form-select"
                    onChange={onChange}
                    value={form.role}
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="prl">PRL</option>
                    <option value="pl">PL</option>
                  </select>
                </div>
              )}
              <button className="btn btn-primary w-100">
                {isRegister ? "Register" : "Login"}
              </button>
            </form>
            <hr />
            <p className="text-center">
              <button
                className="btn btn-link"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? "Already have an account? Login"
                  : "Need an account? Register"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
