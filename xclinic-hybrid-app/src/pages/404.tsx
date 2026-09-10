import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">This page could not be found.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
