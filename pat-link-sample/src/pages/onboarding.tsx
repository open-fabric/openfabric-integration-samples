import { PatLink } from '@/lib/core';
import styles from '@/styles/Onboarding.module.css';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Onboarding() {
  const searchParams = useSearchParams();
  const [patLink, setPatLink] = useState<PatLink | undefined>(undefined);
  const partnerLinkRef = searchParams.get("partner_link_ref")

  const handleSubmit = (event: any) => {
    event.preventDefault();

    window.location.href = `${patLink?.gateway_redirect_url}?phase=onboarding_completed&partner_link_ref=${partnerLinkRef}`
  }

  const fetchPatLink = async () => {
    const response = await fetch(`/merchant-pat-link/api/pat_link?partner_link_ref=${partnerLinkRef}`);

    if (response.ok) {
      const patLink = await response.json();
      setPatLink(patLink);
    } else {
      console.error('Failed to fetch pat link.');
    }
  };

  const renderPatDetails = (obj?:{[key:string]: string}): any => {
    if (!patLink) return <div></div>
    const object = obj || patLink;
    return Object.keys(object).map((key: string) => {
      if (key === 'customer_info' || key === 'billing_address') {
        return renderPatDetails(patLink[key])
      } 

      return <div className={styles.dataRow}>
      <div className={styles.dataKey}>{`${key}:`}</div> 
      <div className={styles.dataValue}>{object[key as keyof PatLink] as string}</div>
    </div>
    })
  }
  useEffect(() => {
    if (partnerLinkRef) fetchPatLink();
  }, [partnerLinkRef])

  return <div className={styles.container}>
  <h2 className={styles.h2}>Customer Onboarding on Partner</h2>
  <h3 className={styles.h3}>Complete Onboarding For Tenant-Initiated PAT</h3>
  <div id="content" className={styles.content}>
    <div className={styles.data}>
      <h2>PAT Link Details:</h2>
        {renderPatDetails()}
    </div>
  <button className={styles.button} type="button" id="createButton" onClick={handleSubmit}>Complete Onboarding</button>
</div>
</div>
}
