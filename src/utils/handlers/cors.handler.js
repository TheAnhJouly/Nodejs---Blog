import cors from "cors";//Chia sẻ tài nguyên giữa các nguồn khác nhau
import {APP_URL_CLIENT, OTHER_URLS_CLIENT} from "@/configs"; // localhost:3000 and :3456 

const origin = [APP_URL_CLIENT, ...OTHER_URLS_CLIENT];

export const corsHandler = cors({
    origin,// lấy giá trị 
    credentials: true,
});

//credentials:true: Cho phép gửi cookie (và các credential khác) giữa các nguồn.
//Nghĩa từ: credentials: thông tin xác thực 