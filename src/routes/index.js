import categoryRouter from "./category";
import authorRouter from "./author";
import employeeRouter from "./employee";
import postRouter from "./post";


export default function route(app) {
    app.use("/category", categoryRouter);
    app.use("/author", authorRouter);
    app.use("/employee", employeeRouter);
    app.use("/post", postRouter);
}
