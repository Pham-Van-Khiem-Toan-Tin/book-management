import { Link, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { viewBook } from "../../apis/actions/book.action";
import { resetError } from "../../apis/slices/book.slice";

const BookDetail = () => {
    const dispatch = useAppDispatch();
    const { loading, error, book, message } = useAppSelector((state) => state.book);
    const { id } = useParams();
    useEffect(() => {
        if (id)
            dispatch(viewBook(id));
    }, [dispatch, id])
    useEffect(() => {
        if (error) {
            toast.error(message);
            dispatch(resetError())
        }
    }, [dispatch, error, message])
    return (
        <>
            {
                loading ? (<Loading />) :
                    (<div className="form-detail d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <label htmlFor="name">Tiêu đề: <span className="text-danger">*</span></label>
                                <span className="span-input">{book?.title}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="author">Tác giả: <span className="text-danger">*</span></label>
                                <span className="span-input">{book?.author}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="author">Tác giả: <span className="text-danger">*</span></label>
                                <div className="img-preview opacity-75">
                                    <img className="image-preview rounded" src={book?.image.url} alt="img-preview" />
                                </div>
                            </div>
                            <div className="box-input">
                                <label htmlFor="publisher">Nhà xuất bản: <span className="text-danger">*</span></label>
                                <span className="span-input">{book?.publisher}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="category-id">Thể loại: <span className="text-danger">*</span></label>
                                <span className="span-input">{book?.categories.map((item) => item.name).join(", ")}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Kiểu sách: <span className="text-danger">*</span></label>
                                <span className="span-input">{book?.type}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Created at: <span className="text-danger">*</span></label>
                                <span className="span-input">{moment(book?.createdAt).format("HH:mm:ss DD-MM-YYYY")}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                                <span className="span-area">{book?.description}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/books/all" className="btn-border text-decoration-none py-2 px-3 rounded">Return</Link>
                        </div>
                    </div>)

            }
        </>
    )
}

export default BookDetail