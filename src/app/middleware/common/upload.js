import multer from "multer";
import {isArray} from "lodash";
import {FileUpload} from "@/utils/types";

// multer.memoryStorage() được sử dụng để lưu trữ file trong bộ nhớ
const defaultMulter = multer({
    storage: multer.memoryStorage(),
});

export function upload(req, res, next) {
    const newNext = function (err) {
        if (err) {
            return next(err);
        }

        try {
            const files = req.files;

            if (files) {
                for (let file of files) {
                    const fieldname = file.fieldname;
                    file = new FileUpload(file);

                    if (req.body[fieldname]) {
                        if (isArray(req.body[fieldname])) {
                            req.body[fieldname].push(file);
                        } else {
                            req.body[fieldname] = [req.body[fieldname], file];
                        }
                    } else {
                        req.body[fieldname] = file;
                    }
                }

                delete req.files;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
    //any() được sử dụng để xử lý tất cả các loại file được gửi lên server từ client
    //newNext sẽ được gọi khi multer hoàn thành việc xử lý file
    defaultMulter.any()(req, res, newNext);
}
