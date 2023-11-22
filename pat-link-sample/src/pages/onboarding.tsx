import { PatLink } from '@/lib/core';
import styles from '@/styles/Home.module.css'
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

  useEffect(() => {
    if (partnerLinkRef) fetchPatLink();
  }, [partnerLinkRef])

  return  <div className={styles.alignCenter}>
    <h1>Complete Onboarding For Tenant-Initiated PAT Link</h1>
    <h2>OF Link ID: {patLink?.of_link_id}</h2>
    <h2>Partner link ref: {patLink?.partner_link_ref}</h2>
    <h2>Partner customer ref: {patLink?.partner_customer_ref}</h2>
    <h2>Tenant link ref: {patLink?.tenant_link_ref}</h2>
    <h2>Gateway redirect url: {patLink?.gateway_redirect_url}</h2>
    <h2>Customer First Name: {patLink?.customer_info.first_name}</h2>
    <h2>Customer Last Name: {patLink?.customer_info.last_name}</h2>
    <h2>Customer Email: {patLink?.customer_info.email}</h2>
    <h2>Customer Mobile Number: {patLink?.customer_info.mobile_number}</h2>
    <h2>Customer Address Line 1: {patLink?.customer_billing_address.address_line_1}</h2>
    <h2>Customer Address Line 2: {patLink?.customer_billing_address.address_line_2}</h2>
    <h2>Customer Postal Code: {patLink?.customer_billing_address.post_code}</h2>
    <h2>Customer Country: {patLink?.customer_billing_address.country}</h2>
    <button onClick={handleSubmit}>Complete Onboarding</button>
  </div>
}
