import { useContext, useEffect } from 'react'
import { AuthContext } from 'context/AuthContext'
import FinderApp from './FinderApp'

function Vault() {
  const { setPageTitle } = useContext(AuthContext)

  useEffect(()=>{
    setPageTitle(()=>"Vault")
    return()=>setPageTitle("...")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <>
    <FinderApp />
    </>
  )
}

export default Vault