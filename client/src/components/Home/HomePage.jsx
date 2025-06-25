import '../Home/css/HomePage.css'
import Header from '../Header'
import Footer from '../Footer'
import { Link } from 'react-router'

function HomePage() {

    return (
        <>
        <Header/>
        <div className='headerRedirect'>
                <Link to='signup'><button className='signUpButton'>Sign Up</button></Link>
                <Link to='login'><button className='loginButton'>Login</button></Link>
        </div>
        <Footer/>
        </>
    )
}

export default HomePage
