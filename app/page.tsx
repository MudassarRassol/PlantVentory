export default function Home() {
  return (
    <>
      <div className=" w-full h-[93vh] bg-gradient-to-t from-[#0080009c]   to-white-600  flex items-center justify-center relative ">

        <section className=" py-16 px-6 text-center z-40 ">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500   to-green-900   text-transparent bg-clip-text mb-6">
              🌱 Welcome to PlantVentory!
            </h1>
            <p className="text-lg md:text-xl text-green-700 mb-4">
              Your one-stop destination for organizing, tracking, and growing
              your plant collection with ease.
            </p>
            <p className="text-base md:text-lg text-green-600 mb-8">
              Whether you're a seasoned plant parent or just starting your green
              journey, PlantVentory helps you keep everything thriving. From
              detailed plant profiles to care reminders and growth tracking, we
              make plant care simple, fun, and rewarding.
            </p>
            <p className="text-lg md:text-xl font-medium text-green-700">
              🌿 Discover. 🌼 Organize. 🌵 Grow.
            </p>
            <a
              href="#get-started"
              className="mt-10 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Start Your Plant Journey
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
