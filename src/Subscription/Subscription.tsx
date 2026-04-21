import {useState } from 'react';
import {handleUserChange} from '../Subscription/Subscription'
type MyProps = {
  message: string;
};
const Subscription = ({ message }: MyProps) => {
  const [showPassword,setShowPassword] = useState(false)
  const [password,setPasswordError] = useState(false)
  const [showModal,setShowModal] = useState('')
  const [user, setUser] = useState("");
  const [userError, setUserError] = useState("");
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
              placeholder=" "
            
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

          <div id="recaptcha-container"></div>

          {/* BOTÕES DEVEM FICAR DENTRO DO FORM */}
          <button type="submit" className="btn__subscription">
            Entrar
          </button>

          <p className="text_noAcc">Ainda não tem uma conta?</p>

          <button
            type="button"
            className="btn__subscriptionTrans"
            //onClick={() => setShowModal(true)}
          >
            Criar uma conta
          </button>
        </form>
      </div>
    </section>
  </>
);
};

export default Subscription;