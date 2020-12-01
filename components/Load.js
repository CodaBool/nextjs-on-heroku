import Spinner from 'react-bootstrap/Spinner'
import { signin, signOut } from 'next-auth/client'
import { parseCookies } from 'nookies'

// WARNING: will display the msg, when redirecting OFF the page too. Not just TO the page.
export function Load({ msg }) {
  return (
    <>
      <Spinner animation="border" variant="info" style={{margin: '20% auto 0 auto', display: 'block'}}/>
      <h3 className="text-center m-5 fadeOnLoad">{msg}</h3>
    </>
  )
}

export function isLoad(session, loading, required) {
  const cookies = parseCookies()
  if (loading) return true
  if (!cookies['id-email'] && !loading && required && session) signOut() // logout and redo sign in to reset the 
  if (session === null && !loading && required) { signin(); return true }
  return false
}

/*
FLOW
session = undefined
loading = true
required (optional) = true

=>

if logged in

  session = {user}
  loading = true

  => 

  loading = false

if not logged in

  session = null
  loading = true

  =>

  loading = false
*/