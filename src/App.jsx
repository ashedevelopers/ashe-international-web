import { Routes, Route } from 'react-router-dom';

// Placeholder shell. Page sections are built in Step 2 (see README blueprint).
function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-ashe-green px-6 text-center text-white">
      <div>
        <p className="mb-4 text-sm uppercase tracking-widest text-ashe-yellow">Action For Save Humanity Emergency</p>
        <h1 className="text-kinetic font-bold">ASHE</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
          Empowering refugees and host communities in Uganda. Platform scaffold is live.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
