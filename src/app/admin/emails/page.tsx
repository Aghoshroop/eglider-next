"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./emails.module.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Subscriber {
  id: string; // The email itself acts as the ID in our structure
  email: string;
  subscribedAt: string;
}

export default function AdminEmailsPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "newsletter_subscribers"), orderBy("subscribedAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subsData: Subscriber[] = [];
      snapshot.forEach((subDoc) => {
        subsData.push({ id: subDoc.id, ...subDoc.data() } as Subscriber);
      });
      setSubscribers(subsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching subscribers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (emailId: string) => {
    if (confirm(`Are you sure you want to delete ${emailId} from the list?`)) {
      try {
        await deleteDoc(doc(db, "newsletter_subscribers", emailId));
      } catch (err) {
        console.error("Error deleting subscriber", err);
      }
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', padding: '100px'}}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Captured Emails</h1>
          <p className={styles.subtitle}>Newsletter subscribers from the promotional popup.</p>
        </div>
        <div style={{fontWeight: 600, color: "#111"}}>Total: {subscribers.length}</div>
      </div>

      <div className={styles.tableContainer}>
        {subscribers.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Subscribed At</th>
                <th style={{textAlign: "right"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className={styles.emailText}>{sub.email}</td>
                  <td className={styles.dateText}>{formatDate(sub.subscribedAt)}</td>
                  <td style={{textAlign: "right"}}>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(sub.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
              <polyline points="3 7 12 13 21 7"></polyline>
            </svg>
            <p>No newsletter subscribers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
