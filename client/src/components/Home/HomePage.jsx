import "../Home/css/HomePage.css";
import Header from "../Header";
import Footer from "../Footer";

function HomePage({ userName, setUserName }) {
  return (
    <>
      <Header setUserName={setUserName} />
      <div className="homePageWelcome">
        {userName}
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
