import React from 'react'
import ChatView from '@/components/custom/ChatView'
import CodeView from '@/components/custom/CodeView'

function Workspace() {
  return (
    <div className='p-3 pr-5'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            <ChatView/>

            <div className='col-span-2'>
                <CodeView/>
            </div>
            
        </div>
    </div>
  )
}

export default Workspace