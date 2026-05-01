import { useEffect,useState } from "react";
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

export const useLockBodyScroll = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
};
