import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { Database } from "@/utils/supabase/supabase";
import GoogleSigIn from "@/components/GoogleSignIn";

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

  const register = async (formdata: FormData) => {
    "use server";

    const name = formdata.get("name")! as string;
    const email = formdata.get("email")! as string;
    const usaFencingId = Number(formdata.get("usa_fencing_id"));
    const supabase = await createClient(cookies());

    const { data, error } = await supabase.from('Members')
        .insert({
          name,
          email,
          usa_fencing_id: usaFencingId,
        }).select();
    console.log(data, error);

    let message = "";
    if (error != null && error.code == "23505") {
      message = "This USA fencing number has already been registered.";
    } else if (error != null) {
      message = `Failed, Error: ${error.code}`
    } else {
      redirect(`/members/${data[0].usa_fencing_id}`);
    }
    redirect(`/?message=${message}`)
  };

  const showRegisterForm = async (name: string | undefined, email: string | undefined) => {
    "use server";

    return (
      <form className="flex flex-col gap-4 items-start w-full">
        <span className="text-4xl underline text-black">Register</span>
        <div className="flex flex-col w-full">
          <label><b>Name</b></label>
          <input className="p-2 border-b-2 bg-purple-100 border-black" type="text" placeholder="John Doe" name="name" defaultValue={name} required />
        </div>
        <div className="flex flex-col w-full">
          <label><b>Email</b></label>
          <input className="p-2 border-b-2 bg-purple-100 border-black" type="email" placeholder="john.doe@email.com" name="email" defaultValue={email} required />
        </div>
        <div className="flex flex-col w-full">
          <label><b>USA Fencing #</b></label>
          <input className="p-2 border-b-2 bg-purple-100 border-black" type="number" placeholder="012345678" name="usa_fencing_id" required />
        </div>
        <div className="flex gap-2">
          <button type="submit"
            className="rounded-md p-4 bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400"
            formAction={register}
          >
            Register
          </button>
          <GoogleSigIn googleClientId={process.env.GOOGLE_CLIENT_ID!} />
        </div>
      </form>
    );
  };

  const { message, name, email } = await searchParams;

  return (
    <div className="flex divide-solid divide-x-2 divide-slate-300">
      <div className="flex flex-col gap-8 pr-8">
        <span className="text-4xl underline">Search</span>
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
      <div className="flex-grow pl-8">
        {message === undefined || message === null ? showRegisterForm(name, email) : showMessages(message)}
      </div>
    </div>
  );
}
