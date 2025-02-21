import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import GoogleSigIn from "@/components/GoogleSignIn";
import QRCode from "react-qr-code";
import Printer from "@/components/Printer";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const showMessages = (msg: string) => (
    <div className="flex flex-col gap-4 items-start">
      <span><b>{msg}</b></span>
    </div>
  );

  const search = async (formdata: FormData) => {
    "use server";
    const usaFencingId = Number(formdata.get("usa_fencing_id"));
    redirect(`/members/${usaFencingId}`);
  }

  const update = async (formdata: FormData) => {
    "use server";

    const id = formdata.get("id")! as string;
    const name = formdata.get("name")! as string;
    const email = formdata.get("email")! as string;
    const usaFencingId = Number(formdata.get("usa_fencing_id"));
    const supabase = await createClient(cookies());

    const { error } = await supabase.from('Members')
        .update({
          name,
          email,
          usa_fencing_id: usaFencingId === 0 ? undefined : Number(usaFencingId),
        })
        .eq('id', id)
        .select();

    let message = "";
    if (error != null && error.code == "23505") {
      message = "This USA fencing number has already been registered.";
    } else if (error != null) {
      message = `Failed, Error: ${error.code}`
    } else {
      redirect('/');
    }
    redirect(`/?message=${message}`)
  };

  const ShowProfileInfo = async (userid: string) => {
    "use server";
    const supabase = await createClient(cookies());
    const getMemberRequest = await supabase
        .from('Members')
        .select()
        .eq('id', userid)
        .single();

    const member = getMemberRequest.data;


    return (
      <form className="flex flex-col gap-4">
        <span className="text-4xl underline text-black">Profile</span>
        <input type="hidden" name="id" value={member?.id} required />
        <div className="flex flex-col w-full">
          <label><b>Name</b></label>
          <input className="p-2 border-b-2 bg-purple-100 border-black" type="text" placeholder="John Doe" name="name" defaultValue={member?.name} required />
        </div>
        <div className="flex flex-col w-full">
          <label><b>Email</b></label>
          <input className="p-2 border-b-2 bg-purple-100 border-black" type="email" placeholder="john.doe@email.com" name="email" defaultValue={member?.email} required />
        </div>
        <div className="flex flex-col w-full">
          <label><b>USA Fencing #</b></label>
          <input className="p-2 border-b-2 bg-purple-100 border-black" type="number" placeholder="012345678" name="usa_fencing_id" defaultValue={member?.usa_fencing_id || 0} required />
        </div>
        {
        member?.usa_fencing_id !== null && 
        <div className="flex my-10 w-full justify-center">
          <QRCode id="qr-code" value={String(member?.usa_fencing_id)} size={256} />
        </div>
        }
        <div className="flex gap-2 w-full">
          <Printer elId="qr-code" width={1200} height={900} msg="Nothing to print, please provide a non zero value for your USA fencing ID" />
          <button type="submit"
            className="rounded-md p-4 bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400"
            formAction={update}
          >
            Update
          </button>
          <GoogleSigIn googleClientId={process.env.GOOGLE_CLIENT_ID!} />
        </div>
      </form>
    );
  };

  const { message } = await searchParams;
  let outputMessage = message;
  const supabase = await createClient(cookies());
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    outputMessage = `error, please contact developer with <error_msg: ${error.message}>`;
    const errorMap: { [key: string]: string} = {
      'AuthSessionMissingError': 'Please login',
      'AuthApiError': 'Please login'
    };
    outputMessage = errorMap[error.name];
  }

  return (
    <div className="flex flex-col divide-solid divide-y-2 divide-slate-300 text-slate-800">
      <div className="flex flex-col gap-8 pb-8">
        <span className="text-4xl underline text-black">Search</span>
        <form className="flex flex-col gap-4">
          <label><b>USA Fencing #</b></label>
          <input className="p-2 border-b-2 bg-purple-100 border-black" type="number" placeholder="012345678" name="usa_fencing_id" required />
          <button type="submit"
            className="rounded-md p-2 bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400"
            formAction={search}
          >
            Search
          </button>
        </form>
        <form action="/scan">
          <button type="submit" className="p-4 h-28 rounded-md flex-col bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400 items-center">
            <Image src="/qr-code.svg" alt="scan qr code" width={64} height={64} />
            <span>Scan</span>
          </button>
        </form>
      </div>
      <div className="flex-grow pt-8 gap-4 flex flex-col">
        {outputMessage !== undefined && showMessages(outputMessage)}
        {data.user === null ? (
          <GoogleSigIn googleClientId={process.env.GOOGLE_CLIENT_ID!} />
        ) : ShowProfileInfo(data.user.id)}
      </div>
    </div>
  );
}
