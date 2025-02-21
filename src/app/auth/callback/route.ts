import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const creds = (await request.formData()).get("credential");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'


  if (creds) {

    const supabase = await createClient(cookies());
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: creds.toString()
    });

    if (!error) {
    const getMemberRequest = await supabase
        .from('Members')
        .select()
        .eq('id', data.user.id)
        .single();
    const member = getMemberRequest.data;
    if (member === null) {
      await supabase.from('Members').insert({
        id: data.user.id,
        email: data.user.email || "noemail",
        name: data.user.user_metadata["full_name"] || "noname",
        usa_fencing_id: null
      });
    }
    }

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`, 301)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`, 301)
      } else {
        return NextResponse.redirect(`${origin}${next}`, 301)
      }
    } else {
      console.log("Error getting user!", error);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}