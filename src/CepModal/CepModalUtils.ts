export const formatCep = (value:string) => {
     let clean = value.replace(/\D/g, "").slice(0, 8);
    if(clean.length > 5){
         clean = clean.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
    }
    return clean
}
export const isCepValid = (cep:string)=> {
    return cep.length === 9
}