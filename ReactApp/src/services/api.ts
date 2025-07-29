// src/services/api.ts
export async function getTransactions() {
  // TODO: Fetch from backend
  return [
    { id: '1', title: 'Top up', amount: 1000, date: new Date() },
    { id: '2', title: 'Payment Sent', amount: -500, date: new Date() },
  ];
}

export async function downloadReceipt() {
  // Simulate PDF download
  return new Promise((res) => setTimeout(res, 1000));
}

export async function logoutUser() {
  // Clear AsyncStorage or call logout endpoint
}
