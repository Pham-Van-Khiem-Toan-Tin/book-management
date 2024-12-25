import { Link, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { viewUser } from "../../apis/actions/user.action";
import { resetError } from "../../apis/slices/user/user.slice";
const UserView = () => {
    const dispatch = useAppDispatch();
    const { user, loading, error, message } = useAppSelector((state) => state.user);
    const { id } = useParams();
    useEffect(() => {
        if (id)
            dispatch(viewUser(id));
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
                                <span className="span-input">{user?.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="location">Email:</label>
                                <span className="span-input">{user?.email}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Role: <span className="text-danger">*</span></label>
                                <span className="span-input">{user?.role.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Created at: <span className="text-danger">*</span></label>
                                <span className="span-input">{moment(user?.createdAt).format("HH:mm:ss DD-MM-YYYY")}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/users/all" className="btn-border text-decoration-none py-2 px-3 rounded">Return</Link>
                        </div>
                    </div>)

            }
        </>
    )
}

export default UserView