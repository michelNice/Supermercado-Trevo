import { useState } from "react"
import { supabase } from "../../services/Supabase/supabaseClient";
const Register = ()=> {
const [name,setName] = useState('')
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [cpf,setCpf] = useState('')
const [phone,setPhone] = useState('')
type Pros = {
   show:boolean;
  onClose:()=>void;
}

async function handleRegister(e: React.FormEvent) {
  e.preventDefault();

 const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: name,
      cpf,
      phone
    }
  }
});

  if (error) {
    alert(error.message);
    return;
  }

  console.log("Usuário criado:", data.user);
  alert("Conta criada! Verifique seu e-mail para confirmar a conta.");
}

    return(
        <form  onSubmit={handleRegister}>

            <input 
                placeholder="Nome completo"
                value={name}
               onChange={(e)=>setName(e.target.value)} />
           <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />
      
       <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <input
        placeholder="CPF"
        value={cpf}
        onChange={(e)=>setCpf(e.target.value)}
      />

      <input
        placeholder="Telefone"
        value={phone}
        onChange={(e)=>setPhone(e.target.value)}
      />

      <button type="submit">
        Criar conta
      </button>

        
        </form>
    )

}
export default Register