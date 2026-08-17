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

    // =========================
    // LOGIN
    // =========================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userError, setUserError] = useState("");

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");

    // reCAPTCHA
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);


    // =========================
    // MODAIS
    // =========================

    const {
        closeModal,
        showModal
    } = useModal();

    const [showUnavailable, setShowUnavailable] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const [cep, setCep] = useState("");


    // =========================
    // AUTH
    // =========================

    const { setUser } = useAuth();
    const navigate = useNavigate();


    // =========================
    // CEP
    // =========================

    const handleCepSubmit = () => {
        closeModal();
        setShowUnavailable(true);
    };


    // =========================
    // RECUPERAR SENHA
    // =========================

    const handleForgotPassword = async () => {

        if (!forgotEmail) {
            setForgotMessage("Digite seu email.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
            forgotEmail,
            {
                redirectTo: "http://localhost:5173/reset-password",
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


    // =========================
    // LOGIN
    // =========================

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        // Limpa erro anterior
        setUserError("");


        // Verifica reCAPTCHA
        if (!recaptchaToken) {
            setUserError("Complete o reCAPTCHA antes de entrar.");
            return;
        }


        // Verifica campos
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


            // Erro no login
            if (error) {

                console.error("Erro no login:", error);

                setUserError("Email ou senha incorretos.");

                return;
            }


            // Usuário retornado pelo Supabase
            if (data.user) {

                console.log("Login realizado:", data.user);

                // Atualiza o contexto
                setUser(data.user);

                // Vai para a página inicial
                navigate("/");
            }

        } catch (error) {

            console.error("Erro inesperado:", error);

            setUserError(
                "Ocorreu um erro ao tentar fazer login."
            );
        }
    };


    // =========================
    // BODY SCROLL
    // =========================

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

                        {/* =========================
                            TEXTO
                        ========================= */}

                        <div className="sub__text">

                            <h2>
                                Seja bem-vindo(a)!
                            </h2>

                            <p>
                                Insira seus dados nos campos abaixo
                                para fazer login
                            </p>

                        </div>


                        {/* =========================
                            EMAIL
                        ========================= */}

                        <div className="input__box">

                            <input
                                type="text"
                                id="user"
                                placeholder=" "
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                            <label htmlFor="user">
                                Email, CPF ou CNPJ*
                            </label>

                        </div>


                        {/* =========================
                            SENHA
                        ========================= */}

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

                                {
                                    showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                }

                            </span>

                        </div>


                        {/* =========================
                            ERRO
                        ========================= */}

                        <div className="error__space">

                            {
                                userError && (
                                    <p className="error__text">
                                        {userError}
                                    </p>
                                )
                            }

                        </div>


                        {/* =========================
                            ESQUECEU A SENHA
                        ========================= */}

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


                        {/* =========================
                            RECAPTCHA
                        ========================= */}

                        <ReCAPTCHA
                            sitekey="6Lc3boQtAAAAAEGLMgHkX5x5P219OXU-AbgCsFc-"
                            onChange={(token) => {
                                setRecaptchaToken(token);
                            }}
                            onExpired={() => {
                                setRecaptchaToken(null);
                            }}
                        />


                        {/* =========================
                            ENTRAR
                        ========================= */}

                        <button
                            type="submit"
                            className="btn__subscription"
                        >
                            Entrar
                        </button>


                        {/* =========================
                            CRIAR CONTA
                        ========================= */}

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


                {/* =========================
                    CEP MODAL
                ========================= */}

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


                {/* =========================
                    UNAVAILABLE MODAL
                ========================= */}

                <UnavailableModal
                    show={showUnavailable}
                    onClose={() =>
                        setShowUnavailable(false)
                    }
                />


                {/* =========================
                    REGISTER MODAL
                ========================= */}

                <RegisterModal
                    show={showRegister}
                    onClose={() =>
                        setShowRegister(false)
                    }
                />


                {/* =========================
                    FORGOT PASSWORD MODAL
                ========================= */}

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

                                {/* FECHAR */}

                                <button
                                    type="button"
                                    className="forgot-password-modal__close"
                                    onClick={() =>
                                        setShowForgotPassword(false)
                                    }
                                >
                                    ×
                                </button>


                                {/* TEXTO */}

                                <div className="forgot-password-modal__header">

                                    <h2>
                                        Recuperar senha
                                    </h2>

                                    <p>
                                        Digite seu email para receber
                                        um link para redefinir sua senha.
                                    </p>

                                </div>


                                {/* EMAIL */}

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


                                {/* MENSAGEM */}

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


                                {/* ENVIAR */}

                                <button
                                    type="button"
                                    className="forgot-password-modal__submit"
                                    onClick={handleForgotPassword}
                                >
                                    Enviar link
                                </button>


                                {/* CANCELAR */}

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