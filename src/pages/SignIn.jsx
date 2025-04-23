import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle Email & Password Sign-In
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(""); // Reset errors before new attempt
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard"); // Redirect on success
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
        
            if (!userDocSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date(),
                    categories: []
                  });
            }
            navigate("/dashboard"); // Redirect on success
        } catch (err) {
            setError("Failed to sign in with Google.");
        }
    };

    return (
<div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 max-w">
            Or &nbsp;
            <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500">
                Create an account
            </Link>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <form className="space-y-6" onSubmit={handleSignIn}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember_me" type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                Sign in
                            </button>
                        </div>
                    </form>
            

          <div class="mt-6">
            <button  onClick={handleGoogleSignIn}
                class="cursor-pointer w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <img class="h-6 w-6 mr-2" src="https://www.svgrepo.com/show/506498/google.svg" alt="Google" />
                Continue with Google
            </button>
        </div>
        </div>
    </div>
</div>
    )
}

export default SignIn;