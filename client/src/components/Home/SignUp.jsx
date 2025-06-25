import '../Home/css/SignUp.css'
import Header from '../Header'
import Footer from '../Footer'
import { Link } from 'react-router'

function SignUp() {

    return (
        <div className='SignUp'>
        <Header/>
            <form>
                <div className='signUpContainer'>
                    <h1>Sign Up</h1>

                    <label><b>User Name</b></label>
                    <input type="text" placeholder="Enter UserName" name="username" required/>

                    <label><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required/>

                    <label><b>Repeat Password</b></label>
                    <input type="password" placeholder="Repeat Password" name="psw-repeat" required/>

                    <div class="clearfix">
                        <Link to='/'><button type="button" class="cancelbtn">Cancel</button></Link>
                        <button type="submit" class="signupbtn">Sign Up</button>
                    </div>

                </div>
            </form>
        <Footer/>
        </div>
    )
}

export default SignUp
