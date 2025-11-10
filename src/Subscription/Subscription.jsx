import { useState } from 'react';
import './Subscription.css';

function Subscription() {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
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
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder=" "
                required
              />
              <label htmlFor="password">Senha*</label>

              <i
                className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <a href="#">Esqueceu sua senha?</a>

            <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            <div
              className="g-recaptcha"
              data-sitekey="6LfuffwrAAAAAPz2OKRB-Tmn3NEtjmgAdoont_sF"
            ></div>

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

      {showModal && (
        <section className="modal__overlay" onClick={() => setShowModal(false)}>
          <div className="modal__wrapper" onClick={(e) => e.stopPropagation()}>
            
            {/* ✅ Botão Fechar Ajustado */}
            <button className="modal__close" onClick={() => setShowModal(false)}>×</button>

            <div className="modal">
              <h2 className="modal__title">Qual o seu CEP?</h2>

              <p className="modal__description">
                Precisamos validar seu CEP para saber se o nosso serviço atende a sua região.
              </p>

              <div className="modal__inputBox">
                <input className="modal__input" type="text" placeholder=" " id="cep" />
                <label htmlFor="cep" className="modal__label">Digite seu CEP*</label>
              </div>

              <div className="modal__footer">
                <button className="modal__button">Verificar Disponibilidade</button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Subscription;
