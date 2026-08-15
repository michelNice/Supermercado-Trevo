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


    const handleForgotPassword = async()=> {
        if(!email){
             setUserError("Digite seu email para recuperar a senha.");
            return;
        }

        
        try{
            const { error } = await supabase.auth.resetPasswordForEmail(
                        email,
                        {
                            redirectTo: "http://localhost:5173/reset-password",
                        }
            );
            if(error){
                 setUserError("Não foi possível enviar o email de recuperação.");
                return;
            }
            setUserError(
            "Enviamos um link de recuperação para seu email."
            );

        }catch (error) {
        console.error("Erro inesperado:", error);

        setUserError(
            "Ocorreu um erro ao tentar recuperar sua senha."
        );
     }
    }

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
        showModal || showUnavailable
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
                            ESQUECEU SENHA
                        ========================= */}

                        <button className="foget__password"
                              type="button"
                              onClick={handleForgotPassword}
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

            </section>

        </>
    );
};


export default Subscription;