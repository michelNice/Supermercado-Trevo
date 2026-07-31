import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../../services/Supabase/supabaseClient";
import "./Register.scss";

type RegisterProps = {
  onClose?: () => void;
};

const Register = ({ onClose }: RegisterProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          cpf,
          phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="register__form">
        <div className="register__success">
          <h3>Conta criada com sucesso!</h3>
          <p>
            Enviamos um e-mail de confirmação para <strong>{email}</strong>.
            Verifique sua caixa de entrada para ativar sua conta.
          </p>
        </div>
        {onClose && (
          <button type="button" className="btn__register" onClick={onClose}>
            Entendi
          </button>
        )}
      </div>
    );
  }

  return (
    <form className="register__form" onSubmit={handleRegister}>
      <div className="register__header">
        <h2>Criar conta</h2>
        <p>Cadastre-se para aproveitar ofertas e finalizar suas compras</p>
      </div>

      <div className="input__box">
        <input
          id="register-name"
          placeholder=" "
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="register-name">Nome completo</label>
      </div>

      <div className="input__box">
        <input
          id="register-email"
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="register-email">E-mail</label>
      </div>

      <div className="input__box">
        <input
          id="register-password"
          type={showPassword ? "text" : "password"}
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <label htmlFor="register-password">Senha</label>
        <span
          className="password__icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <div className="register__row">
        <div className="input__box">
          <input
            id="register-cpf"
            placeholder=" "
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
          <label htmlFor="register-cpf">CPF</label>
        </div>

        <div className="input__box">
          <input
            id="register-phone"
            placeholder=" "
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label htmlFor="register-phone">Telefone</label>
        </div>
      </div>

      <button className="btn__register" type="submit" disabled={loading}>
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      {onClose && (
        <div className="register__footer">
          Já tem uma conta?
          <button type="button" onClick={onClose}>
            Fazer login
          </button>
        </div>
      )}
    </form>
  );
};

export default Register;
