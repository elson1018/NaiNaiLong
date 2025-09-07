import Hero from "../components/Hero";
import Features from "../components/Features";
import UserFlow from "../components/UserFlow";
import Footer from "../components/Footer";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage">
      <Hero />
      <Features />
      <UserFlow />
      <Footer />
    </div>
  );
}
