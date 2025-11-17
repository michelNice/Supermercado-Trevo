import { useEffect, useState } from 'react';
import './Subscription.css';
import CepModal from '../CepModal/CepModal';

function Subscription() {
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const [userError, setUserError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [selectedStore, setSelectedStore] = useState(
  localStorage.getItem("selectedStore") || ""
);


  const [cep, setCep] = useState('');


  useEffect(() => {
  const interval = setInterval(() => {
    if (window.grecaptcha && document.getElementById("recaptcha-container")) {
      window.grecaptcha.render("recaptcha-container", {
        sitekey: "6Lfj-gwsAAAAAJwiSh-pko8rcPYPGEiOjm26IWCC",
      });
      clearInterval(interval);
    }
  }, 300);

  return () => clearInterval(interval);
}, []);


  // Bloqueia scroll ao abrir modal
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
  }, [showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    // Validação usuário
    if (user.trim() === '') {
      setUserError('Por favor, informe EMAIL, CPF ou CNPJ');
      valid = false;
    } else {
      setUserError('');
    }

    // Validação senha
    if (password.trim() === '') {
      setPasswordError('Por favor, informe a senha');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    console.log("Login enviado!");
  };

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(value);
  };

  return (
    <>
      <section className="login__wrapper">
        <div className="sub__login">
          <form onSubmit={handleSubmit}>
            <div className="sub__text">
              <h2>Seja bem-vindo(a)!</h2>
              <p>Insira seus dados nos campos abaixo para fazer login</p>
            </div>

            {/* CAMPO USUÁRIO */}
            <div className={`input__box ${userError ? 'error' : ''}`}>
              <input
                type="text"
                id="user"
                placeholder=" "
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <label htmlFor="user">Email, CPF ou CNPJ*</label>
            </div>

            {/* espaço fixo para evitar movimento */}
            <div className="error__space">
              {userError && <p className="error__text">{userError}</p>}
            </div>

            {/* CAMPO SENHA */}
            <div className={`input__box ${passwordError ? 'error' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Senha*</label>

              <i
                className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* espaço fixo para evitar movimento */}
            <div className="error__space">
              {passwordError && <p className="error__text">{passwordError}</p>}
            </div>

            <a href="#">Esqueceu sua senha?</a>

            <div id="recaptcha-container"></div>

            <button type="submit" className="btn__subscription">Entrar</button>

            <p>Ainda não tem uma conta?</p>

            <button
              type="button"
              className="btn__subscriptionTrans"
              onClick={() => setShowModal(true)}
            >
              Criar uma conta
            </button>
          </form>
        </div>
      </section>
     <CepModal
        show={showModal}
        onClose={() => setShowModal(false)}
        cep={cep}
        setCep={setCep}
        onSubmit={() => {
          console.log("CEP enviado:", cep);
          setShowModal(false);
        }}
      />
    </>
  );
}

export default Subscription;