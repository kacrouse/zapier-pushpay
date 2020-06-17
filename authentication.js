module.exports = {
  type: "oauth2",
  test: {
    url: "{{process.env.BASE_DATA_ENDPOINT}}/v1/merchants/in-scope",
    method: "GET",
    params: {},
    headers: {
      Authorization: "Bearer {{bundle.authData.access_token}}",
      accept: "application/hal+json",
    },
    body: {},
    removeMissingValuesFrom: {},
  },
  oauth2Config: {
    authorizeUrl: {
      method: "GET",
      url: "{{process.env.BASE_AUTH_ENDPOINT}}/oauth/authorize",
      params: {
        client_id: "{{process.env.CLIENT_ID}}",
        state: "{{bundle.inputData.state}}",
        redirect_uri: "{{bundle.inputData.redirect_uri}}",
        response_type: "code",
      },
    },
    getAccessToken: {
      source:
        "const options = {\n  url: `${process.env.BASE_AUTH_ENDPOINT}/oauth/token`,\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/x-www-form-urlencoded',\n    'accept': 'application/json',\n    'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`\n  },\n  body: {\n    code: bundle.inputData.code,\n    grant_type: 'authorization_code',\n    redirect_uri: bundle.inputData.redirect_uri\n  }\n}\n\nreturn z.request(options)\n  .then((response) => {\n    response.throwForStatus();\n    const results = response.json;\n\n    // You can do any parsing you need for results here before returning them\n\n    return results;\n  });",
    },
    refreshAccessToken: {
      source:
        "const options = {\n  url: `${process.env.BASE_AUTH_ENDPOINT}/oauth/token`,\n  method: 'POST',\n  headers: {\n    'content-type': 'application/x-www-form-urlencoded',\n    'accept': 'application/json',\n    'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`\n  },\n  body: {\n    'refresh_token': bundle.authData.refresh_token,\n    'grant_type': 'refresh_token'\n  }\n}\n\nreturn z.request(options)\n  .then((response) => {\n    response.throwForStatus();\n    const results = response.json;\n\n    // You can do any parsing you need for results here before returning them\n\n    return results;\n  });",
    },
    autoRefresh: true,
    scope:
      "list_my_merchants merchant:view_community_members merchant:view_payments read",
  },
};
