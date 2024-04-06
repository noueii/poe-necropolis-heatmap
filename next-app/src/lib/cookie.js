"use server"
import { cookies } from 'next/headers'
const cookieStore = cookies()


export async function setCCUCookies(value){
  cookieStore.set('ccu', JSON.stringify(value))
}