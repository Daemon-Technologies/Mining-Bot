import { MiningInfo } from "../client/data";
import { MinerInfo } from "./data";
import * as xlsx from 'xlsx';
import { message } from "antd";
import { showMessage } from "../locale";

export async function exportInfo(rows: MinerInfo[] | MiningInfo[]) {
    if (!rows || (rows && rows.length === 0)) {
        message.warning(showMessage('导出数据为空!', 'Data is empty!'));
        return;
    }
    let workSheet = xlsx.utils.json_to_sheet(rows);
    let wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, workSheet);
    xlsx.writeFile(wb, 'info.xlsx');
}