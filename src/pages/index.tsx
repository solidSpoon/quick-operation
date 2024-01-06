import Link from "next/link"
import React, { useCallback } from "react"

import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { useGlobalShortcut } from "@/hooks/tauri/shortcuts"
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

  const shortcutHandler = useCallback(() => {
    console.log("Ctrl+P was pressed!")
  }, [])
  useGlobalShortcut("CommandOrControl+P", shortcutHandler)

  return (
    <Button asChild>
      <Link href="/SplitVideo">Login</Link>
    </Button>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Home
