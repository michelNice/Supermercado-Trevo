import { useEffect, useState } from 'react';
import './Subscription.css';
import CepModal from '../CepModal/CepModal';
import UnavailableModal from '../UnavailableModal/UnavailableModal';

function Subscription() {
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const [userError, setUserError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [cep, setCep] = useState("");

  const [showUnavailable, setShowUnavailable] = useState(false);

  // reCAPTCHA
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

  // Bloqueia o scroll quando o modal abre
 useEffect(() => {
  if (showModal || showUnavailable) {
    document.body.style.overflow = "hidden"; // BLOQUEIA
  } else {
    document.body.style.overflow = "";       // LIBERA
  }
}, [showModal, showUnavailable]);
  // -----------------------------
  // 🚀 FORMATAÇÃO + VALIDAÇÃO
  // -----------------------------
  const handleUserChange = (e) => {
    let value = e.target.value;
    let onlyNumbers = value.replace(/\D/g, "");

    setUser(value); // permite digitar email normalmente

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfRegex = /^\d{11}$/;
    const cnpjRegex = /^\d{14}$/;

    // Se apagou tudo → limpa o erro
    if (value.trim() === "") {
      setUserError("");
      return;
    }

    // -----------------------------
    // EMAIL (contém letras)
    // -----------------------------
    if (/[a-zA-Z]/.test(value)) {
      if (emailRegex.test(value)) {
        setUserError("");
      } else {
        setUserError("Email inválido");
      }
      return;
    }

    // -----------------------------
    // CPF (até 11 dígitos)
    // -----------------------------
    if (onlyNumbers.length <= 11) {
      let formatted = onlyNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      setUser(formatted);

      if (cpfRegex.test(onlyNumbers)) {
        setUserError("");
      } else {
        setUserError("CPF inválido");
      }

      return;
    }

    // -----------------------------
    // CNPJ (de 12 a 14 dígitos)
    // -----------------------------
    if (onlyNumbers.length > 11 && onlyNumbers.length <= 14) {
      let formatted = onlyNumbers
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

      setUser(formatted);

      if (cnpjRegex.test(onlyNumbers)) {
        setUserError("");
      } else {
        setUserError("CNPJ inválido");
      }

      return;
    }
  };


  // -----------------------------
  // 🚀 SUBMIT FINAL
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    // Campo vazio
    if (user.trim() === "") {
      setUserError("Por favor, informe EMAIL, CPF ou CNPJ");
      valid = false;
    }

    // Se já existe erro de validação
    if (userError !== "") valid = false;

    // SENHA
    if (password.trim() === "") {
      setPasswordError("Por favor, informe a senha");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

  };


  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
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
            <div className={`input__box ${userError ? "error" : ""}`}>
              <input
                type="text"
                id="user"
                placeholder=" "
                value={user}
                onChange={handleUserChange}
              />
              <label htmlFor="user">Email, CPF ou CNPJ*</label>
            </div>

            <div className="error__space">
              {userError && <p className="error__text">{userError}</p>}
            </div>

            {/* CAMPO SENHA */}
            <div className={`input__box ${passwordError ? "error" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Senha*</label>

              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="error__space">
              {passwordError && <p className="error__text">{passwordError}</p>}
            </div>

            <a href="#">Esqueceu sua senha?</a>

            <div id="recaptcha-container"></div>

            <button type="submit" className="btn__subscription">Entrar</button>

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
      </section>
      {/* MODAL DE CEP */}
      <CepModal
        show={showModal}
        onClose={() => setShowModal(false)}
        cep={cep}
        setCep={setCep}
        onSubmit={() => {
          console.log("CEP enviado:", cep);
          setShowModal(false);
          setShowUnavailable(true)
        }}
      />

        <UnavailableModal 
            show={showUnavailable}
            onClose={()=> setShowUnavailable(false)}
        />

        
    </>

  
  );
}

export default Subscription;
