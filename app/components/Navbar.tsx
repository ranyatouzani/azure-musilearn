import Link from "next/link";

export default function Navbar() {
    return (
      <nav className="bg-blue-600 p-4 text-white">
        <ul className="flex space-x-4">
          <li><Link href="/" className="hover:underline">Accueil</Link></li>
          <li><Link href="/courses" className="hover:underline">Cours</Link></li>
          <li><Link href="/about" className="hover:underline">À propos</Link></li>
        </ul>
      </nav>
    );
  }
  