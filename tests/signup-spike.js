import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summarySpike.html": htmlReport(data),
    };
  }
  
export const options = {
    stages: [{ duration: '2m', target: 2000 },     
             { duration: '1m', target: 0 }],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.01'],
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default function () {
    const url = 'http://localhost:3333/signup';

    const payload = JSON.stringify({
        email: `${uuidv4()}@qa.com.br`,
        password: 'Test@123'
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const res = http.post(url, payload, { headers: headers });
   

    check(res, {
        'status should be 201': (r) => r.status === 201,
    });

    sleep(1);
}
