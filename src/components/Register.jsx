import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerWithEmail } from "@/store/authSlice";
import { toast } from "react-toastify";

/**
 * Registration page for creating a new account with email/password.
 * Redirects to home when already authenticated.
 * @returns {JSX.Element}
 */
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(s=>s.auth.user);

  useEffect(() => { if(user) navigate("/"); }, [user,navigate]); // Redirect if already logged in

  const handleRegister = async e => {
    e.preventDefault();
    try {
      await dispatch(registerWithEmail({ email, password })).unwrap();
      toast.success("User signed up Successfully");
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-2xl shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">
          Register
        </button>
        <p className="text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
