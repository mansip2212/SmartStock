import background from '../assets/background.png';

function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        {/* Background Image */}
        
        <div className="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: `url(${background})` }}></div>

        {/* Overlay Text */}
        <div className="relative z-10 max-w-3xl px-6 md:px-12">  
          {/* Limits width, adds padding on smaller screens */}
          <h1 className="text-4xl md:text-5xl font-bold">
            Optimize Your Inventory with SmartStock
          </h1>
          <p className="text-lg mt-4">
            Revolutionize your stock management with real-time insights and automation.
          </p>
          <button className="mt-6 cursor-pointer bg-purple-600 px-6 py-2.5 text-lg rounded-md hover:bg-purple-700 transition duration-300">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 text-center px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold">SmartStock Features</h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          SmartStock offers a comprehensive suite of tools designed to enhance inventory management 
          through real-time tracking, stock optimization, and increased operational efficiency.
        </p>
      </section>
    </>
  );
}

export default Hero;
