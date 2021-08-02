const core = require("@actions/core");
const got = require("got");

const parseJSONQuietly = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

(async function main() {
  const app_key = core.getInput("app-key");
  const http_method = core.getInput("http-method").toLowerCase();
  const api_name = core.getInput("api-name");
  const json = parseJSONQuietly(core.getInput("request-body"));
  const search_params = parseJSONQuietly(core.getInput("search-params"));
  const headers = {
    Authorization: `Bearer ${app_key}`,
    "Content-Type": "application/json; charset=UTF-8",
  };
  const {
    body: { success, error, ...rest },
  } = await got[http_method](`https://api.kakaowork.com/v1/${api_name}`, {
    headers,
    responseType: "json",
    ...(json ? { json } : null),
    ...(search_params ? { searchParams: search_params } : null),
  });
  if (success) {
    core.setOutput("response", rest);
  } else {
    core.setFailed(error);
  }
})().catch(core.setFailed);
