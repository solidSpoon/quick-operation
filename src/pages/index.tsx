import { invoke } from "@tauri-apps/api/tauri"
import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useCallback, useState } from "react"

import { Card } from "@/components/Card"
import { CardButton } from "@/components/CardButton"
import { useGlobalShortcut } from "@/hooks/tauri/shortcuts"
import { ResizableDemo } from "@/pages/ResizeableDemo"

const Home: NextPage = () => {
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

  return <ResizableDemo />
}

export default Home
