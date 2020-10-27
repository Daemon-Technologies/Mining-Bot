// import { request } from 'umi';

export async function getMiningInfo() {
    const a = [
      ['ST3YTDS27Y8YW155EMNQ53ZE655FHPF0TAEVRYMV5', 15, 63, 181, '23.81%', '8.20%',3130000]
    ]  
    const resp = []
    for (let i = 0; i<a.length; i+=1){
        const t : any = {};
        for (let j=0 ;j<a[i].length; j+=1){
            switch (j){
                case 0 :
                    t.stxAddress = a[i][j] as string; 
                    break;
                case 1 :
                    t.actualWins = a[i][j] as number;
                    break;
                case 2 :
                    t.totalWins = a[i][j] as number;
                    break;
                case 3 :
                    t.totalMined = a[i][j] as number;
                    break;
                case 4 :
                    t.wonRate = a[i][j] as string;
                    break;
                case 5 :
                    t.actualWonRate = a[i][j] as string;
                    break;
                case 6 :
                    t.burnBTCAmount = a[i][j] as number;
                    break;
                default:
                    break;

            }
        }
        resp.push(t)
    }
    return {'data': resp}

    /*
    [{
        stxAddress: "ST1ZFAP71CCAHCM54VSRN8AWTZ29M8R6WYE4YA3WW",
        actualWins: 105,
        totalWins: 656,
        totalMined: 1859,
        wonRate:'35.29%',
        actualWonRate:'2.40%',
        burnBTCAmount: 18590000
        }]
    */
}
