import "../Home/css/HomePage.css";
import Header from "../Header";
import Footer from "../Footer";

function HomePage({ userName}) {
  return (
    <>
      <Header/>
      <div className="homePageWelcome">{userName}</div>
      <Footer />
    </>
  );
}

export default HomePage;
