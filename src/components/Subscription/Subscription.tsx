import { useState } from "react";
import "./Subscription.scss";
import ReCAPTCHA from "react-google-recaptcha";
import CepModal from "../../modals/CepModal/CepModal";
import UnavailableModal from "../../modals/UnavailableModal/UnavailableModal.js";
import {
useModal,
useLockBodyScroll
} from "../../modals/CepModal/CepModalUtils";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import RegisterModal from "../../modals/RegisterModal";
import { supabase } from "../../services/Supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Subscription = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [userError, setUserError] = useState("");
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [forgotEmail, setForgotEmail] = useState("");
const [forgotMessage, setForgotMessage] = useState("");
const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);


const {
    closeModal,
    showModal
} = useModal();

const [showUnavailable, setShowUnavailable] = useState(false);
const [showRegister, setShowRegister] = useState(false);
const [cep, setCep] = useState("");

const { setUser } = useAuth();
const navigate = useNavigate();

const handleCepSubmit = () => {
    closeModal();
    setShowUnavailable(true);
};

const handleForgotPassword = async () => {
    if (!forgotEmail) {
        setForgotMessage("Digite seu email.");
        return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
        forgotEmail,
        {
            redirectTo: `${window.location.origin}/reset-password`,
        }
    );

    if (error) {
        console.error("Erro ao recuperar senha:", error);

        setForgotMessage(
            "Não foi possível enviar o email de recuperação."
        );

        return;
    }

    setForgotMessage(
        "Enviamos um link de recuperação para seu email."
    );
};

const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
) => {
    e.preventDefault();

    setUserError("");

    if (!recaptchaToken) {
        setUserError("Complete o reCAPTCHA antes de entrar.");
        return;
    }

    if (!email || !password) {
        setUserError("Preencha o email e a senha.");
        return;
    }

    try {
        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setUserError("Email ou senha incorretos.");
            return;
        }

        if (data.user) {
            setUser(data.user);
            navigate("/");
        }
    } catch {
        setUserError(
            "Ocorreu um erro ao tentar fazer login."
        );
    }
};

useLockBodyScroll(
    showModal ||
    showUnavailable ||
    showForgotPassword
);

return (
    <>
        <section className="login__wrapper">
            <div className="sub__login">
                <form onSubmit={handleLogin}>
                    <div className="sub__text">
                        <h2>
                            Seja bem-vindo(a)!
                        </h2>

                        <p>
                            Insira seus dados nos campos abaixo
                            para fazer login
                        </p>
                    </div>

                    <div className="input__box">
                        <input
                            type="email"
                            id="user"
                            placeholder=" "
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <label htmlFor="user">
                            Email
                        </label>
                    </div>

                    <div className="input__box">
                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            id="password"
                            placeholder=" "
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <label htmlFor="password">
                            Senha*
                        </label>

                        <span
                            className="password__icon"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </span>
                    </div>

                    <div className="error__space">
                        {userError && (
                            <p className="error__text">
                                {userError}
                            </p>
                        )}
                    </div>

                    <button
                        className="foget__password"
                        type="button"
                        onClick={() => {
                            setForgotEmail("");
                            setForgotMessage("");
                            setShowForgotPassword(true);
                        }}
                    >
                        Esqueceu sua senha?
                    </button>

                    <ReCAPTCHA
                        sitekey="6Lc3boQtAAAAAEGLMgHkX5x5P219OXU-AbgCsFc-"
                        onChange={(token) => {
                            setRecaptchaToken(token);
                        }}
                        onExpired={() => {
                            setRecaptchaToken(null);
                        }}
                    />

                    <button
                        type="submit"
                        className="btn__subscription"
                    >
                        Entrar
                    </button>

                    <p className="text_noAcc">
                        Ainda não tem uma conta?
                    </p>

                    <button
                        type="button"
                        className="btn__subscriptionTrans"
                        onClick={() =>
                            setShowRegister(true)
                        }
                    >
                        Criar uma conta
                    </button>
                </form>
            </div>

            <CepModal
                show={showModal}
                onClose={() => {
                    closeModal();
                    setShowUnavailable(true);
                }}
                cep={cep}
                setCep={setCep}
                onSubmit={handleCepSubmit}
            />

            <UnavailableModal
                show={showUnavailable}
                deliveryAvailable={false}
                onClose={() =>
                    setShowUnavailable(false)
                }
            />

            <RegisterModal
                show={showRegister}
                onClose={() =>
                    setShowRegister(false)
                }
            />

            {showForgotPassword && (
                <div className="forgot-password-modal">
                    <div
                        className="forgot-password-modal__overlay"
                        onClick={() =>
                            setShowForgotPassword(false)
                        }
                    >
                        <div
                            className="forgot-password-modal__content"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <button
                                type="button"
                                className="forgot-password-modal__close"
                                onClick={() =>
                                    setShowForgotPassword(false)
                                }
                            >
                                ×
                            </button>

                            <div className="forgot-password-modal__header">
                                <h2>
                                    Recuperar senha
                                </h2>

                                <p>
                                    Digite seu email para receber
                                    um link para redefinir sua senha.
                                </p>
                            </div>

                            <div className="forgot-password-modal__input">
                                <label htmlFor="forgot-email">
                                    Email
                                </label>

                                <input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={forgotEmail}
                                    onChange={(e) =>
                                        setForgotEmail(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            {forgotMessage && (
                                <p
                                    className={
                                        forgotMessage ===
                                        "Enviamos um link de recuperação para seu email."
                                            ? "forgot-password-modal__message forgot-password-modal__message--success"
                                            : "forgot-password-modal__message"
                                    }
                                >
                                    {forgotMessage}
                                </p>
                            )}

                            <button
                                type="button"
                                className="forgot-password-modal__submit"
                                onClick={handleForgotPassword}
                            >
                                Enviar link
                            </button>

                            <button
                                type="button"
                                className="forgot-password-modal__cancel"
                                onClick={() =>
                                    setShowForgotPassword(false)
                                }
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    </>
);


};

export default Subscription;
