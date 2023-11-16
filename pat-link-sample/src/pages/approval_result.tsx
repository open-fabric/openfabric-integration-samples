import {useSearchParams} from "next/navigation";
import styles from '@/styles/Home.module.css'


export default function ApprovalResult() {
    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const linkId = searchParams.get("link_id");
    const partnerLinkRef = searchParams.get("partner_link_ref");
    return <div className={styles.center}>
        <h1>You transaction is {status}</h1>
        <h2>Link ID: {linkId}</h2>
        <h2>Partner link ref: {partnerLinkRef}</h2>
    </div>
}
