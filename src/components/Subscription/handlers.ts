export const handleUserChange = (
   e: React.ChangeEvent<HTMLInputElement>,
  setUser: React.Dispatch<React.SetStateAction<string>>,
  setUserError: React.Dispatch<React.SetStateAction<string>>
) => {
  let value = e.target.value;
  const onlyNumbers = value.replace(/\D/g, "");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cpfRegex = /^\d{11}$/;
  const cnpjRegex = /^\d{14}$/;

  // Se apagou tudo
  if (value.trim() === "") {
    setUser("");
    setUserError("");
    return;
  }

  // EMAIL
  if (/[a-zA-Z]/.test(value)) {
    setUser(value);

    if (emailRegex.test(value)) {
      setUserError("");
    } else {
      setUserError("Email inválido");
    }

    return;
  }

  // CPF
  if (onlyNumbers.length <= 11) {
    const formatted = onlyNumbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setUser(formatted);

    if (cpfRegex.test(onlyNumbers)) {
      setUserError("");
    } else {
      setUserError("CPF inválido");
    }

    return;
  }

  // CNPJ
  if (onlyNumbers.length > 11) {
    const formatted = onlyNumbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");

    setUser(formatted);

    if (cnpjRegex.test(onlyNumbers)) {
      setUserError("");
    } else {
      setUserError("CNPJ inválido");
    }
  }
};
