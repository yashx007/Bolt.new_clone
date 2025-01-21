import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'
import Footer from './Footer'

function AppSideBar() {
    return (
        <Sidebar>
            <SidebarHeader className='p-3'>
                <Image src={'/image.png'} alt='logo' width={50} height={50} className='rounded-2xl' />
                <Button className='mt-5'> <MessageCircleCode/>Start New Chat</Button>
            </SidebarHeader>
            <SidebarContent className='p-5'>
                <SidebarGroup>
                    <WorkspaceHistory/>
                </SidebarGroup>
                {/*<SidebarGroup />*/}
            </SidebarContent>
            <SidebarFooter>
                <Footer/>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSideBar