import { supabase } from "./supabaseClient"

export async function createOrder(order:any) {

    const { data, error } = await supabase
        .from("orders")
        .insert(order)

    if(error){
        throw error
    }

    return data
}