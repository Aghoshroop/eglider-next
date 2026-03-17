"use client";

import styles from "../admin.module.css";
import { useAdmin, Order } from "@/context/AdminContext";

export default function OrdersPage() {
  const { orders } = useAdmin();

  return (
    <div>
      <div className={styles.headerActions}>
        <h1 className={styles.pageTitle} style={{marginBottom: 0}}>Order Management</h1>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{textAlign: "center", padding: "2rem"}}>
                  Your order pipeline is currently empty.
                </td>
              </tr>
            ) : (
              orders.map((order: Order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.customerName}</td>
                  <td>
                    {order.items.map((item: any, i: number) => (
                      <div key={i}>{item.name} (x{item.quantity})</div>
                    ))}
                  </td>
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
                  <td>
                    <button className={styles.actionBtn}>View</button>
                    {order.status !== "Shipped" && order.status !== "Delivered" && (
                       <button className={styles.actionBtn}>Update</button>
                    )}
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
