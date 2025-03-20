import axios from 'axios'

const fc = async () => {
    await axios.post("https://groups.roblox.com/v1/groups/5211428/users", {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        "sessionId": "string",
        "redemptionToken": "string",
        "captchaId": "string",
        "captchaToken": "string",
        "captchaProvider": "string",
        "challengeId": "string"
    }).then((r=>{
        console.log(r)
    }))
}

fc()