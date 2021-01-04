import { MiningInfo } from "../client/data";
import { MinerInfo } from "./data";
import * as xlsx from 'xlsx';

export async function exportInfo(rows: MinerInfo[] | MiningInfo[]) {
    let workSheet = xlsx.utils.json_to_sheet(rows);
    let wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, workSheet);
    xlsx.writeFile(wb, 'info.xlsx');
}