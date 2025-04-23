import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import logo from "../assets/logo.png"; // Adjust the path if needed

function Footer() {
  return (
    <footer className="bg-gray-100 py-12 px-6 md:px-12 lg:px-24 text-center">
      <div className="max-w-6xl mx-auto">
        
        {/* Logo */}
        <div className="flex justify-center items-center mb-2">
          <img src={logo} alt="SmartStock Logo" className="h-12 w-auto" />
        </div>

        {/* Newsletter Subscription */}
        <p className="text-gray-600 text-lg">Subscribe to our newsletter</p>
        <div className="flex flex-col sm:flex-row justify-center mt-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded-md sm:rounded-l-md sm:rounded-r-none w-full sm:w-auto"
          />
          <button className="bg-purple-600 text-white px-6 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md mt-1 sm:mt-0">
            Subscribe
          </button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Product</h3>
            <p className="hover:underline cursor-pointer">Features</p>
            <p className="hover:underline cursor-pointer">Pricing</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Resources</h3>
            <p className="hover:underline cursor-pointer">Blog</p>
            <p className="hover:underline cursor-pointer">User guides</p>
            <p className="hover:underline cursor-pointer">Webinars</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <p className="hover:underline cursor-pointer">About us</p>
            <p className="hover:underline cursor-pointer">Contact us</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Plans & Pricing</h3>
            <p className="hover:underline cursor-pointer">Personal</p>
            <p className="hover:underline cursor-pointer">Startup</p>
            <p className="hover:underline cursor-pointer">Organization</p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mt-6">
          <a href="#"><Facebook/></a>
          <a href="#"><Linkedin /></a>
          <a href="#"><Instagram/></a>
          <a href="#"><Twitter/></a>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-gray-500 text-sm">
          © 2024 Brand, Inc. • <a href="#" className="hover:underline">Privacy</a> • 
          <a href="#" className="hover:underline">Terms</a> • 
          <a href="#" className="hover:underline">Sitemap</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
