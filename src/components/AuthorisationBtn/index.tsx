import { useAuthorizationStore } from '@/store/authorisation';
import { getAuthorisation, getAccessToken } from '@/api/authorisation';
import { generateCodeChallenge, verifier, sha256 } from '@/utils/generateCode';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function AuthorisationBtn() {
  const location = useLocation();
  const authorisation = useAuthorizationStore((state) => state.authorisation);
  const code_verifier = useAuthorizationStore((state) => state.code_verifier);
  const setAuthorisation = useAuthorizationStore(
    (state) => state.setAuthorisation,
  );
  const setCodeVerifier = useAuthorizationStore(
    (state) => state.setCodeVerifier,
  );

  const requestAccessToken = async (code: string) => {
    console.log('requestAccessToken');

    if (code_verifier) {
      /* 
            grant_type: "authorization_code",
            code,
            client_id: import.meta.env.VITE_CLIENT_ID,
            redirect_uri: "https://localhost:8000",
            code_verifier
            */
      console.log({
        code,
        code_verifier,
        client_id: import.meta.env.VITE_CLIENT_ID,
        redirect_uri: 'https://localhost:8000',
        grant_type: 'authorization_code',
      });

      const res = await getAccessToken({ code, code_verifier });
      console.log('getAccessToken', res);
    }
  };
  /* 
  function test() {
    // 生成 code_verifier
    const code_verifier = verifier();

    // 生成 code_challenge
    const code_challenge = sha256(code_verifier);

    console.log('code_verifier:', code_verifier);
    console.log('code_challenge:', code_challenge);

    // 示例字符串
    const buffer = 'Z8kQkz4VCId3r4H2cpbQEnoPLdyfJDUQFkdRdgkC_8k';

    // 计算 SHA-256 哈希并进行 Base64 URL 编码
    const hash = sha256(buffer);

    console.log('SHA-256 哈希结果:', hash);
  }
 */
  useEffect(() => {
    // test()
    const searchParams = new URLSearchParams(location.search);
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    console.log('State:', state);
    console.log('Code:', code);

    if (state && code) {
      requestAccessToken(code);
    }
  });

  const generateState = () => {
    return Math.random().toString(36).substring(2);
  };

  const requestAuthorisation = async () => {
    // const authorisation = window.prompt("请输入授权码")
    // get(`/permission/oauth2/authorize${}`)
    try {
      // const code_verifier = generateCodeVerifier()
      const code_verifier = verifier();
      setCodeVerifier(code_verifier);
      console.log('requestAuthorisation', code_verifier, sha256(code_verifier));

      const res = await getAuthorisation({
        state: generateState(),
        // codeChallenge: code_verifier
        codeChallenge: generateCodeChallenge(code_verifier),
        // base64URLEncode(sha256(verifier))
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    if (authorisation) {
      setAuthorisation(authorisation);
    }
  };
  return (
    <div className="text-gray-9 absolute flex h-full w-full items-center justify-center">
      <div className="bg-gray-4 op-80 absolute z-10 h-full w-full"></div>
      <div className="bg-gray-5 op-100 relative z-20 flex h-40 w-80 flex-col items-center justify-center gap-3">
        AuthorisationBtn
        <div onClick={requestAuthorisation} className="btn bg-gray-6">
          申请权限
        </div>
        <div>{authorisation ? 'Authorised' : 'Not Authorised'}</div>
      </div>
    </div>
  );
}

/* 


$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    grant_type    = 'authorization_code'
    code          = 'code_ghD6md1iWa6HeylJxF9qbOqIQm6Wu2vrS76zvFoLlEz9dgeU'
    redirect_uri  = 'https://localhost:8000'
    client_id     = '43776825971680051938590413262753.app.coze'
    code_verifier = '6800392862'
}

$response = Invoke-RestMethod -Uri 'https://api.coze.cn/api/permission/oauth2/token' -Method Post -Headers $headers -Body ($body | ConvertTo-Json)
$response | ConvertTo-Json -Depth 10


*/
