import '../Home/css/Login.css'
import Header from '../Header'
import Footer from '../Footer'

function Login() {

    return (
        <div className='Login'>
        <Header/>
        <div className='loginContainer'>
            <label for="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="uname" required/>

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" required/>

            <button type="submit">Login</button>


        </div>
        <Footer/>
        </div>
    )
}

export default Login
