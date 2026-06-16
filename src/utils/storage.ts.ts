const STORE_KEY = "selectedStore";
const ADDRESS_KEY = "selectedAddress";

export const  getSelectedStore = ()=> {
    return localStorage.getItem(STORE_KEY)
}

export const setSelectedStore = (storeId: number)=> {
    localStorage.setItem(STORE_KEY, String(storeId));
}

export const getSelectedAddress = () => {
  return localStorage.getItem(ADDRESS_KEY);
};

export const setSelectedAddress = (address:string) =>{
    localStorage.setItem(ADDRESS_KEY, address);
}