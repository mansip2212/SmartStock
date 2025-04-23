import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      alert("Signed in with Google successfully!");
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      console.log(userDocSnap);
      if (!userDocSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
          categories: []
        });
      }
    navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("Account created successfully!");
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        categories: []
      });
    
      navigate("/dashboard"); // Redirect to Sign In
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          Or &nbsp;
          <Link to="/signin" className="font-medium text-purple-600 hover:text-purple-500">
            Log In to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input 
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
                Sign Up
              </button>
            </div>
          </form>


          <div class="mt-6">
            <button onClick={googleSignIn}
                class="cursor-pointer w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <img class="h-6 w-6 mr-2" src="https://www.svgrepo.com/show/506498/google.svg" alt="Google" />
                Continue with Google
            </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
