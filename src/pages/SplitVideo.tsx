import React from "react"

import Layout from "@/components/Layout"
import { PageHeaderLayout } from "@/components/PageHeaderLayout"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import type { NextPageWithLayout } from "./_app"

const SplitVideo: NextPageWithLayout = () => {
  return <>Split Video</>
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
