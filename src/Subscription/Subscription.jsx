import './Subscription.css'
function Subscription (){

    return(

        <>
            <section className="sub__login">
                    <form action="#" method="post">
                        <div className="sub__text">
                            <h2>Seja bem-vindo(a)!</h2>
                            <p>Insira seus dados nos campos abaixo para fazer login</p> 
                        </div>
                         <div className="input__box">
                            <input type="text" name="" id="user" />
                            <label for="user">Email, CPF ou CNPJ*</label>
                         </div>
                         <div className="input__box">
                              <input type="text" name="" id="" />
                         </div>
                        
                        <a href="#">Esqueceu sua senha</a>

                        <script src="https://www.google.com/recaptcha/api.js" async defer></script>

                        <button type="submit">Entrar</button>

                        <p href="#">Ainda não tem uma conta?</p>

                        <button>Criar uma conta</button>
                    </form>
            </section>
        </>
    )

}


export default Subscription;

