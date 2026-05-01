import {useState } from 'react';
import {handleUserChange} from './handlers.ts'
import './Subscription.scss'
import ReCAPTCHA from "react-google-recaptcha";
import CepModal from '../CepModal/CepModal'
import UnavailableModal from '../UnavailableModal/UnavailableModal.js';
import {useLockBodyScroll}  from '../CepModal/CepModalUtils'
type MyProps = {
  message: string;
};
const Subscription = ({ message }: MyProps) => {
 const [showPassword, setShowPassword] = useState(false);
 const [password, setPassword] = useState("");
 const [passwordError, setPasswordError] = useState("");
 const [user, setUser] = useState("");
 const [userError, setUserError] = useState("");
 const [showModal, setShowModal] = useState(false);
 const [showUnavailable,setShowUnavailable] = useState(false)
 const [cep,setCep] = useState('')
 
 const handleCepSubmit = ()=>{
   setShowModal(false)
 }
 useLockBodyScroll(showModal)
 
 return (
  <>
    <section className="login__wrapper">
      <div className="sub__login">
        <form>
          <div className="sub__text">
            <h2>Seja bem-vindo(a)!</h2>
            <p>Insira seus dados nos campos abaixo para fazer login</p>
          </div>

          {/* INPUT USUÁRIO */}
          <div className="input__box">
            <input
              type="text"
              id="user"
              placeholder=" "
              value={user}
              onChange={(e) => handleUserChange(e, setUser, setUserError)}
            />
            <label htmlFor="user">Email, CPF ou CNPJ*</label>
          </div>

          {/* INPUT SENHA */}
          <div className="input__box">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder=""
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <label htmlFor="password">Senha*</label>

            <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <div className="error__space">
           {userError && <p className="error__text">{userError}</p>}
          </div>

          <div className="error__space"></div>

          <a href="#">Esqueceu sua senha?</a>

                        <ReCAPTCHA
              sitekey="6Ld1X8UsAAAAABZzQNQla3yd4t-6oMDVm5YgCNYX"
              onChange={(token)=>console.log(token)}
              />

          <button type="submit" className="btn__subscription">
            Entrar
          </button>

          <p className="text_noAcc">Ainda não tem uma conta?</p>

          <button
            type="button"
            className="btn__subscriptionTrans"
             onClick={() => setShowModal(true)}
          >
            Criar uma conta
          </button>
        </form>
      </div>
      <CepModal 
        show={showModal}
        onClose={() => {
        setShowModal(false)
        setShowUnavailable(true)}}
        cep={cep}
        setCep={setCep}
        onSubmit={handleCepSubmit}
        
      />
      <UnavailableModal
      show={showUnavailable}
      onClose={() => setShowUnavailable(false)}
/>
    </section>
    
  </>
);
};

export default Subscription;