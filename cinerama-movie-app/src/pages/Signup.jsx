import React, { useState } from "react";

import { signup } from "../appwrite";

import { useNavigate } from "react-router";



const Signup = () =>
{
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleSignup = async (e) =>
  {
    e.preventDefault();
  
    setError("");

  
    try
    {
      // await signup(email, password, name, navigate);
    
      // after signup we redirected to home (session created in createAccount)
      
        // window.location.href = "/";

      

      // ✅ Call signup; verification email sent in appwrite.js

        await signup(email, password, name, navigate);
    } 
    
    catch (err)
    {
      console.error(`Failed to create account: ${err}`);
    
      setError("Failed to create account. Check input / project settings!");
    }
  };

  return (
    
    <div className="auth-page">
      
      <form className="auth-card" onSubmit={handleSignup}>
        
        <h2>Create Account</h2>
        

        <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        {/* <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required /> */}

        {/* Password field with visibility toggle */}

          <div className="relative password-field">
    
            <input
      
              type={showPassword ? "text" : "password"}
      
              placeholder="Password"
      
              value={password}
      
              onChange={(e) => setPassword(e.target.value)}
      
              required
      
              className="w-full pr-10"
    
            />
    
            <span
      
              onClick={() => setShowPassword((prev) => !prev)}
      
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#7c5cff]"
      
              title={showPassword ? "Hide password" : "Show password"}
    
            >
      
              {showPassword ? "🙈" : "👁️"}
    
            </span>

          </div>

        

        {error && <p className="auth-error">{error}</p>}
        

        <button className="auth-btn mb-1" type="submit">Sign up</button>

        
        <p className="muted">
          
          Already have an account? <a href="/login">Login</a>
        
        </p>
      
      </form>
    
    </div>

  );
};



export default Signup;