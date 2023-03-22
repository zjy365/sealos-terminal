import useSessionStore from '@/stores/session'
import { useEffect, useState } from 'react'
import { createSealosApp, sealosApp } from 'sealos-desktop-sdk/app'
import styles from './index.module.scss'
import request from '@/service/request'

export default function Index() {
  const { setSession, getSession } = useSessionStore()
  const [isLodaing, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    return createSealosApp()
  }, [])

  useEffect(() => {
    const initApp = async () => {
      try {
        const result = await sealosApp.getUserInfo()
        setSession(result)
        setIsLoading(false)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          setIsLoading(false)
        }
        setIsError(true)
      }
    }
    initApp()
  }, [isLodaing, setSession])

  useEffect(() => {
    const test = async () => {
      console.log(await request('/api/apply'))
    }
    test()
  }, [])

  return <div className={styles.container}>index</div>
}
