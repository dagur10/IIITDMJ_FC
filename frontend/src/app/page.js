import Image from "next/image";

export default function Home() {
  return (
    // Replaced solid background with the green-50 to white gradient
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white font-sans">
      <main className="flex w-full max-w-5xl flex-col items-center gap-12 px-6 py-20 text-center md:py-32">
        
        {/* Championship Title Section */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-4">
            Current Inter IIIT Champions
          </h1>
          <p className="max-w-2xl text-xl text-gray-600">
            Dominating the field with passion, unity, and relentless drive. We don't just play the game; we define it.
          </p>
        </div>

        {/* Team Photo Section */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
          <Image
            src="/team-photo.jpg" // Make sure to add this image to your public folder
            alt="The Championship Team"
            width={1200}
            height={600}
            className="h-auto w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8">
            <p className="text-xl font-medium text-white italic">
              "Talent wins games, but teamwork and intelligence win championships."
            </p>
          </div>
        </div>

        {/* Motivational Grid */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center gap-2 bg-white rounded-lg shadow hover:shadow-lg transition p-6 group border border-gray-100">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
              Relentless Effort
            </h3>
            <p className="text-gray-600">
              Success isn't owned. It's leased, and rent is due every single day.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="flex flex-col items-center text-center gap-2 bg-white rounded-lg shadow hover:shadow-lg transition p-6 group border border-gray-100">
            <div className="text-4xl mb-2">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
              Unbreakable Unity
            </h3>
            <p className="text-gray-600">
              We rise by lifting others. Together, we are an unstoppable force.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="flex flex-col items-center text-center gap-2 bg-white rounded-lg shadow hover:shadow-lg transition p-6 group border border-gray-100">
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
              Future Focused
            </h3>
            <p className="text-gray-600">
              The trophy is in our hands, but our eyes are already on the next victory.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex gap-4 mt-4">
          {/* Primary Action mapped to the green button style */}
          <a
            href="/gallery"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow"
          >
            View Gallery
          </a>
          {/* Secondary Action mapped to the light green info-box style */}
          <a
            href="/members"
            className="inline-block bg-green-50 border-2 border-green-200 text-green-900 hover:bg-green-100 font-semibold py-3 px-6 rounded-lg transition"
          >
            Meet the Club
          </a>
        </div>
      </main>
    </div>
  );
}