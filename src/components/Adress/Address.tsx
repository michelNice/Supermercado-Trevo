import './Address.scss'
import { useState  } from 'react';
interface AddressData{
    street:string;
    number:string;
    neighborhood: string;
    city:string;
    state:string;
    zipCode:string
}
const setAddresss = useState<AddressData>({
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
})
const [Address,setAddress] = useState()
const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const { name,value } = event.target;
  
};