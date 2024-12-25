import { Link, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { resetError } from "../../apis/slices/bookcase/bookcase.slice";
import { viewBookcase } from "../../apis/actions/bookcase.action";
const BookcaseDetail = () => {
    const dispatch = useAppDispatch();
    const { loading, error, bookcase, message } = useAppSelector((state) => state.bookcase);
    const { id } = useParams();
    useEffect(() => {
        if (id)
            dispatch(viewBookcase(id));
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
                                <label htmlFor="name">Name: <span className="text-danger">*</span></label>
                                <span className="span-input">{bookcase?.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Library: <span className="text-danger">*</span></label>
                                <span className="span-input">{bookcase?.library?.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Created at: <span className="text-danger">*</span></label>
                                <span className="span-input">{moment(bookcase?.createdAt).format("HH:mm:ss DD-MM-YYYY")}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                                <span className="span-area">{bookcase?.description}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/categories/all" className="btn-border text-decoration-none py-2 px-3 rounded">Return</Link>
                        </div>
                    </div>)

            }
        </>
    )
}

export default BookcaseDetail