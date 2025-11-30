import Hero from './Hero';
import UseCases from './UseCases';
import Features from './Features';
import Footer from './Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <UseCases />
      <Features />
      <Footer />
    </main>
  );
}