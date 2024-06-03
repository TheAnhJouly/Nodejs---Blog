import {isEmpty} from "lodash"; //lấy ra các thành phần riêng lẻ từ một module
import {APP_DEBUG, logger} from "@/configs";
import {normalizeError, responseError} from "../helpers";

//middle 
export function errorHandler(err, req, res, next) {
    //instanceof:kiểm trađối tượng lỗi (err) có phải là thể hiện của lớp Error
    if (err instanceof Error) {
        if (err.status || err.statusCode) {
            return responseError(res, err.status || err.statusCode, err.message);
        }

        err = normalizeError(err);
        logger.error({
            req: {
                method: req.method,
                url: req.url,
                headers: {
                    host: req.headers.host,
                    authorization: req.headers.authorization,
                    "content-type": req.headers["content-type"],
                    "content-length": req.headers["content-length"],
                    "user-agent": req.headers["user-agent"],
                },
                ...(!isEmpty(req.params) && {params: req.params}),
                ...(!isEmpty(req.query) && {params: req.query}),
                ...(!isEmpty(req.body) && {params: req.body}),
            },
            ...err,
        });

        let detail;
        if (APP_DEBUG) {
            detail = err;
        }
        return responseError(res, 500, "Có lỗi xảy ra, vui lòng thử lại sau", detail);
    }
    next(err);
}
