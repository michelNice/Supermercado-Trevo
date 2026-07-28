import  supabase from "../config/supabase";
export async function createOrder(order: any) {
    const  { error } = await supabase
      .from("orders")
    .insert(order);
     if (error) {
       throw error;
    }

}