import { Link, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxhooks"
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../../common/loading/Loading";
import { viewLibrary } from "../../../apis/actions/library.action";
import "./library-detail.css";
import { resetError } from "../../../apis/slices/library/library.slice";
const LibraryDetail = () => {
    const dispatch = useAppDispatch();
    const { library, loading, error, message } = useAppSelector((state) => state.library);
    const { id } = useParams();
    useEffect(() => {
        if (id)
            dispatch(viewLibrary(id));
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
                    (<div className="library-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <label htmlFor="name">Name: <span className="text-danger">*</span></label>
                                <span className="span-input">{library?.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="location">Location:</label>
                                <span className="span-input">{library?.location}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Description:</label>
                                <span className="span-area">{library?.location}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Created at: <span className="text-danger">*</span></label>
                                <span className="span-input">{moment(library?.createdAt).format("HH:mm:ss DD-MM-YYYY")}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/libraries/all" className="btn-border text-decoration-none py-2 px-3 rounded">Return</Link>
                        </div>
                    </div>)

            }
        </>
    )
}

export default LibraryDetail