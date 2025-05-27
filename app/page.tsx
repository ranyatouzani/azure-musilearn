import Navbar from "@/app/components/Navbar"; // Chemin absolu

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold">Bienvenue sur Musilearn</h1>
        <p className="mt-4 text-lg">Apprenez la musique en ligne avec des cours interactifs.</p>
      </main>
    </div>
  );
}
