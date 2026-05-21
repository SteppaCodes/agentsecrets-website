# Injection Styles

The AgentSecrets proxy can inject credentials into outbound requests using multiple standard HTTP authentication styles. 

When your agent makes a request through the proxy, it uses specific `X-AS-Inject-*` headers to instruct the proxy on how to format and insert the resolved credential.

---

## 1. Bearer Token Injection

The most common authentication method for modern REST APIs.

**Header:** `X-AS-Inject-Bearer: <KeyName>`

When the proxy sees this header, it resolves `<KeyName>`, constructs an `Authorization: Bearer <Value>` header, strips the `X-AS-Inject-Bearer` header, and forwards the request.

```bash
curl http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://api.openai.com/v1/models" \
  -H "X-AS-Inject-Bearer: OPENAI_KEY"
```

---

## 2. Custom Header Injection

Many APIs require proprietary headers (e.g., `x-api-key`, `Stripe-Signature`). 

**Header:** `X-AS-Inject-Header: <TargetHeaderName> <KeyName>`

When the proxy sees this header, it creates a new header named `<TargetHeaderName>` containing the resolved credential value.

```bash
curl http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://api.anthropic.com/v1/messages" \
  -H "X-AS-Inject-Header: x-api-key ANTHROPIC_KEY"
```

---

## 3. Basic Authentication

For APIs that use standard HTTP Basic Auth, the proxy can construct the Base64-encoded `Authorization: Basic` header.

**Header:** `X-AS-Inject-Basic: <Username> <PasswordKeyName>`

```bash
curl http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://api.twilio.com/2010-04-01/Accounts" \
  -H "X-AS-Inject-Basic: AC_twilio_username TWILIO_AUTH_TOKEN"
```

---

## 4. Query Parameter Injection

Some APIs expect the API key to be passed in the URL query string rather than HTTP headers.

**Header:** `X-AS-Inject-Query: <QueryParamName> <KeyName>`

When the proxy processes this, it appends `?<QueryParamName>=<ResolvedValue>` to the `X-AS-Target-URL`.

```bash
curl http://localhost:8765/proxy \
  -H "X-AS-Target-URL: https://maps.googleapis.com/maps/api/geocode/json" \
  -H "X-AS-Inject-Query: key GOOGLE_MAPS_KEY"
```
