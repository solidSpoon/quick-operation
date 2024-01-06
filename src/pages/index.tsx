import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { NextPageWithLayout } from "@/pages/_app"

const Home: NextPageWithLayout = () => {
  // const [buttonDesc, setButtonDesc] = useState<string>(
  //   "Waiting to be clicked. This calls 'on_button_clicked' from Rust.",
  // )
  // const onButtonClick = () => {
  //   invoke<string>("on_button_clicked")
  //     .then((value) => {
  //       setButtonDesc(value)
  //     })
  //     .catch(() => {
  //       setButtonDesc("Failed to invoke Rust command 'on_button_clicked'")
  //     })
  // }

  // const shortcutHandler = useCallback(() => {
  //   console.log("Ctrl+P was pressed!")
  // }, [])
  // useGlobalShortcut("CommandOrControl+P", shortcutHandler)
  const router = useRouter()

  useEffect(() => {
    router.push("/SplitVideo").catch(() => {})
  }, [router])

  return (
    <div className={"w-full h-full flex justify-center items-center"}>loading...</div>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Home
