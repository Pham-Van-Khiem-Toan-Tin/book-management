import { Link, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { resetError } from "../../apis/slices/bookshelf/bookshelf.slice";
import { viewBookshelf } from "../../apis/actions/bookshelf.action";
const BookshelfDetail = () => {
    const dispatch = useAppDispatch();
    const { loading, error, bookshelf, message } = useAppSelector((state) => state.bookshelf);
    const { id } = useParams();
    useEffect(() => {
        if (id)
            dispatch(viewBookshelf(id));
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
                                <label htmlFor="name">Mã giá sách: <span className="text-danger">*</span></label>
                                <span className="span-input">{bookshelf?.code}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="name">Tên giá sách: <span className="text-danger">*</span></label>
                                <span className="span-input">{bookshelf?.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Tủ sách: <span className="text-danger">*</span></label>
                                <span className="span-input">{`${bookshelf?.bookcase.code} - ${bookshelf?.bookcase?.name}`}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Thư viện: <span className="text-danger">*</span></label>
                                <span className="span-input">{bookshelf?.bookcase.library?.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Thời gian tạo: <span className="text-danger">*</span></label>
                                <span className="span-input">{moment(bookshelf?.createdAt).format("HH:mm:ss DD-MM-YYYY")}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Thông tin chi tiết: <span className="text-danger">*</span></label>
                                <span className="span-area">{bookshelf?.description}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/bookshelves/all" className="btn-border text-decoration-none py-2 px-3 rounded">Return</Link>
                        </div>
                    </div>)

            }
        </>
    )
}

export default BookshelfDetail