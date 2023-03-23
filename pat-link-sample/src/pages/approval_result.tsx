import {useSearchParams} from "next/navigation";

export default function ApprovalResult (){
    const searchParams = useSearchParams();
    let status = searchParams.get("status");
    return <div><label>Your subscription approval is </label> <b>{status}</b></div>
}
