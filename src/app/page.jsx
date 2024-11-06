export default function Home() {
  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-800 via-black to-gray-900">
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-4xl font-semibold text-white mb-4">Welcome to My Website</h1>
        <p className="text-lg text-gray-300 mb-6">
          This is a simple demo page with a dark theme and a floating box. Hover over the box for an extra effect!
        </p>
        <div className="floating-box bg-opacity-70 bg-black text-white p-8 rounded-xl shadow-lg hover:translate-y-[-10px] hover:shadow-2xl transition-all">
          Hover over me!
        </div>
      </div>
    </div>
  );
}
