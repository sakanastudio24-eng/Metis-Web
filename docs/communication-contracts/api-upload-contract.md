# Metis API Upload Contract

This contract defines extension-to-backend communication for uploads, queueing, and rate limiting.

## V1 route set

- `POST /api/events`
- `POST /api/scan-summary`
- `POST /api/premium-report-request`

## Route purpose

`POST /api/events` is for:

- panel opened
- auth CTA clicked
- full scan opened
- upgrade clicked

`POST /api/scan-summary` is for:

- summarized metrics only
- one meaningful scan payload

`POST /api/premium-report-request` is for:

- analyze deeper
- save this scan
- future paid logic

## Upload rules

Upload only when:

- user is signed in
- user opens full scan
- user explicitly requests report behavior
- analytics event matters

Do not upload every passive page scan.

Send summaries, not raw surveillance-like data.

## Local queue keys

- `metis_upload_queue`

## Queue item families

- analytics event
- summarized scan
- premium report request

## Queue behavior

- failed uploads are queued in `chrome.storage.local`
- retry later
- clear on success
- queueing should improve reliability without making the extension feel blocked on the network

## Rate-limit rules

- only 1 summary upload per route within the configured time window
- debounce repeated actions
- merge repeated analytics where reasonable

## Payload families

```ts
type UsageEvent = {
  type: string;
  occurredAt: number;
  route?: string;
};

type ScanSummary = {
  route: string;
  score: number | null;
  issueCount: number;
  confidence: string | null;
};

type PremiumReportRequest = {
  route: string;
  requestedAt: number;
  source: "panel" | "report" | "popup";
};
```

## Trust rule

Every upload payload should have a clear answer to:

Why does Metis need this?

If that answer is weak, do not send it.
