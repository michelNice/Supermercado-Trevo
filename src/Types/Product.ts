//Products e detaius
export type productApi = {
     price:  number
     id:string 
     description?: string
     image_url :string 
     name : string 
     old_price:number
     new_price:number
     price_discount: string
     offer?:string
     category:string
     unit_type:string
}

export type productSectetion = {
  products: productApi[]
  setProducts: React.Dispatch<React.SetStateAction<productApi[]>>
  //setScreen: React.Dispatch<React.SetStateAction<string>>
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  showModal: boolean
  setSelectedProduct: React.Dispatch<React.SetStateAction<productApi | null>>
}
