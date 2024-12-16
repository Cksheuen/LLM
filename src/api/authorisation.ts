import { post } from "./authorisationRequest";

interface GetAuthorisationProps {
    state: string
    codeChallenge: string
}

export const getAuthorisation = async ({
    state, codeChallenge
}: GetAuthorisationProps) => {
    const redirect_uri = 'https://localhost:8000'
    /* const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier); */
    const res = await fetch(`/authorisation/permission/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}
        &redirect_uri=${redirect_uri}&state=${state}
        &code_challenge=${codeChallenge}&code_challenge_method=S256`,
        {
            method: 'GET'
        }
    )

    console.log('Response url:', res.url, typeof res.url);
    // window.location.href = res.url.replace("localhost:8000", "www.coze.cn")

    window.open(res.url.replace("localhost:8000", "www.coze.cn"));
};

interface GetAccessTokenProps {
    code: string
    code_verifier: string
}

export const getAccessToken = async ({
    code, code_verifier
}: GetAccessTokenProps) => {
    const res = await fetch(`/authorisation/permission/oauth2/token`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            grant_type: "authorization_code",
            code,
            redirect_uri: "https://localhost:8000",
            client_id: CLIENT_ID,
            code_verifier
        })  
    })
    return res
    // const CLIENT_ID = "56219448104691175666209112478987.app.coze";
    const REDIRECT_URI = "https://localhost:8000";
    const URL = "https://api.coze.cn/api/permission/oauth2/token";

    const headers = {
        "Content-Type": "application/json"
    };

    const body = {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier
    };

    const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    };

    const headersString = Object.entries(headers)
        .map(([key, value]) => `"${key}"="${value}"`)
        .join("; ");

    console.log(`Invoke-WebRequest -Uri "${URL}" -Method Post -Headers @{${headersString}} -Body '${JSON.stringify(body)}'`);
}
/*  post(
"/permission/oauth2/token",
{
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://localhost:8000",
    client_id: CLIENT_ID,
    code_verifier
}
) */
/* 
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    grant_type = "authorization_code"
    code = "code_xB4hY9E1OSvosBc2JrZUdFhJyBj5ezsyRhy02VQ50qoLnrQy"
    redirect_uri = "https://localhost:8000"
    client_id = "43776825971680051938590413262753.app.coze"
    code_verifier = "1698794268"
}

Invoke-WebRequest -Uri "https://api.coze.cn/api/permission/oauth2/token" -Method Post -Headers $headers -Body ($body | ConvertTo-Json)

*/