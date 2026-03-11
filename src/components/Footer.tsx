export default function Footer() {
  return (
    <footer className="bg-ocean-900 border-t border-ocean-800/50 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-ocean-500 text-sm">
          &copy; {new Date().getFullYear()} Casa Deleite — Fuerteventura.
        </p>
      </div>
    </footer>
  );
}
