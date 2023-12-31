import { invoke } from "@tauri-apps/api"
import { open } from "@tauri-apps/api/dialog"
import React, { useState } from "react"
import toast from "react-hot-toast"

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
import { ChevronRight, X, XSquare } from "lucide-react";

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
    await toast.promise(
      invoke<string>("split_file_name", { fileNames: files, timeStamp: text }),
      {
        loading: "Splitting...",
        success: "Split Successfully",
        error: "Split Failed",
      },
    )
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
              <TableHead className="w-[100px] text-center">Type</TableHead>
              <TableHead className="w-[150px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow>
                <TableCell className="font-medium">{file}</TableCell>
                <TableCell className={'text-center'}>Video</TableCell>
                <TableCell className={'text-center'}>
                  <Button
                    onClick={() => {
                      setFiles((f) => f.filter((x) => x !== file))
                    }}
                    variant="outline" size="icon">
                    <X   className="h-4 w-4" />
                  </Button>
                </TableCell>
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
