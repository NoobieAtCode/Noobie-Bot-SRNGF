const getloginurl = "https://services.fandom.com/kratos-public/self-service/login/api";

// Step 1: Initial GET request
const getRes = await fetch(getloginurl, {
  method: "GET",
  redirect: "manual"
});

// Grab the Set-Cookie header
const setCookie = getRes.headers.get("set-cookie");
// deno-lint-ignore no-explicit-any
const cookies: any = setCookie?.split(";")[0]; // basic cookie extraction

const loginFlow = await getRes.json();
const loginurl = loginFlow.ui.action;

// Step 2: Extract CSRF token
// deno-lint-ignore no-explicit-any
const csrfNode = loginFlow.ui.nodes.find((n:any) => n.attributes?.name === 'csrf_token');
const csrfToken = csrfNode?.attributes?.value;

console.log("CSRF Token:", csrfToken); // Should not be empty if cookie worked

// Step 3: POST login request
const loginRes = await fetch(loginurl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Cookie": cookies
  },
  body: JSON.stringify({
    csrf_token: csrfToken,
    method: "password",
    password_identifier: "NoobieAtCode",
    password: Deno.env.get("MP"),
    captcha_token: ""
  })
});

const result = await loginRes.json();
console.log("res: ", result);
