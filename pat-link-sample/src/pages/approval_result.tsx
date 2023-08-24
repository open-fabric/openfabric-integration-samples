import {useSearchParams} from "next/navigation";
import styles from '@/styles/Home.module.css'


export default function ApprovalResult() {
    const searchParams = useSearchParams();
    let status = searchParams.get("pat_status");
    return <div className={styles.center}><h1>You transaction is {status}</h1></div>
}
