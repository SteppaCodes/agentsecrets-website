# Auth Injection Styles

AgentSecrets supports multiple injection styles to accommodate different API authentication schemas. When your application sends requests to the local proxy, it uses specific `X-AS-Inject-*` headers to instruct the proxy on how and where to inject the resolved credential values.

---

## Bearer token

This is the most common authentication style, used by modern APIs like Stripe, OpenAI, Anthropic, and GitHub.

### Header syntax
```http
X-AS-Inject-Bearer: KEY_NAME
```

### Transformation
The proxy retrieves the secret value associated with `KEY_NAME` (e.g., `sk_live_12345`) and injects it into the outbound request's standard `Authorization` header:

```http
Authorization: Bearer sk_live_12345
```

---

## Basic auth

Used by tools like Jira, Twilio, and legacy REST endpoints. This schema base64-encodes a username and password/token.

### Header syntax
```http
X-AS-Inject-Basic: KEY_NAME
```

### Credential storage format
For Basic authentication, the value stored in AgentSecrets should follow the format:

```text
username:password
```

### Transformation
The proxy retrieves the string, encodes it into standard base64 (`base64(username:password)`), and injects it into the outbound `Authorization` header:

```http
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

---

## Custom header

Many services (like SendGrid or AWS API Gateway) require credentials to be passed in custom header fields (e.g., `X-Api-Key` or `x-api-key`).

### Header syntax
You can specify custom header injections in two ways:

#### 1. JSON header format (Recommended for multiple headers)
```http
X-AS-Inject-Headers: {"X-Api-Key": "SENDGRID_KEY", "X-Org-ID": "ORG_SECRET"}
```

#### 2. Individual header prefix format
```http
X-AS-Inject-Header-X-Api-Key: SENDGRID_KEY
```

### Transformation
The proxy extracts the key name, resolves the secret value, and injects the header into the outbound request:

```http
X-Api-Key: SG.your_sendgrid_key_value
```

---

## Query parameter

Some APIs require passing the credential directly as a query parameter in the URL (e.g., `https://maps.googleapis.com/maps/api/geocode/json?key=YOUR_API_KEY`).

### Header syntax
```http
X-AS-Inject-Query-key: GOOGLE_MAPS_KEY
```

### Transformation
The proxy appends or replaces the parameter in the request query string:

```http
GET /maps/api/geocode/json?address=Lagos&key=AIzaSyActualAPIKey HTTP/1.1
```

> [WARNING]
> While query parameter injection is fully supported, it is discouraged for highly sensitive credentials. Although the proxy encrypts the transit via HTTPS, the target server's access logs will frequently record query strings in plaintext. Use headers or bearer tokens whenever the target API supports them.

---

## JSON body injection

If an API requires authentication or credentials embedded inside a JSON request payload, you can instruct the proxy to perform deep JSON key paths replacement.

### Header syntax
```http
X-AS-Inject-Body-Field: {"auth.token": "APP_TOKEN", "data.user_secret": "USER_SECRET"}
```

### Incoming payload
```json
{
  "auth": {
    "token": "placeholder"
  },
  "data": {
    "user_secret": "placeholder",
    "item": "laptop"
  }
}
```

### Outbound payload (after injection)
```json
{
  "auth": {
    "token": "tok_prod_9988..."
  },
  "data": {
    "user_secret": "sec_val_4433...",
    "item": "laptop"
  }
}
```

---

## Form field injection

For legacy endpoints processing URL-encoded form submissions (`application/x-www-form-urlencoded`), credentials can be injected as form variables.

### Header syntax
```http
X-AS-Inject-Form-Field: {"api_password": "API_SECRET_KEY"}
```

### Transformation
The proxy parses the form body, replaces the value of the `api_password` field with the resolved secret, and rebuilds the URL-encoded payload before transmitting.

---

## Choosing the right style for your API

When designing integrations, use this table to select the most secure injection style supported by the target endpoint:

| Security Level | Style | Best For | Recommendation |
| :--- | :--- | :--- | :--- |
| **High** | `Bearer` / `Basic` | Stripe, OpenAI, standard API gateways | **Best Practice**. Handled securely by web servers and rarely logged. |
| **High** | `Custom Header` | SendGrid, AWS Services, custom APIs | **Excellent**. Securely partitioned in request headers. |
| **Medium** | `JSON Body` | Enterprise SOAP/REST endpoints, custom Webhooks | **Good**. Safe in transit, but parsing overhead applies. |
| **Low** | `Query Parameter` | Google Maps, Weather APIs | **Avoid if possible**. Query parameters are frequently logged by reverse proxies and load balancers. |
