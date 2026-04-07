// import React, { useState } from "react";

// import { login, getCurrentUser } from "../appwrite.js";

// import { sendVerificationEmail, loginWithGoogle } from '../appwrite.js'



// const Login = () =>
// {
//   const [email, setEmail] = useState("");

//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");

//   const [showResend, setShowResend] = useState(false);



//   const handleLogin = async (e) =>
//   {
//     e.preventDefault();
	
//     setError("");
	
//     setShowResend(false);

	
//     try
//     {
//       await login(email, password);
		

//       // reload to force App-level auth check (or navigate to home)
		
//         // window.location.href = "/";
			

//       const user = await getCurrentUser();


//       if (!user.emailVerification)
//       {
//         setError('Please verify your email before logging in!');

//         setShowResend(true);  // show resend verification email button

//         return;
//       }


//       window.location.href = "/"
//     }
		
//     catch (err)
//     {
//       console.error(`Login failed: ${error}`);


//       // ✅ 1. Handle custom EMAIL_NOT_VERIFIED error

//         if (err.message === "EMAIL_NOT_VERIFIED")
//         {
//           setError("Please verify your email before logging in!");
				
//           setShowResend(true); // ✅ show resend button
//         } 
			

//       // ✅ 2. Handle invalid credentials from Appwrite
	
//         if (
				
//             err.code === 401 ||                      // Unauthorized (wrong credentials)
			
//             err.code === 400 ||                      // Bad request (malformed)
			
//             err.type === "user_invalid_credentials"  // Sometimes Appwrite sends this

//           )
//         {
//           setError("Invalid email or password!");
			
//           return;
//         }

			
//       // ✅ 3. Handle other possible errors
			
//         if (err.code === 429)
//         {
//           setError("Too many login attempts. Please wait a minute and try again!");
			
//           return;
//         }  

			
//       // ✅ 4. Fallback for unexpected cases
		
//         setError("An unexpected error occurred. Please try again!");
//     }
//   };



//   const handleSendVerification = async () =>
//   {
//     try
//     {
//       await sendVerificationEmail(email, password);
//     }
		
//     catch (err)
//     {
//       console.error("Error sending verification email:", err);

//       setError('Error sending verification email!');
//     }
//   };
	
	
	
//   return (
		
//     <div className="auth-page">
			
//       <form className="auth-card" onSubmit={handleLogin}>
				
//         <h2>Login</h2>
				

//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				

//         {error && <p className="auth-error mt-3 mb-3">{error}</p>}
				

				
//         {/* Only show resend button when needed */}
					
//          {showResend && (
						
//             <button
							
//               type="button"
							
//               className="auth-btn secondary mt-3 mb-3"
							
//               onClick={handleSendVerification
								
//               //   async () => 
//               // {  
//               //   try
//               //   {  
//               //     console.log("Resending verification email...");
									
//               //     await account.createVerification(`${window.location.origin}/verify-email`);
									
//               //     alert("Verification email sent! Check your inbox.");
//               //   }
								
//               //   catch (err)
//               //   {  
//               //     console.error("Error sending verification email:", err);
									
//               //     alert("Failed to resend verification email. Please try again.");
//               //   }
//               // }
//               }           
//             >
						
//               Resend Verification Email
						
//             </button>
//           )}

				

//         <button type="submit" className="auth-btn">Login</button>


				
//         {/* Google sign-in button */}
 
//           {/* <button
 
//             type="button"
						
//             className="auth-btn google-btn"
						
//             onClick={loginWithGoogle}
//           >
						
//             Continue with Google
					
//           </button> */}

						
				
//           <button type="button" className={`btn-165 google-btn mt-4 mb-1 ${showResend ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => {
//                                                                                                                                                   if (showResend) 
//                                                                                                                                                     {
//                                                                                                                                                       alert("⚠️ Please verify your email before continuing with Google.");
																																																																										
//                                                                                                                                                       return;
//                                                                                                                                                     }
																																																																									
//                                                                                                                                                     loginWithGoogle();
								 
//                                                                                                                                                   }}
//             disabled={showResend}
				
//           >
						
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262">
								
//                 <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
								
//                 <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
								
//                 <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
								
//                 <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
						
//             </svg>
						
					
//             <span> Continue with Google </span>
						
//           </button>
					
				

//           <p className="muted">
					
//             Don't have an account? <a href="/signup">Sign up</a>
				
//           </p>
					
				

//            {/* <p className="muted text-xs mt-2">
						
//             ⚠️ If you signed up manually, please log in with email & password.
						
//             “Sign in with Google” creates a separate account.
						
//           </p> */}
			
//       </form>
		
//     </div>

//   );
// };



// export default Login;






import React, { useState, useEffect } from "react";

import { login, getCurrentUser, sendVerificationEmail, loginWithGoogle } from "../appwrite.js";

import { useLocation } from "react-router-dom";



const Login = () =>
{
	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");

	const [showPassword, setShowPassword] = useState(false);

	const [error, setError] = useState("");

	const [showResend, setShowResend] = useState(false);

	const [checkingUser, setCheckingUser] = useState(true);

	const location = useLocation(); // CHANGED: read location state



	// CHANGED: detect if user arrived after signup

		useEffect(() =>
		{
			if (location?.state?.justSignedUp)
			{
				const signedUpEmail = location.state.email || "";

				setEmail(signedUpEmail); // prefill email

				setShowResend(true); // show resend verification button and disable OAuth

				setError("Please verify your email. A verification link was sent.");

				// NOTE: We do NOT autofill password; user must enter password to resend (sendVerificationEmail needs auth).
			}

			
			setCheckingUser(false);
			
		}, [location]);


	
	// polling feature aka  This is a real-time verification watcher — Every 4s it checks if the user’s email has been verified. Once verified → hides the resend button and enables Google login automatically.
		
		useEffect(() =>
		{
			if (!showResend) return;

			let t;

			const poll = async () =>
			{
				try
				{
					const user = await getCurrentUser(); // from appwrite.js

					if (user && user.emailVerification)
					{
						setShowResend(false);

						setError("Email verified. You can now sign in or use Google!");

						return;
					}
				}
				
				catch (err)
				{
					console.error(err);
				}


				t = setTimeout(poll, 4000);
			};


			poll();

			return () => clearTimeout(t);

		}, [showResend]);






	const handleLogin = async (e) =>
	{
		e.preventDefault();

		setError("");

		setShowResend(false);


		try
		{
			await login(email, password);

			const user = await getCurrentUser();

				
			if (!user.emailVerification)
			{
				setError("Please verify your email before logging in!");

				setShowResend(true); // show resend verification email button

				return;
			}


			// verified -> go to home

				window.location.href = "/";
		} 
		
		catch (err)
		{
			console.error(`Login failed: ${err}`);

			// ✅ 1. Handle custom EMAIL_NOT_VERIFIED error

				if (err.message === "EMAIL_NOT_VERIFIED")
				{
					setError("Please verify your email before logging in!");

					setShowResend(true); // ✅ show resend button

					return;
				}


			// ✅ 2. Handle invalid credentials from Appwrite

				if  (
				
						err.code === 401 || // Unauthorized (wrong credentials)
				
						err.code === 400 || // Bad request (malformed)
				
						err.type === "user_invalid_credentials" // Sometimes Appwrite sends this

						)
				{
					setError("Invalid email or password!");

					return;
				}

			
			// ✅ 3. Handle other possible errors

				if (err.code === 429)
				{
					setError("Too many login attempts. Please wait a minute and try again!");

					return;
				}

			
			// ✅ 4. Fallback

				setError("An unexpected error occurred. Please try again!");
		}
	};



	const handleSendVerification = async () =>
	{
		try
		{
			// sendVerificationEmail requires the user to authenticate (we create a temporary session)

			// So user must provide password. At this point email is prefilled (if coming from signup).

				if (!email || !password)
				{
					setError("Enter email and password below and click resend!");

					return;
				}

				
			// sendVerificationEmail will create a temporary session, send the verification link, and then delete the temp session
			
				await sendVerificationEmail(email, password);

			
			// After sending, keep showResend true (we still don't allow OAuth until they verify).

				setShowResend(true);

			setError("Verification email sent — check your inbox!");
		} 
		
		catch (err)
		{
			console.error("Error sending verification email:", err);

			setError("Error sending verification email!");
		}
	};



	// CHANGED: block Google if we know account is unverified
  
		const handleGoogleClick = async () =>
		{
			if (showResend)
			{
				alert("⚠️ Please verify your email first. Use the resend verification button.");
		
				return;
			}
		
		
			// Optional: if you want to be extra safe and you have an email input filled, call server-side check here (see Server option below)
		
				await loginWithGoogle();
		};


	if (checkingUser) return <p className="text-white text-center mt-6">Checking user status...</p>;






	return (
		
		<div className="auth-page">
		
			<form className="auth-card" onSubmit={handleLogin}>

				
							
				<h2>Login</h2>
				
							
				<input

					type="email"

					placeholder="Email"

					value={email}

					onChange={(e) => setEmail(e.target.value)}

					required

				/>

				
				{/* <input
				
					type="password"
					
					placeholder="Password"
					
					value={password}
					
					onChange={(e) => setPassword(e.target.value)}
					
					required
 
				/> */}

				
				{/* Password field with toggle eye */}
					
					<div className="relative password-field mt-3">
					
						<input
							
							type={showPassword ? "text" : "password"}
							
							placeholder="Password"
							
							value={password}
							
							onChange={(e) => setPassword(e.target.value)}
							
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



				{error && <p className="auth-error mt-3 mb-3">{error}</p>}



				{/* Only show resend button when needed */}

				
				{showResend && (
				
					<button
				
						type="button"
				
						className="auth-btn secondary mt-3 mb-3"
				
						onClick={handleSendVerification}
				
					>
						
						Resend Verification Email
					
					</button>
				
				)}
				

				<button type="submit" className="auth-btn">
				
					Login
				
				</button>

				
				{/* Google sign-in button: disabled while showResend is true */}

				
				<button
				
					type="button"
				
					className={`btn-165 google-btn mt-4 mb-1 ${showResend ? "opacity-50 cursor-not-allowed" : ""}`}
					
					onClick={ handleGoogleClick }
					
					disabled={showResend}
				
				>
				
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262">
				
						<path
				
							fill="#4285F4"
				
							d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
						>
 
						</path>

						
						<path
						
							fill="#34A853"
							
							d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
						
						>

						</path>

						
						<path
						
							fill="#FBBC05"
						
							d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
						
						>

						</path>

						
						<path

							fill="#EB4335"
							
							d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
						
						>

						</path>
					
					</svg>

					
					<span> Continue with Google </span>
				
				
				</button>
				

				<p className="muted">
				
					Don't have an account? <a href="/signup">Sign up</a>
				
				</p>



			</form>
		
		</div>
	
	);
};



export default Login;