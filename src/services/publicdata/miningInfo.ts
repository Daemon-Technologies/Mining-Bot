// import { request } from 'umi';

export async function getMiningInfo() {
    const a = [
    ['ST1ZFAP71CCAHCM54VSRN8AWTZ29M8R6WYE4YA3WW', 105, 656, 1859, '35.29%', '2.40%',18590000],
    ['ST2BP6PK4V5FKBZS5Q3T2QXF1DGWTF17EBBTKAT72', 34, 241, 474, '50.84%', '0.78%', 4740000],
    ['ST2TJRHDHMYBQ417HFB0BDX430TQA5PXRX6495G1V', 3469, 5618, 9950, '56.46%', '79.16%', 99500000],
    ['ST2Z840ZWSF54AFGB1QAEVJ8S8ME7H5BP81C6HJ19', 388, 1695, 3964, '42.76%', '8.85%', 39640000],
    ['ST3RMK4C9TXHE2CPYB58WB5MK8R4SZE8E0K6EJED5', 0, 813, 1886, '43.11%', '0.00%', 18860000],
    ['ST3WCQ6S0DFT7YHF53M8JPKGDS1N1GSSR91677XF1', 357, 712, 1884, '37.79%', '8.15%', 18840000],
    ['ST4ZD7PZ8VVF4G5T2F7QH84TS7CTRHX52ECJ2A2Q', 0, 68, 195, '34.87%', '0.00%', 1950000],
    ['ST539ZESD7D7RDNHD7MYSM1E3RQ9MNB77QC5CQG2', 29, 149, 333, '44.74%', '0.66%', 3330000]
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