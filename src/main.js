import {spawn} from "child_process";// tv child_process tạo ra và quản lý các quy trình con 
//spawn: Hàm này tạo ra một quy trình con mới và trả về một đối tượng ChildProcess
import {createApp} from ".";
import {db} from "./configs";
import commands from "./app/commands";

const host = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT, 10) || 3456; // 10 : radix -> ts1 được diễn giải như một số thập phân. 

const app = createApp();
db.connect();

// Run Server
const server = app.listen(port, host, function () {
    console.log(`Server is running on http://${host}:${port} in ${app.settings.env} mode.`);
});

// Cron job. don't care it ! 
commands();

// Eslint
if (process.env.__ESLINT__ === "true") {
    const command = "npm";
    const args = ["run", "lint", "--silent"]; //--silent tắt tiếng ra của ESLint, ngăn chặn việc hiển thị các thông báo trên console 
    const options = {stdio: "inherit", shell: true};
    //stdio: "inherit":  Thiết lập luồng của tiến trình con để thừa kế từ tiến trình chính
    //shell: true: Cho npm chạy lệnh lint thông qua shell

    const eslintProcess = spawn(command, args, options);

    //onClose when ESLint ended , ts1 happen ts2 run 
    eslintProcess.on("close", function (code) { 
        if (code !== 0) { // code thoát khác 0, có nghĩa là quá trình linting của ESLint đã gặp lỗi
            console.log("Server is gracefully shutting down...");
            server.close(function () {
                console.log("Server has been closed. Goodbye!");
                process.exit(code);
            });
        }
    });
}
//kiểm tra mã (linting) 
