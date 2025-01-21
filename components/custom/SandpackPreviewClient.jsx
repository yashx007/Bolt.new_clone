"use client"
import React, { useContext, useRef, useEffect } from 'react'
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import { ActionContext } from '@/context/ActionContext';

function SandpackPreviewClient() {
    const previewRef = useRef();
    const { sandpack } = useSandpack();
    const { action, setAction } = useContext(ActionContext);

    useEffect(() => {
        if (sandpack && action) {
            GetSandpackClient();
        }
    }, [sandpack, action]); // Properly adding both dependencies

    const GetSandpackClient = async () => {
        const client = previewRef.current?.getClient();
        if (client) {
            console.log(client);
            const result = await client.getCodeSandboxURL();
            if (result?.sandboxId) {
                if (action?.actionType === 'deploy') {
                    window.open('https://' + result.sandboxId + '.csb.app/');
                } else if (action?.actionType === 'export') {
                    window.open(result.editorUrl);
                }
            }
        }
    }

    return (
        <SandpackPreview
            ref={previewRef}
            style={{ height: '80vh' }}
            showNavigator={true} />
    )
}

export default SandpackPreviewClient;
