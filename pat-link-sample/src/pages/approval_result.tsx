import {useSearchParams} from "next/navigation";
import styles from '@/styles/Home.module.css'


export default function ApprovalResult() {
    const searchParams = useSearchParams();
    const status = searchParams.get("pat_status");
    const linkId = searchParams.get("pat_link_id");
    const partnerLinkRef = searchParams.get("pat_partner_link_ref");
    return <div className={styles.center}>
        <h1>You transaction is {status}</h1>
        <h2>Link ID: {linkId}</h2>
        <h2>Partner link ref: {partnerLinkRef}</h2>
    </div>
}
