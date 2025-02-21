import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface PageParams {
    id: number
}

export default async function Page({ params }: {
    params: Promise<PageParams>
}) {
    const { id } = await params;
    const supabase = await createClient(cookies());
    const getMemberRequest = await supabase
        .from('Members')
        .select()
        .eq('usa_fencing_id', id)
        .single();

    const member = getMemberRequest.data;

    if (member == null) {
        redirect("/?message=User+could+not+be+found");
    }
    return (
        <div className="text-gray-600 flex flex-col gap-4">
            <div className="flex flex-col">
                <label><b>Name</b></label>
                <input className="p-2 border-b-2 bg-purple-100 border-gray-400" type="text" value={member.name} readOnly />
            </div>
            <div className="flex flex-col">
                <label><b>Email</b></label>
                <input className="p-2 border-b-2 bg-purple-100 border-gray-400" type="email" value={member.email} readOnly />
            </div>
            <div className="flex flex-col">
                <label><b>USA Fencing #</b></label>
                <input className="p-2 border-b-2 bg-purple-100 border-gray-400" type="number" value={member.usa_fencing_id || ""} readOnly />
            </div>
            <div className="flex flex-col">
                <label><b>Registered On</b></label>
                <input className="p-2 border-b-2 bg-purple-100 border-gray-400" type="text" value={moment(member.created_at).format("MMMM Do YYYY, h:mm:ss A (ZZ)")} readOnly />
            </div>
        </div>

    );
}