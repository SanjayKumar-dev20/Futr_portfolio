# Connecting the contact form to a Google Sheet

**For the Futr Markets team. No developer needed. About 10 minutes, once.**

Until this is done, the website's contact form opens the visitor's email app
instead of recording the enquiry. That works for some people and silently
fails for everyone else — anyone using Gmail in a browser, or a phone with no
mail app set up, will think they have sent you a message when nothing arrives.

Once set up, every enquiry does two things: it adds a row to a Google Sheet you
own, and it emails you.

Nothing here costs money, and the data stays in your own Google Drive.

---

## Step 1 — Make the Sheet

1. Go to <https://sheets.google.com> and create a new blank spreadsheet.
2. Name it something like **Futr Markets — Website Enquiries**.
3. At the bottom left, rename the tab from `Sheet1` to **`Enquiries`**
   (right-click the tab → Rename). The spelling matters.

## Step 2 — Add the script

1. In that Sheet, go to **Extensions → Apps Script**. A code editor opens.
2. Delete whatever is in the editor.
3. Open the file **`scripts/google-apps-script.gs`** from the website project,
   copy all of it, and paste it in.
4. Near the top you will see this line:

   ```js
   var NOTIFY_TO = 'info@futrmarkets.com'
   ```

   Change it to the address that should receive enquiries.
5. Click the **save** icon.

## Step 3 — Publish it

1. Top right, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. Google will ask you to authorise it. Click through — when you see
   *"Google hasn't verified this app"*, click **Advanced → Go to (your project)**.
   This is normal: it is your own script, not a third party's.
6. Copy the **Web app URL**. It looks like:

   ```
   https://script.google.com/macros/s/AKfycbx...../exec
   ```

> **Why "Anyone"?** The website posts to this script without anyone being
> logged into Google, so the script has to accept anonymous requests. It only
> ever *adds* rows — it cannot read your Sheet or send anything back.

## Step 4 — Point the website at it

On the web server, find the file **`config.json`** sitting next to
`index.html`. Open it in any text editor and change two values:

```json
{
  "contact": {
    "provider": "sheets",
    "endpoint": "https://script.google.com/macros/s/AKfycbx...../exec",
    "accessKey": ""
  }
}
```

- `provider` — change `"none"` to `"sheets"`
- `endpoint` — paste the URL from Step 3

Save the file. **That is the whole change.** The website does not need to be
rebuilt or redeployed — reload the page and it is live.

> Keep the quotes and commas exactly as they are. If the file stops being valid
> JSON the site falls back to the email-app behaviour rather than breaking, but
> the form will not record anything.

## Step 5 — Test it

1. Go to the website's **Talk** page.
2. Fill the form in properly and send it.
3. You should see *"Sent. We'll come back to you within two working days."*
4. Check the Sheet — a new row.
5. Check your inbox — a notification.

If the row does not appear, see Troubleshooting below.

---

## Where the data lives

| | |
|---|---|
| **Enquiry records** | Your Google Sheet, in your Google Drive |
| **Notifications** | The inbox set as `NOTIFY_TO` |
| **Anyone else?** | No. No third-party form service is involved. |

Because of that, two things are worth deciding early:

- **Who can open the Sheet.** It will fill up with customers' names, emails and
  phone numbers. Share it deliberately, not company-wide.
- **How long you keep it.** Your Privacy Policy needs to state this.

---

## Troubleshooting

**Nothing arrives in the Sheet**

- Re-check `config.json` — is `provider` set to `sheets`, and is the URL the
  full one ending in `/exec`?
- Open the Web app URL directly in a browser. You should see
  `{"ok":true,"service":"Futr Markets enquiry receiver"}`. If you get an error
  page, the deployment access is probably not set to "Anyone".
- Did you edit the script after deploying? Changes are not live until you do
  **Deploy → Manage deployments → edit → New version**.

**The form says "That didn't go through"**

The message was *not* lost — it is held in the browser and the visitor is
shown a one-click email link. This usually means the endpoint URL is wrong or
the script is not reachable.

**Enquiries stopped arriving after a site update**

Check that `config.json` survived the deploy. Some deployment processes
overwrite it with the default. If so, re-apply Step 4 — or ask the developer
to keep your copy during deploys.

**Spam**

The form already blocks automated submissions two ways, invisibly. If real
spam ever gets through, tell the developer — adding a stronger check is a small
change and does not need the form rebuilt from scratch.

---

## Switching to something else later

`config.json` also supports hosted form services if you ever prefer a dashboard
to a spreadsheet:

| `provider` | What you need | Note |
|---|---|---|
| `sheets` | Apps Script URL | Free, data in your Drive |
| `web3forms` | An access key from web3forms.com | Free to 250/month, data on US servers |
| `formspree` | A form URL from formspree.io | Free to 50/month, data on US servers |

The last two store enquiries outside India — worth checking against whatever
your Privacy Policy commits to. Switching also needs one line changed in the
site's security headers, so involve the developer for those two.
