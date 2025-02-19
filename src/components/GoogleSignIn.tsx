"use client"
import dynamic from 'next/dynamic'

export default function GoogleSigIn ({ googleClientId } : { googleClientId: string }) {
 
const LoadGsiScript = dynamic(() => import('@/components/LoadGsiScript'), {
  ssr: false,
})
    return (
        <>
            <LoadGsiScript/>
            <div id="g_id_onload"
                data-client_id={googleClientId}
                data-context="signin"
                data-ux_mode="redirect"
                data-login_uri={`${window.location.origin}/auth/callback`}
                data-auto_prompt="false">

            </div>
            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="continue_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
        </>
    )
}