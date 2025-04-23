import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "../config/firebase"; // Import Firestore database
import { collection, getDocs } from "firebase/firestore";

function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);

  // Fetch testimonials from Firestore
  useEffect(() => {
    const fetchTestimonials = async () => {
      const querySnapshot = await getDocs(collection(db, "testimonials"));
      const fetchedTestimonials = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(fetchedTestimonials);
    };

    fetchTestimonials();
  }, []);

  const prevTestimonial = () => setIndex((index - 1 + testimonials.length) % testimonials.length);
  const nextTestimonial = () => setIndex((index + 1) % testimonials.length);

  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold">Hear from our awesome users!</h2>
      {testimonials.length > 0 ? (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button onClick={prevTestimonial} className="cursor-pointer p-2 bg-gray-200 rounded-full">
            <ChevronLeft />
          </button>

          <div className="bg-white shadow-lg p-6 rounded-lg w-80">
            <img src={testimonials[index].image} alt={testimonials[index].name} className="w-12 h-12 rounded-full mx-auto"/>
            <h3 className="mt-4 font-semibold">{testimonials[index].name}</h3>
            <p className="text-yellow-500">{"⭐".repeat(testimonials[index].rating)}</p>
            <p className="mt-2 text-gray-600">{testimonials[index].text}</p>
          </div>

          <button onClick={nextTestimonial} className="cursor-pointer p-2 bg-gray-200 rounded-full">
            <ChevronRight />
          </button>
        </div>
      ) : (
        <p className="mt-6 text-gray-500">Loading testimonials...</p>
      )}
    </section>
  );
}

export default TestimonialSection;
