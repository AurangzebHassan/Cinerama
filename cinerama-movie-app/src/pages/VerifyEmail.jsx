import React, { useEffect, useState } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

import { account } from "../appwrite";



const VerifyEmail = () =>
{
    const [searchParams] = useSearchParams();
  
    const [message, setMessage] = useState("Verifying your email...");

    const [resendEmail, setResendEmail] = useState("");

    const [resendPassword, setResendPassword] = useState("");

    const [showResendPassword, setShowResendPassword] = useState(false);

    const [resendMsg, setResendMsg] = useState("");

    const navigate = useNavigate();



    // detect reason parameter
        
        const reason = searchParams.get("reason");


    
    useEffect(() =>
    {
        const verifyEmail = async () =>
        {
          const userId = searchParams.get("userId");

          const secret = searchParams.get("secret");

          // if (!userId || !secret)
          // {
          //     setMessage("❌ Invalid verification link.");

          //     return;
          // }

          // try
          // {
          //     // Try to verify normally first

          //         await account.updateVerification(userId, secret);   // verify the account in appwrite

            
          //     // ✅ Show success message — no redirect, no auto-close

          //         setMessage("✅ Email verified!");
          // }

          // catch (err)
          // {
          //     console.error("Verification failed:", err);

          //     setMessage("❌ Verification failed. The link may have expired or been used already.");
          // }
          
            
            
            
        // 🔹 CASE 1 — Redirected from Google OAuth (unverified)
      
            if (reason === "oauth_unverified")
            {
                setMessage("⚠️ You tried signing in with Google, but your email is not verified. Please verify your email first.");
        
                return; // stop here, don’t attempt updateVerification
            }


            
        // 🔹 CASE 2 — Normal verification link from email

            // If the user came here manually (e.g. via Google OAuth)
            
            if (!userId || !secret)
            {
                try
                {
                    const user = await account.get();


                    // Google OAuth users have verified emails already
                    
                        if (user && user.emailVerification)
                        {
                            setMessage("✅ Your Google account is already verified!");
                    

                            // Google user is already verified so redirect to MoviesPage aka home. Not to login.

                                setTimeout(() => navigate("/"), 1500);
                    
                            
                            return;
                        }


                    // Unverified so that's going to be an email/password user that came manually
            
                        setMessage("❌ Invalid or missing verification link.");
                } 
            
                catch
                {
                    setMessage("❌ Invalid verification link or not logged in.");
                }
            
                return;
            }



        // 🔹 CASE 3 — Normal email/password verification flow

            // Normal email/password verification flow
        
            try
            {
                await account.updateVerification(userId, secret);
              
                
                setMessage("✅ Verification Successful!\n\n You can now log in.");
                
                // setTimeout(() => navigate("/login"), 2000);
          } 
          
            catch (err)
            {
                console.error("Verification failed:", err);
            
                setMessage("❌ Verification Failed.\n\n Link may be expired or already used.");
            }
        };

      
        verifyEmail();
      
    }, [searchParams, navigate, reason]);

    
    
    const handleResendVerification = async () =>
    {
        if (!resendEmail || !resendPassword)
        {
            setResendMsg("Enter email and password to resend verification.");
        
            return;
        }


        try
        {
            // 1️⃣ Try to clear any existing session first (from OAuth or previous login)
            
                try
                {
                    await account.deleteSession("current");
    
                    console.log("✅ Cleared old session before resend");
                }
                
                catch (err)
                {
                    console.warn("⚠️ No session to delete before resend (safe to ignore)", err);
                }


            // 2️⃣ Wait briefly to avoid Appwrite’s rate limiter
    
                await new Promise((res) => setTimeout(res, 1000));


            // 3️⃣ Create a temporary session to authenticate resend
    
                await account.createEmailPasswordSession({ email: resendEmail, password: resendPassword });


            // 4️⃣ Send verification email
    
                await account.createVerification(`${window.location.origin}/verify-email`);
    
                setResendMsg("📧 Verification email sent — check your inbox.");


            // 5️⃣ Wait briefly then clean up session
    
                await new Promise((res) => setTimeout(res, 500));
    
                await account.deleteSession("current");
        }
        
        catch (err)
        {
            console.error("Resend failed:", err);

            if (err.code === 401) setResendMsg("Incorrect email or password.");

            else if (err.code === 429) setResendMsg("Too many attempts. Wait 30s and retry.");

            // setResendMsg("❌ Failed to resend verification.\n\n Check your credentials and try again.");
        }
    }






    return (
    
        <div className="auth-page">
        
            <div className="auth-card">
        
                <h2>Email Verification</h2>
        
                {/* <p className="text-light-200 100 mt-5 mb-5 text-sm">{message}</p> */}

                {/* 🔹 Updated message display */}
        
                    <p className="text-light-200 mt-5 mb-5 text-sm whitespace-pre-line">
            
                        {message}
            
                    </p>
        
                

                {/* optional: small hint for user */}
                
                    {message.startsWith("✅") && (
                        
                    <p className="text-light-100 mt-8 text-sm">
                        
                        Close this tab and log in from your main window.
                        
                    </p>

                )}



                {(message.startsWith("❌") || reason === "oauth_unverified") && (
  
                    <>
                    
                        <p className="text-light-100 mt-6 text-sm">The verification link is invalid or expired.</p>

                        <hr className="text-[#7c5cff] mt-6"/>

                        
                        {/* RESEND FORM */}
                            
                            <div className="mt-6">

                            
                                <p className="muted mb-2">Email & Password (OAuth Credentials)</p>

                            
                                <input type="email" placeholder="Email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)} />
                            

                            {/* <input type="password" placeholder="Password" value={resendPassword} onChange={(e) => setResendPassword(e.target.value)} /> */}
                            
                            {/* Password field with visibility toggle */}

                                <div className="relative password-field">
    
                                    <input
        
                                        type={showResendPassword ? "text" : "password"}
                                    
                                        placeholder="Password"    
        
                                        value={resendPassword}
        
                                        onChange={(e) => setResendPassword(e.target.value)}
        
                                        required
        
                                        className="w-full pr-10"
    
                                    />
    
                                    <span

                                        onClick={() => setShowResendPassword((prev) => !prev)}
        
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#7c5cff]"
        
                                        title={showResendPassword ? "Hide password" : "Show password"}
    
                                    >
        
                                        {showResendPassword ? "🙈" : "👁️"}
    
                                    </span>

                                </div>


 
                                {resendMsg && <p className="text-red-400 mt-3 mb-3">{resendMsg}</p>}


                            
                                <button className="auth-btn secondary mt-3 mb-6" onClick={handleResendVerification}>
                                
                                    Resend Verification Email
                            
                                </button>

                            
                            </div>
                            
                        
                        {/* {resendMsg && alert(resendMsg)} */}




                        <a href="/login" className="text-[20px] text-[#7c5cff]"> ⬅ <span className="hover:underline focus:underline text-[20px] text-[#7c5cff]"> Login </span> </a>

                    </>

                )}

        
            </div>
    
        </div>

    );
};



export default VerifyEmail;






// import React, { useEffect, useState } from "react";

// import { account, sendVerificationEmail } from "../appwrite.js";

// import { useNavigate } from "react-router-dom";



// const VerifyEmail = () =>
// {

//     const navigate = useNavigate();

//     const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'

//     const [error, setError] = useState("");

//     const [email, setEmail] = useState("");

//     const [password, setPassword] = useState("");

//     const [showResend, setShowResend] = useState(false);

//     const [infoMsg, setInfoMsg] = useState("");



//     useEffect(() =>
//     {
    
//         const params = new URLSearchParams(window.location.search);
    
//         const userId = params.get("userId");
    
//         const secret = params.get("secret");


//         if (!userId || !secret)
//         {
//             setStatus("error");
      
//             setError("⚠️ Missing or invalid verification link.");
      
//             setShowResend(true);
      
//             return;
//         }


//     // Try to verify email
    
//         (async () =>
//         {
//             try
//             {
//                 await account.updateVerification(userId, secret);
        
//                 setStatus("success");
        
//                 setInfoMsg("✅ Email verified successfully!");
        
//                 // setTimeout(() => navigate("/login"), 2500);
//             } 
      
//             catch (err)
//             {
//                 console.error("Email verification failed:", err);
        
//                 setStatus("error");
        
//                 setError("⚠️ Invalid or expired verification link.");
        
//                 setShowResend(true);
//             }

//         })();

//   }, [navigate]);

    
    
//     const handleResendVerification = async () =>
//     {
//         if (!email || !password)
//         {
//             setError("Please enter your email and password to resend verification.");
      
//             return;
//         }

//         try
//         {
//             await sendVerificationEmail(email, password);
      
//             setError("");
      
//             setInfoMsg("📧 Verification email resent! Check your inbox.");
      
//             setShowResend(false);
//         } 
    
//         catch (err)
//         {
//             console.error("Resend failed:", err);
      
//             setError("Failed to resend verification email. Try again later.");
//         }
//     };



//   return (
    
//       <div className="auth-page">
      
//           <div className="auth-card">
        
              
//               <h2>Email Verification</h2>

              
        
//                 {status === "loading" && (
          
//                     <p className="muted">Verifying your email, please wait...</p>

//                 )}

                    
        
//                 {status === "success" && (
          
//                     <p className="auth-success mt-3 mb-3">{infoMsg}</p>

//                 )}


              
        
//               {status === "error" && (
          
//                   <>
            
//                       <p className="auth-error mt-3 mb-3">{error}</p>

            
//                       {showResend && (
              
//                           <>
                
//                               <p className="muted mb-2">
                  
//                                   Enter your credentials to resend the verification link:
                
//                               </p>

                
//                               <input
                  
//                                   type="email"
                  
//                                   placeholder="Email"
                  
//                                   value={email}
                  
//                                   onChange={(e) => setEmail(e.target.value)}
                  
//                                   required
                
//                               />

                              
                
//                               <input
                  
//                                   type="password"
                  
//                                   placeholder="Password"
                  
//                                   value={password}
                  
//                                   onChange={(e) => setPassword(e.target.value)}
                  
//                                   required
                
//                               />

                              
                
//                               <button
                  
//                                   className="auth-btn secondary mt-3"
                  
//                                   onClick={handleResendVerification}
                
//                               >
                  
//                                   Resend Verification Email                  
                
//                               </button>
              
//                           </>
            
//                       )}
          
//                   </>
        
//               )}

        
//               {/* {infoMsg && !showResend && (
          
//                   <p className="auth-info mt-3 mb-3">{infoMsg}</p>
        
//               )} */}

              
        
//               <p className="muted mt-3">
          
//                   <a href="/login">← Back to Login</a>
        
//               </p>
      
//           </div>
    
//       </div>
  
//   );
// };



// export default VerifyEmail;