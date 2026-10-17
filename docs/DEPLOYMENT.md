# Deployment and cost guard

No public deployment exists yet. AWS CLI reports missing credentials; the template
has not been applied to an AWS account. Local container build/health verification
is separate from cloud provisioning. No AWS credits have been consumed by this work.

## Local demo

Node >=20.19 and npm: `make demo`. Open http://127.0.0.1:8787. This installs locked
platform packages, builds and starts the synthetic demo. `make up` uses Docker.
The server is single-process/session-memory and must not be scaled horizontally
without a durable authenticated store. No real health data is supported.

`docker compose -f infra/compose.yaml --profile upstreams up --build` additionally
runs wrappers for both original projects. Original MediKiosk requires an explicitly
authorized isolated Supabase configuration. The wrapper does not manufacture a
working database or inherit the original READMEs' security claims.

## AWS IaC

CloudFormation was chosen because AWS CLI is installed and it avoids requiring
another state-management tool. `infra/aws/template.yaml` defines a VPC, one public
subnet/route, an instance restricted to CloudFront origin-facing addresses, an
HTTPS CloudFront distribution, encrypted 12 GB EBS, a $20 monthly budget, and a
scheduled function that stops the instance at 21:00 UTC (02:30 IST). No NAT,
RDS, ALB, persistent PHI store, cloud AI service or paid custom domain is created.
The cloud hosts synthetic demo data only. The Python Privacy Node stays local.

Prerequisites: intended AWS account/region authenticated, spending permission,
CloudFront prefix-list quota allowance, exact tested commit pushed to GitHub,
and optional BILLING_EMAIL for actual budget notifications. Run:

```bash
aws sts get-caller-identity
AWS_REGION=ap-south-1 BILLING_EMAIL=your-address make deploy
```

The script pins the current Git commit. A stack output gives the real HTTPS URL
only after provisioning succeeds. User-data builds can take several minutes.
Validate `/healthz`, create a session, grant consent and run the browser journey
against that URL. Do not call a CREATE_COMPLETE stack an application health check.
The current synthetic-only origin uses HTTP from CDN to EC2; real PHI needs
origin TLS and a fully reviewed security architecture before any deployment.

The managed prefix list can consume substantial security-group rule quota; confirm
account quota first. Stopping/restarting changes an instance's public DNS; update
the distribution origin or replace the stack before the next demo. Automated
startup/recovery, durable state, OIDC staging/production promotion, ECR publishing,
monitoring dashboards and automatic application rollback are pending.

## Estimated cost, not a current-price guarantee

| Resource | Conservative planning allowance / month |
|---|---:|
| One t3.micro Linux demo instance, standard CPU credits | $12 |
| 12 GB gp3 EBS | $2 |
| One public IPv4 | $4 |
| CloudFront/light demo transfer and requests | $2 |
| Tiny scheduled Lambda/EventBridge/budget usage | $1 |
| Total planning allowance | $21 |

This is an estimate, not a verified quote or proof of free-tier eligibility.
AWS free-tier/credit programmes depend on account date, plan and remaining credit.
Check [AWS Free Tier](https://aws.amazon.com/free/),
[EC2 pricing](https://aws.amazon.com/ec2/pricing/on-demand/),
[IPv4 pricing](https://aws.amazon.com/vpc/pricing/),
[EBS pricing](https://aws.amazon.com/ebs/pricing/),
[CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/) and the account's
billing calculator before apply. No external service is assumed permanently free.
The $100 credit fit is conditional on confirmed account credits and bounded demo
traffic; the stack cannot prove that without billing access. A $20 budget alert
is not an automatic hard cap; daily stop reduces compute but storage remains billed.

Sarvam is disabled by default. Optional welcome TTS uses static nonclinical text,
cache, a local 20-request cap and fallback. Official pricing was checked in
DISCOVERY; account credits/retention/commercial licensing need confirmation.
Local Cognee/model execution has no API fee but uses the user's CPU/RAM/storage.

## Rollback / teardown

For a broken app, stop the instance and inspect its user-data logs; the demo
contains no durable health records to recover. Redeploy the last verified commit
through a replacement instance/stack after reviewing CloudFormation changes.
Do not re-run user-data assumptions as if they were an automatic rollback.

`make destroy` requests deletion of the demo stack. Wait for DELETE_COMPLETE and
check EC2, volumes, CloudFront, budgets and billing afterwards. The nightly stop
is not teardown. Delete only this stack; do not remove unrelated account resources.

## Mobile

`make mobile` starts the Expo development client. `cd apps/mobile && npm run
prebuild` generates Android sources; a local Gradle build is attempted and its
final status is in PROGRESS. Release builds currently use Android's development
signing configuration, suitable only for internal demos. Production signing,
iOS distribution and real-device health/notification validation are pending.

For local native builds only, `-Pdhaaga.ndkVersion=28.2.13676358` can select the already-installed NDK while preserving Expo's default. This override remains experimental until the APK build completes. The Android workflow generates an internal-demo signing key when absent; production signing must be configured separately.
