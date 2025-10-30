import { useState } from 'react';
import './Subscription.css'


function Subscription (){
 const [showPassword,setShowPassword] = useState(false)
    return(

     <>
     <section className="login__wrapper">
              <div className="sub__login">
            <form action="#" method="post">
            <div className="sub__text">
                <h2>Seja bem-vindo(a)!</h2>
                <p>Insira seus dados nos campos abaixo para fazer login</p>
            </div>

            <div className="input__box">
                <input type="text" id="user" placeholder=" " required />
                <label htmlFor="user">Email, CPF ou CNPJ*</label>
            </div>

            <div className="input__box">
                <input type={showPassword ? 'text' : 'password'}  id="password" placeholder=" " required />
                <label htmlFor="password">Senha*</label>
                <i  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={()=> setShowPassword(!showPassword)}
                ></i>
            </div>

            <a href="#">Esqueceu sua senha?</a>

            <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            <div class="g-recaptcha" data-sitekey="6LfuffwrAAAAAPz2OKRB-Tmn3NEtjmgAdoont_sF"></div>


            <button type="submit" className='btn__subscription'>Entrar</button>

            <p>Ainda não tem uma conta?</p>

            <button type="button" className='btn__subscriptionTrans'>Criar uma conta</button>
            </form>
        </div>
     </section>
</>

    )

}


export default Subscription;

