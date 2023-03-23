import {useSearchParams} from "next/navigation";
import styles from '@/styles/Home.module.css'


export default function ApprovalResult() {
    const searchParams = useSearchParams();
    let status = searchParams.get("status");
    const message = status == 'approved' ? "You purchase is successful" : "You purchases is denied"
    return <div className={styles.center}><h1>{message}</h1></div>
}
