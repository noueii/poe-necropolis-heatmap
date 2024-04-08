"use server"
import { cookies } from 'next/headers'



export async function setCCUCookies(value){
  cookies().set('ccu', JSON.stringify(value))
}

export async function getTimeCookie(){
  return await cookies().get('lf')
}
export async function setTimeCookies(value){
  cookies().set('lf', JSON.stringify(value))
}

export async function getServerTime(){
  return new Date()
}