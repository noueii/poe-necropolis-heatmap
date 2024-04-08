"use server"
import { cookies } from 'next/headers'
const cookieStore = cookies()


export async function setCCUCookies(value){
  cookieStore.set('ccu', JSON.stringify(value))
}

export async function getTimeCookie(){
  return cookies().get('lf')
}
export async function setTimeCookies(value){
  cookies().set('lf', JSON.stringify(value))
}

export async function getServerTime(){
  return new Date()
}