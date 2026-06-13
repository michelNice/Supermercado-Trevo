import './Footer.scss'
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
function Footer() {

  return (
    <footer className="footer">

      <div className="footer__column">
        <h3>Quem somos</h3>

        <ul>
          <li>
            A Rede Trevo Supermercado faz parte de uma família genuinamente
            pernambucana, que teve início com o casal Armínio Guilherme
            dos Santos e Dona Antônia Santos.
          </li>

          <li>
            <a href="#">Clique aqui e saiba mais</a>
          </li>
        </ul>
      </div>

      <div className="footer__column">
        <h3>Forma de Pagamento</h3>

        <ul>
          <li>
            Aceitamos cartões de crédito, débito e vale alimentação.
          </li>

          <li>
            <a href="#">Clique aqui e saiba mais</a>
          </li>
        </ul>
      </div>

      <div className="footer__column">
        <h3>Institucional</h3>

        <ul>
          <li><a href="#">Quem Somos</a></li>
          <li><a href="#">Formas de Entrega</a></li>
          <li><a href="#">Formas de Pagamento</a></li>
          <li><a href="#">Dúvidas Frequentes</a></li>
          <li><a href="#">Fale Conosco</a></li>
        </ul>
      </div>

      <div className="footer__column">
        <h3>Relacionamento com o Cliente</h3>

        <ul>
          <li>
            <FiMail />
            lojavirtual@trevosupermercados.com.br
          </li>

          <li>
            <FiPhone />
            (81) 8169-1116
          </li>

          <li>
            <FaWhatsapp />
            (81) 98106-5273
          </li>
        </ul>
      </div>

      <div className="footer__column">
        <h3>Redes Sociais</h3>

        <ul className="socials">
          <li><FaXTwitter /></li>
          <li><FaInstagram /></li>
        </ul>
      </div>

    </footer>
  )
}

export default Footer