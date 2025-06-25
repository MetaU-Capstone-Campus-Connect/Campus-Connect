import "../Home/css/HomePage.css";
import Header from "../Header";
import Footer from "../Footer";

function HomePage({ welcomeMessage }) {
  return (
    <>
      <Header />
      <h1>{welcomeMessage}</h1>
      <Footer />
    </>
  );
}

export default HomePage;
