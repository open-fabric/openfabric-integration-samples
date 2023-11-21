import { OF_GATEWAY_REDIRECT_URL } from '@/lib/config'
import { v4 as uuid } from 'uuid';
import styles from '@/styles/Home.module.css'

export default function Onboarding() {
  const handleSubmit = () => {
    const partnerLinkRef = uuid();
    window.location.href = `${OF_GATEWAY_REDIRECT_URL}?phase=onboarding_completed&partner_link_ref=${partnerLinkRef}`
  }
  return <div className={styles.alignCenter}>
          <h1>Complete Onboarding For Tenant-Initiated PAT Link</h1>
          <br />
          <button onClick={handleSubmit}>Complete Onboarding</button>
      </div>
}
