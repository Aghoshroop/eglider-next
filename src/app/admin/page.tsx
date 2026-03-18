"use client";

import styles from "./admin.module.css";
import { useAdmin } from "@/context/AdminContext";

export default function AdminDashboard() {
  const { products, orders } = useAdmin();

  // Calculate live stats
  const totalProductCost = products.reduce((sum, product) => sum + (product.price || 0), 0);
  const pendingOrders = orders.filter(o => o.status !== "Shipped" && o.status !== "Delivered");
  
  // Show up to 5 recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Total Product Cost</h3>
          <p className={styles.metricValue}>₹{totalProductCost.toFixed(2)}</p>
          <span className={styles.metricChange}>Entire catalog</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Active Products</h3>
          <p className={styles.metricValue}>{products.length}</p>
          <span className={styles.metricChange}>Live in catalog</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Orders Pending</h3>
          <p className={styles.metricValue}>{pendingOrders.length}</p>
          <span className={pendingOrders.length > 0 ? styles.metricChangeNegative : styles.metricChange}>
            {pendingOrders.length > 0 ? `${pendingOrders.length} require attention` : "All caught up"}
          </span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{textAlign: "center", padding: "2rem"}}>
                  No orders found across the platform.
                </td>
              </tr>
            ) : (
              recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.substring(0, 6)}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td>
                    <span 
                      className={order.status === "Shipped" || order.status === "Delivered" ? styles.statusShipped : 
                                 order.status === "Processing" ? styles.statusProcessing : 
                                 styles.statusPending}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
