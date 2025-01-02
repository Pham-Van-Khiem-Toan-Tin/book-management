import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { viewProfile } from "../../apis/actions/profile.action";
import { reset, resetError } from "../../apis/slices/profile.slice";
import Loading from "../../common/loading/Loading";
import moment from "moment";
import { Link } from "react-router";
import { toast } from "react-toastify";


const ProfileDetail = () => {
    const dispatch = useAppDispatch();
    const { loading, error, message, profile } = useAppSelector((state) => state.profile);
    useEffect(() => {
        dispatch(viewProfile());
        return () => {
            dispatch(reset());
        }
    }, [dispatch])
    useEffect(() => {
        if (error) {
            toast.error(message);
            dispatch(resetError())
        }
    }, [error, message, dispatch])
    return (
        <>
            {loading ? <Loading /> :
                <div className="form-detail rounded p-2">
                    <div className="box-input">
                        <label htmlFor="name">Tên người dùng: <span className="text-danger">*</span></label>
                        <span className="span-input">{profile?.name}</span>
                    </div>
                    <div className="box-input">
                        <label htmlFor="email">Địa chỉ email: <span className="text-danger">*</span></label>
                        <span className="span-input">{profile?.email ?? "Không có dữ liệu"}</span>
                    </div>
                    <div className="box-input">
                                <label htmlFor="author">Ảnh đại diện: <span className="text-danger">*</span></label>
                                <div className="img-preview opacity-75">
                                    <img className="image-preview rounded" src={profile?.avatar.url} alt="img-preview" />
                                </div>
                            </div>
                    <div className="box-input">
                        <label htmlFor="phone">Số điện thoại: <span className="text-danger">*</span></label>
                        <span className="span-input">{profile?.phone ?? "Không có dữ liệu"}</span>
                    </div>
                    <div className="box-input">
                        <label htmlFor="role">Quyền hạn: <span className="text-danger">*</span></label>
                        <span className="span-input">{profile?.role.name}</span>
                    </div>
                    {
                        profile?.library && (
                            <div className="box-input">
                                <label htmlFor="library">Thư viện làm việc: <span className="text-danger">*</span></label>
                                <span className="span-input">{profile?.library?.name}</span>
                            </div>
                        )
                    }
                    <div className="box-input">
                        <label htmlFor="phone">Ngày tham gia: <span className="text-danger">*</span></label>
                        <span className="span-input">{moment(profile?.createdAt).format("DD-MM-yyyy")}</span>
                    </div>
                    <div className="btn-group d-flex mb-3">
                        <Link to="/profile/edit" className="btn-fill px-3 py-2 rounded text-decoration-none">Chỉnh sửa</Link>
                    </div>

                </div>
            }
        </>
    )
}

export default ProfileDetail