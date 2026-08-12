
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
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [userError, setUserError] = useState("");

    const {
        closeModal,
        showModal
    } = useModal();

    const [showUnavailable, setShowUnavailable] = useState(false);

    const [showRegister, setShowRegister] = useState(false);

    const [cep, setCep] = useState("");
    const handleCepSubmit = () => {

        closeModal();
        setShowUnavailable(true);
    };

    const { setUser } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });
        if (error) {

            setUserError(error.message);
            return;
        }


        if (data.user) {

            setUser(data.user);

            navigate("/minha-conta");
        }
    }
    useLockBodyScroll(
        showModal || showUnavailable
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
                                Insira seus dados nos campos abaixo para fazer login
                            </p>

                        </div>
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
                        <div className="input__box">
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                id="password"
                                placeholder=""
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
                        <div className="error__space">
                            {
                                userError && (
                                    <p className="error__text">
                                        {userError}
                                    </p>
                                )
                            }
                        </div>

                        <div className="error__space"></div>

                        <a href="#">
                            Esqueceu sua senha?
                        </a>
                        <ReCAPTCHA
                            sitekey="6Lf8m0EtAAAAAPOawPU2ae99gIFSqEHpeGwCu9-D"
                            onChange={(token) =>
                                console.log(token)
                            }
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

