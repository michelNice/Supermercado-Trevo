import { useState } from "react";
import { supabase } from "../../services/Supabase/supabaseClient";
import "./ResetPassword.scss";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {

        if (!password || !confirmPassword) {
            setMessage("Preencha os dois campos.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("As senhas não são iguais.");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.error("Erro ao alterar senha:", error);
            setMessage("Não foi possível alterar a senha.");
            return;
        }

        setMessage("Senha alterada com sucesso!");
    };

    return (
        <section className="reset-password">

            <div className="reset-password__card">

                <div className="reset-password__header">
                    <h1>Redefinir senha</h1>

                    <p>
                        Digite sua nova senha abaixo para
                        recuperar o acesso à sua conta.
                    </p>
                </div>

                <div className="reset-password__fields">

                    <div className="reset-password__input">
                        <label htmlFor="password">
                            Nova senha
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Digite sua nova senha"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <div className="reset-password__input">
                        <label htmlFor="confirmPassword">
                            Confirmar senha
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirme sua nova senha"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />
                    </div>

                </div>

                {message && (
                    <p
                        className={
                            message === "Senha alterada com sucesso!"
                                ? "reset-password__message reset-password__message--success"
                                : "reset-password__message"
                        }
                    >
                        {message}
                    </p>
                )}

                <button
                    type="button"
                    className="reset-password__button"
                    onClick={handleResetPassword}
                >
                    Alterar senha
                </button>

            </div>

        </section>
    );
};

export default ResetPassword;