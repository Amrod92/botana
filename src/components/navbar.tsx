import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-screen-2xl flex items-center justify-between p-4 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Botana</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
