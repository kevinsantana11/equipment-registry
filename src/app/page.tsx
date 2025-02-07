import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const showMessages = (msg: string) => (
    <div className="flex flex-col gap-4 items-start">
      <span><b>{msg}</b></span>
    </div>
  );

  const register = async (formdata: FormData) => {
    "use server";

    const name = formdata.get("name");
    const email = formdata.get("email");
    const usaFencingId = Number(formdata.get("usa_fencing_id"));
    const supabase = await createClient(cookies());

    const { data, error } = await supabase.from('Members')
        .insert({
          name: name,
          email: email,
          usa_fencing_id: usaFencingId,
        })
        .select();
    console.log(data, error);

    let message = "";
    if (error != null && error.code == "23505") {
      message = "This USA fencing number has already been registered.";
    } else if (error != null) {
      message = `Failed, Error: ${error.code}`
    } else {
      message = `Success, identity (${data[0].usa_fencing_id}) registered.`;
    }
    redirect(`/?message=${message}`);
  };

  const showRegisterForm = () => {
    return (
      <form className="flex flex-col gap-4 items-start">
        <div className="flex flex-col">
          <label><b>Name</b></label>
          <input className="p-2 border-b-2 bg-purple-50 border-black" type="text" placeholder="John Doe" name="name" required />
        </div>
        <div className="flex flex-col">
          <label><b>Email</b></label>
          <input className="p-2 border-b-2 bg-purple-50 border-black" type="email" placeholder="john.doe@email.com" name="email" required />
        </div>
        <div className="flex flex-col">
          <label><b>USA Fencing #</b></label>
          <input className="p-2 border-b-2 bg-purple-50 border-black" type="number" placeholder="012345678" name="usa_fencing_id" required />
        </div>
        <button
          type="submit"
          className="rounded-md p-4 bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400"
          formAction={register}
        >
          Register
        </button>
      </form>
    );
  };

  const { message } = await searchParams;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="p-16 gap-16 rounded-lg flex bg-purple-50 items-center flex-col">
          <form action="/?" method="GET">
            <button type="submit" className="p-16 rounded-lg text-white bg-purple-800 hover:bg-purple-700 active:bg-purple-600 cursor-pointer">
              <span className="text-4xl"><b>Equipment Registry</b></span>
            </button>
          </form>
          <div className="flex gap-16">
            <button className="p-4 rounded-md flex flex-col bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400 items-center w-1/2 h-1/2">
              <Image src="/qr-code.svg" alt="scan qr code" width={64} height={64} />
              <span>Scan</span>
            </button>
            { message == null ? showRegisterForm() : showMessages(message) }
          </div>
        </div>
      </main>
    </div>
  );
}
