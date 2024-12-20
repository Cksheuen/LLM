import { get } from './request';
import { PublishedBotsList } from '@/type.d/space';
import { BotObject } from '@/type.d/bot';

export const getPublishedBotsList = () => get<PublishedBotsList>('/v1/space/published_bots_list?space_id=7434862657439711273');
export const getBotDetails = (bot_id: string) => get<BotObject>(`/v1/bot/get_online_info?bot_id=${bot_id}`)
/* export const getPublishedBotsList = async () => {
    const res = await fetch('/api/v1/space/published_bots_list?space_id=7434862657439711273', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PERSONAL_AUTH_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }
    )
    console.log(res);
    
    const res2 = await get('/v1/space/published_bots_list?space_id=7434862657439711273');
    console.log(res2);

    const res3 = await fetch('https://api.coze.cn/v1/space/published_bots_list?space_id=7434862657439711273', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PERSONAL_AUTH_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }
    )
    console.log(res3);
    
    return res;
} */
/* 
$headers = @{
    'Authorization' = 'Bearer pat_4S4Z5nB2G2eD6aNlh2oZpxHdrHLT51AW4lD2B52IOxDRZdoifSRk8z7NKg86Vwv7'
    'Content-Type'  = 'application/json'
}

$url = 'https://api.coze.cn/v1/space/published_bots_list?space_id=7434862657439711273'

$response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
$response | ConvertTo-Json -Depth 10
 */