import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col items-center gap-12 px-6 py-20 text-center md:py-32">
        {/* Championship Title Section */}
        <div className="flex flex-col items-center gap-4">
          
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Current Inter IIIT Champions
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Dominating the field with passion, unity, and relentless drive. We don't just play the game; we define it.
          </p>
        </div>

        {/* Team Photo Section */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl dark:border-zinc-800">
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
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="text-3xl">🔥</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Relentless Effort</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Success isn't owned. It's leased, and rent is due every single day.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="text-3xl">🤝</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Unbreakable Unity</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              We rise by lifting others. Together, we are an unstoppable force.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="text-3xl">🚀</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Future Focused</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              The trophy is in our hands, but our eyes are already on the next victory.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex gap-4">
          <a
            href="/gallery"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            View Gallery
          </a>
          <a
            href="/members"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Meet the Club
          </a>
        </div>
      </main>
    </div>
  );
}