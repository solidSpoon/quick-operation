import { LinkButton } from "@/components/LinkButton"
import { MyCommandDialog } from "@/components/MyCommandDialog"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-screen select-none">
      <ResizablePanel defaultSize={20}>
        <div className="h-screen flex flex-col gap-2 overflow-y-auto items-start p-2">
          <MyCommandDialog />
          <LinkButton href={"/SplitVideo"}>Split Video</LinkButton>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <div className="h-screen">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
