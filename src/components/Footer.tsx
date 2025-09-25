export default function Footer() {
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} Igor Garcia
      </footer>
    </>
  );
}
