# Leads and pledges

`POST /api/submit` stores every pledge, volunteer signup, partner inquiry and contact message in D1 (`leads` table) and appends a row to the Google Sheet **ASHE Website Leads & Pledges**.

Body: `{ type: 'pledge'|'volunteer'|'partner'|'contact', name, email, phone?, organization?, amount?, currency?, method?, message?, page?, website? }` (`website` is a hidden honeypot field and must stay empty).

## One-time Google setup
1. Google Cloud: create a service account, enable the Sheets API, create a JSON key.
2. Share the sheet with the service account's email as Editor.
3. `wrangler pages secret put GOOGLE_SERVICE_ACCOUNT_JSON` (paste the whole JSON). `SHEET_ID` is set in `wrangler.toml`.

Until that is done, leads are still saved in D1 (`sheet_synced = 0`) and nothing is lost.
