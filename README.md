# BTW-Buddy

BTW-Buddy is a web application designed to automate VAT workflows with smart banking connections, intelligent document management, and instant reporting.  
This MVP version lays the foundation for authentication, transaction management, document handling, and VAT reporting.

---

## 🚀 Features

### 1. Authentication & User Management
- Registration/login with e-mail + password or passkey  
- Two-Factor Authentication (Google Authenticator / Email; SMS optional later)  
- Role-based access: **Admin**, **Employee**, **Office User**

### 2. Business Profile
- Basic details (Name, ID number, Legal form, Status flag)  
- Configurable settings: period (Month / Quarter / Year), toggles for features  

### 3. Bank Connection
- Integration with PSD2/AIS aggregators (e.g., Tink, Yapily, Kosma)  
- Fetch transactions (last 90 days)  
- Store in database: date, amount, description, counter account  
- Fallback: manual CSV import (CAMT/MT940)

### 4. Transaction Management
- Transaction table with filter/sort  
- Labeling & categorization  
- Bulk actions (edit multiple at once)  
- Rule system: “If description contains X → assign label Y”

### 5. Document Management
- Upload receipts/invoices (jpg, png, pdf)  
- OCR integration (Google Vision / Tesseract / Azure Form Recognizer) *(post-MVP)*  
- Extract fields: date, supplier, amount, VAT rate  
- Link document to a transaction

### 6. Rules Engine
- User-created rules  
- Automatic suggestions for recurring transactions  
- Optional AI-based suggestions  

### 7. Reporting & Export
- Period-based reports (summary of transactions & documents)  
- Export formats: CSV, Excel (XML optional)  
- Archive view per period  
- Audit log: track who/what/when changed

### 8. Notifications
- Email reminders (e.g., deadlines)  
- Optional push notifications  

### 9. Data & Security
- Database models: User, Business, BankAccount, Transaction, Receipt, Rule, Period, Report, AuditLog  
- TLS/HTTPS for secure transport  
- Encryption at rest (AES-256)  
- Data hosted in EU  
- Retention policy: 7 years  

---

## 🛠️ Tech Stack

- **Frontend:** React or Vue (dashboard + forms)  
- **Backend:** Node.js (Express) or Python (FastAPI)  
- **Database:** PostgreSQL or MySQL  
- **Hosting:** AWS / Azure / GCP  

---

## 📦 Deliverables (MVP)

- Working webapp (with above modules)  
- Source code with documentation  
- API documentation (Swagger/Postman)  
- Deployment instructions (Docker / CI-CD optional)  
- Staging URL for testing  
- Handover checklist  

---

## 🎯 MVP Scope

- Authentication: email+password, roles (admin/employee/office), 2FA UI (no SMS yet)  
- Business Profile: name, ID/legal form, reporting period  
- Transactions: CSV import, filter/sort, labeling, bulk-edit  
- Rules: basic “if description contains X → label Y”  
- Documents: upload & link to transactions (OCR excluded in MVP)  
- Reporting: summary per period + CSV/Excel export  
- Audit log: basic actions  
- Admin dashboard: manage users, basic settings, data overview  
- Security: HTTPS, password hashing, role-based access  

---

## 🔗 References
- [Rompslomp](https://rompslomp.nl/mogelijkheden)  
- [Moneybird](https://www.moneybird.nl/)  

---

