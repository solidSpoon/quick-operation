import { invoke } from "@tauri-apps/api"
import { open } from "@tauri-apps/api/dialog"
import React, { useState } from "react"

import Layout from "@/components/Layout"
import { PageHeaderLayout } from "@/components/PageHeaderLayout"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import type { NextPageWithLayout } from "./_app"

const SplitVideo: NextPageWithLayout = () => {
  const [files, setFiles] = useState<string[]>([])
  const [text, setText] = useState<string>("")
  const select = async () => {
    const file: string | string[] | null = await open()
    if (file) {
      setFiles((f) => [...f, file].flat())
    }
  }

  const handleSplit = async () => {
    await invoke<string>("split_file_name", { fileNames: files, timeStamp: text })
  }
  return (
    <div
      style={{
        gridTemplateColumns: "45% 55%",
      }}
      className={cn("w-full h-full grid grid-cols-2")}
    >
      <div className={cn("p-2")}>
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
          className={cn("w-full h-full resize-none")}
          placeholder="Type your message here."
        />
      </div>
      <div className={cn("p-2 flex flex-col")}>
        <Table className={cn("h-0 flex-1")}>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow>
                <TableCell className="font-medium">{file}</TableCell>
                <TableCell>Video</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className={cn("mt-auto flex justify-end gap-2")}>
          <Button onClick={select} variant="secondary">
            Select File
          </Button>
          <Button onClick={handleSplit} disabled={files.length === 0}>
            Split By Timestamp
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SplitVideo
SplitVideo.getLayout = function getLayout(page) {
  return (
    <Layout>
      <PageHeaderLayout title={"SplitVideo"} description={"split your video"}>
        {page}
      </PageHeaderLayout>
    </Layout>
  )
}
