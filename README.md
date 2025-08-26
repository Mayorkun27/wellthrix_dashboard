# Wellthrix Dashboard: A Comprehensive Network Marketing Platform 🚀

This project delivers a robust and intuitive dashboard for Wellthrix International, designed to streamline operations for users, stockists, and administrators within a dynamic network marketing ecosystem. Built with React and Vite, it offers a seamless and highly responsive experience for managing personal networks, financial transactions, digital services, and administrative tasks.

## Features

*   **Multi-Role Authentication & Authorization**: Secure user authentication with distinct dashboards and access controls for regular users, stockists, and administrators.
*   **Dynamic Dashboard Overview**: Personalized dashboards presenting key metrics for each user role, including wallet balances, network performance, and recent activities.
*   **Genealogy Network Tree**: Interactive visualization of the referral network, allowing users to explore their downlines with search and filtering capabilities.
*   **Secure Fund Management**: Comprehensive functionalities for deposits (manual & automated), withdrawals, and peer-to-peer (P2P) transfers between e-wallets.
*   **Digital Service Integration**: Facilitates direct purchase of essential digital services such as airtime, data bundles, and electricity bill payments.
*   **Product Catalog & Shopping Cart**: An intuitive product browsing experience with a fully functional shopping cart system for purchasing physical products through designated stockists.
*   **Detailed Transaction Histories**: Extensive logging and categorized display of all financial and digital transactions, including wallet activities, product purchases, and recharge histories.
*   **Multi-Step User Registration**: A guided, progressive registration flow for new members, ensuring all necessary information is captured efficiently.
*   **Profile Management**: Allows users to update personal, contact, and bank details, as well as securely reset their login password and transaction PIN.
*   **Admin Content Management**: Tools for administrators to create and manage announcements, testimonials, product listings, membership packages, and handle contact requests.
*   **Admin User Management**: Comprehensive administration panel for managing user accounts, including enabling/disabling accounts, designating stockists, and upgrading user packages.
*   **Stockist Order Management**: Dedicated interface for stockists to manage incoming product pickup orders and registration requests.
*   **Responsive & Modern UI**: A clean, mobile-first design built with Tailwind CSS, ensuring a consistent and engaging user experience across all devices.
*   **Optimized Performance**: Leverages Vite for rapid development and optimized build processes, ensuring fast load times and smooth interactions.

## Getting Started

### Environment Variables
To run this project, you will need to add the following environment variables to a `.env` file in the project root:

*   `VITE_API_BASE_URL`: The base URL of your backend API.
    *   Example: `VITE_API_BASE_URL=https://api.yourwellthrixdomain.com`
*   `VITE_IMAGE_BASE_URL`: The base URL where product and announcement images are hosted.
    *   Example: `VITE_IMAGE_BASE_URL=https://images.yourwellthrixdomain.com`
*   `VITE_ENCRYPT_HELPER_SECRET_KEY`: A secret key used for client-side token encryption/decryption (e.g., for redirect tokens).
    *   Example: `VITE_ENCRYPT_HELPER_SECRET_KEY=your_strong_encryption_key_here`
*   `VITE_PAYSTACK_SECRET_KEY`: Paystack secret key, used for resolving bank account details. **Note: Exposing a secret key directly in client-side code is generally discouraged for security reasons. For production, consider proxying this through your backend.**
    *   Example: `VITE_PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key`

## Usage

The Wellthrix Dashboard provides distinct functionalities for different user roles:

### User Panel (`/user/*`)

*   **Dashboard Overview (`/user/overview`)**: Get a quick glance at your e-wallet, purchase wallet, earnings, incentives, and total credit/debit. View recent referrals and announcements.
*   **Network (`/user/network`)**: Visualize your referral network as a tree, with options to expand/collapse nodes and view user details.
*   **Transactions (`/user/transactions`)**: Access a comprehensive history of all your financial movements, including:
    *   **E-Wallet History**: Deposits and transfers to your e-wallet.
    *   **Purchase Wallet History**: Transfers to your purchase wallet.
    *   **Earnings History**: Records of your earnings.
    *   **Withdraw History**: Status of your withdrawal requests.
    *   **Product Purchase History**: Details of products bought.
    *   **E-wallet Transfers**: History of P2P transfers.
*   **Deposit Funds (`/user/deposit`)**: Fund your e-wallet via manual bank transfer (requiring proof of payment) or automated methods (if configured).
*   **Withdraw Funds (`/user/withdraw`)**: Request withdrawals from your incentive or earning wallets to your linked bank account.
*   **Transfer Funds (`/user/transfer`)**: Move funds between your e-wallet and purchase wallet.
*   **E-wallet Transfer (`/user/ewallettransfer`)**: Initiate peer-to-peer transfers to other users using their username.
*   **Digital Services (`/user/recharge`)**: Purchase airtime, data bundles, or pay electricity bills directly from your dashboard.
*   **Recharge History (`/user/rechargehistory`)**: View detailed records of all your digital service purchases.
*   **Products (`/user/products`)**: Browse available products, add them to your cart, and proceed to checkout by selecting a stockist.
*   **Cart (`/user/products/cart`)**: Manage items in your shopping cart before checkout.
*   **User Registration (`/user/register`)**: Guide new members through a step-by-step registration process, including package selection, sponsor/placement assignment, contact details, and login information.
*   **Profile Management (`/user/profile`)**: Update your personal information, contact details, bank account information, and manage your password and transaction PIN.
*   **Upgrade Package (`/user/upgrade`)**: View available packages and initiate an upgrade to enhance benefits and network potential.

### Admin Panel (`/admin/*`)

*   **Admin Overview (`/admin/overview`)**: Access high-level statistics like total users, pending deposits, total credit, and total debit.
*   **Manage Users (`/admin/allusers`)**: View, search, activate/deactivate user accounts, enable stockist roles, and upgrade user packages.
*   **Manage Announcement (`/admin/manageannouncement`)**: Create, edit, and delete announcements displayed to all users.
*   **Manage Testimonials (`/admin/managetestimonials`)**: Curate and publish testimonials from satisfied members.
*   **Manage Transactions (`/admin/managetransactions`)**: Oversee all manual deposit and withdrawal requests, allowing for confirmation or decline.
*   **Product Upload (`/sunmence/uploadproduct`)**: (Accessible by 'sunmence' role) Upload and manage product listings, including details, pricing, stock levels, and images.
*   **Manage Contacts (`/admin/managecontacts`)**: Review and manage contact requests submitted by users.
*   **Subscribers (`/admin/subscribers`)**: View a list of all newsletter subscribers.
*   **Manage Packages (`/admin/managepackages`)**: Define and adjust membership packages, including their names, prices, and point values.
*   **Manage Loyalty Bonuses (`/admin/loyaltybonus`)**: Track and manage loyalty bonus payouts for eligible users.
*   **Manage Milestone Bonuses (`/admin/milestonebonus`)**: Monitor and process milestone achievements and associated bonuses.
*   **Ranking (`/admin/ranking`)**: View unilevel and rank achievement statistics.

### Stockist Panel (`/stockist/*`)

*   **Stockist Dashboard (`/stockist/managestockist`)**: Overview of stockist balance.
*   **Pickup Orders**: Manage product orders placed by users for pickup.
*   **Registration Orders**: Oversee registration orders.
*   **Transaction History**: View all transactions relevant to the stockist role.

## Technologies Used

| Category         | Technology                 | Description                                    | Link                                              |
| :--------------- | :------------------------- | :--------------------------------------------- | :------------------------------------------------ |
| **Frontend**     | React                      | JavaScript library for building UIs            | [React.dev](https://react.dev/)                   |
| **Build Tool**   | Vite                       | Fast development build tool                    | [Vitejs.dev](https://vitejs.dev/)                 |
| **Styling**      | Tailwind CSS               | Utility-first CSS framework                    | [Tailwindcss.com](https://tailwindcss.com/)     |
| **API Client**   | Axios                      | Promise-based HTTP client                      | [Axios-http.com](https://axios-http.com/)         |
| **Form Management** | Formik                    | Build forms in React without tears             | [Formik.org](https://formik.org/)                 |
| **Validation**   | Yup                        | JavaScript schema builder for value parsing    | [Yup.dev](https://github.com/jquense/yup)         |
| **Animations**   | Framer Motion              | Production-ready motion library for React      | [Framer.com/motion](https://www.framer.com/motion/) |
| **Routing**      | React Router DOM           | Declarative routing for React                  | [Reactrouter.com](https://reactrouter.com/)       |
| **Notifications** | Sonner                     | A beautifully designed toast for React         | [Sonner.emilkowalski.it](https://sonner.emilkowalski.it/) |
| **UI Components** | Headless UI & Floating UI  | Unstyled, accessible UI components             | [Headlessui.com](https://headlessui.com/)         |
| **Utilities**    | Lodash                     | JavaScript utility library                     | [Lodash.com](https://lodash.com/)                 |
| **Icons**        | Lucide React & React Icons | Collection of customizable open-source icons   | [Lucide.dev](https://lucide.dev/)                 |
| **Phone Validation** | libphonenumber-js        | Parse, format, and validate phone numbers      | [Google/libphonenumber](https://github.com/google/libphonenumber) |
| **Encryption**   | Crypto-js                  | Standard and secure cryptographic algorithms   | [GitHub/CryptoJS](https://github.com/brix/crypto-js) |

## Author Info

*   **Your Name**: Adeleke Oluwamayokun
*   **LinkedIn**: [\[LinkedIn Profile URL\]](https://www.linkedin.com/in/adeleke-oluwamayokun-780a912a5)
*   **Twitter**: [\[Twitter Handle\]](https://www.x.com/Mayorkun_27)
*   **Portfolio**: [\[Personal Portfolio URL\]](oluwamayokun.vercel.app)

---

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Formik](https://img.shields.io/badge/Formik-213E7C?style=for-the-badge&logo=formik&logoColor=white)
![Yup](https://img.shields.io/badge/Yup-713B82?style=for-the-badge&logo=yup&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
