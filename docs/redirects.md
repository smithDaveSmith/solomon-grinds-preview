# URL preservation and launch mapping

All ten existing public content URLs are preserved: `/`, `/about-us/`, `/leaving-cert-grinds/`, `/junior-cert-grinds/`, `/oral-preparation/`, `/easter-revision-leaving-junior-cert/`, `/fees/`, `/location/`, `/contact-us/`, `/privacy-statement/`.

New concept URLs: `/timetable/` and `/preview-notes/`. `/404.html` and `/404/` contain the same usable error-page content. Static-host 404 handling must be configured by the chosen live host.

The existing WooCommerce routes were inspected, but their account and payment functions cannot be recreated without the owner's authorised systems. The following mappings are proposed for an official migration, **not configured on the business's current site**:

| Existing URL | Launch treatment |
|---|---|
| `/product/invoice-payment/` | Retain the existing authorised payment route until a tested replacement is approved. The concept uses an external link to it. |
| `/shop/` | 301 to `/fees/`, unless WooCommerce remains required. |
| `/cart/` | Retain the existing payment journey if required; otherwise 301 to `/fees/` after reviewing any pending transactions. |
| `/checkout/` | Retain with the existing payment service. Never redirect an active transaction without an agreed migration. |
| `/my-account/` | Retain if existing customers need accounts; otherwise owner-approved migration required. |
| `/product-category/invoices/` | 301 to `/fees/` only after the existing invoice service is no longer required. |
| `/contact-us/thank-you/` | 301 to `/contact-us/` in the concept migration. It must not imply that a submission happened. |
| `/home/lucan-leaving-junior-cert-grinds/` | 301 to `/`. Old WordPress media attachment page. |
| `/location/lucan-grinds-location-directions-map/` | 301 to `/location/`. Old media attachment page. |
| Other four `/home/.../` attachment URLs listed in the source sitemap | 301 to `/`; retain original media files if inbound links need them. |

No files were deleted from the business's website. No change was made to its live domain, WordPress installation or submission endpoints.
