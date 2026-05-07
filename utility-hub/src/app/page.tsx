import HeroSection from "./components/landing-components/HeroSection";
import { Header } from "./components/Header";
import "./styles/globals.css";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <div className="container mx-auto px-6 lg:px-1">
        <HeroSection  />
      </div>
    </div>
  );
}
