export const dummyOrders = [
  {
    id: 1,
    userId: 1,
    userName: "John Doe",
    books: [
      { bookId: 1, title: "Atomic Habits", quantity: 1, price: 12.99 },
      { bookId: 2, title: "The Psychology of Money", quantity: 2, price: 15.49 }
    ],
    total: 43.97,
    status: "Delivered",
    date: "2024-10-01",
    paymentMethod: "Credit Card"
  },
  {
    id: 2,
    userId: 2,
    userName: "Jane Smith",
    books: [
      { bookId: 3, title: "Clean Code", quantity: 1, price: 29.99 }
    ],
    total: 29.99,
    status: "Shipped",
    date: "2024-10-05",
    paymentMethod: "PayPal"
  },
  // Add 8 more recent orders, statuses: Pending, Shipped, Delivered, Cancelled
  {
    id: 3,
    userId: 3,
    userName: "Bob Johnson",
    books: [
      { bookId: 4, title: "Sapiens", quantity: 1, price: 18.99 }
    ],
    total: 18.99,
    status: "Pending",
    date: "2024-10-07",
    paymentMethod: "Stripe"
  },
  {
    id: 4,
    userId: 4,
    userName: "Alice Brown",
    books: [
      { bookId: 5, title: "Dune", quantity: 3, price: 14.99 }
    ],
    total: 44.97,
    status: "Cancelled",
    date: "2024-10-08",
    paymentMethod: "Credit Card"
  },
  {
    id: 5,
    userId: 5,
    userName: "Charlie Wilson",
    books: [
      { bookId: 6, title: "1984", quantity: 1, price: 10.99 },
      { bookId: 7, title: "The Lean Startup", quantity: 1, price: 22.50 }
    ],
    total: 33.49,
    status: "Shipped",
    date: "2024-10-09",
    paymentMethod: "PayPal"
  },
  {
    id: 6,
    userId: 6,
    userName: "Diana Evans",
    books: [
      { bookId: 8, title: "Deep Work", quantity: 2, price: 16.99 }
    ],
    total: 33.98,
    status: "Delivered",
    date: "2024-10-10",
    paymentMethod: "Credit Card"
  },
  {
    id: 7,
    userId: 7,
    userName: "Mike Davis",
    books: [
      { bookId: 9, title: "Thinking, Fast and Slow", quantity: 1, price: 19.99 }
    ],
    total: 19.99,
    status: "Pending",
    date: "2024-10-12",
    paymentMethod: "Stripe"
  },
  {
    id: 8,
    userId: 8,
    userName: "Sarah Connor",
    books: [
      { bookId: 10, title: "JavaScript: The Good Parts", quantity: 1, price: 25.99 }
    ],
    total: 25.99,
    status: "Shipped",
    date: "2024-10-13",
    paymentMethod: "PayPal"
  },
  {
    id: 9,
    userId: 9,
    userName: "Tom Hardy",
    books: [
      { bookId: 11, title: "You Don't Know JS", quantity: 1, price: 32.99 }
    ],
    total: 32.99,
    status: "Delivered",
    date: "2024-10-14",
    paymentMethod: "Credit Card"
  },
  {
    id: 10,
    userId: 10,
    userName: "Emma Watson",
    books: [
      { bookId: 12, title: "Pride and Prejudice", quantity: 2, price: 8.99 }
    ],
    total: 17.98,
    status: "Pending",
    date: "2024-10-15",
    paymentMethod: "Stripe"
  }
];
