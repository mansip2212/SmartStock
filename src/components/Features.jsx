import { Link } from "react-router-dom";

function Features() {
    return (
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-54">
          {/* Grid Layout */}
          <div className="grid gap-16 md:gap-12 md:grid-cols-2 items-center">
            
            {/* Real-Time Tracking (Text Left, Image Right) */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Real-Time Tracking</h2>
              <p className="mt-4 text-gray-600">
                Monitor your inventory status instantly with our real-time tracking feature, ensuring you are always informed about stock levels and movements.
              </p>
              <div className="mt-6 flex space-x-4">
                <Link to="/signup">
                    <button className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                    Try now
                    </button>
                </Link>
                <button className="cursor-pointer text-purple-600 hover:underline">Learn more</button>
              </div>
            </div>
            <div>
              <img 
                src="https://www.locate2u.com/wp-content/uploads/A-1-29-1024x576.webp" 
                alt="Real-Time Tracking" 
                className="rounded-lg shadow-lg object-cover w-full max-h-[350px]" 
              />
            </div>
  
            {/* Stock Optimization (Image Left, Text Right) */}
            <div className="md:order-1">
              <img 
                src="https://metrobi.com/wp-content/uploads/2024/05/inventory-optimization-1024x585.webp" 
                alt="Stock Optimization" 
                className="rounded-lg shadow-lg object-cover w-full max-h-[350px]" 
              />
            </div>
            <div className="md:order-2">
              <h2 className="text-3xl font-bold text-gray-900">Stock Optimization</h2>
              <p className="mt-4 text-gray-600">
                Optimize your stock levels efficiently to reduce waste and meet demand accurately, thanks to our smart algorithms and predictive analytics.
              </p>
              <div className="mt-6 flex space-x-4">
                <Link to="/signup">
                <button className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                  Try now
                </button>
                </Link>
                <button className="cursor-pointer text-purple-600 hover:underline">Learn more</button>
              </div>
            </div>
  
          </div>
        </div>
      </section>
    );
  }
  
  export default Features;
  