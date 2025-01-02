import moment from "moment"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { editProfile, viewProfile } from "../../apis/actions/profile.action";
import { reset, resetError } from "../../apis/slices/profile.slice";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RiAttachment2 } from "react-icons/ri";
interface ProfileEditProps {
    name: string;
    phone: string;
    avatar: File | { url: string, public_id: string | null };
}
const ProfileEdit = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error, success, message, profile } = useAppSelector((state) => state.profile);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(viewProfile());
        return () => {
            dispatch(reset());
        }
    }, [dispatch])
    const { handleSubmit, control, reset: resetForm, formState: { errors }, getValues } = useForm<ProfileEditProps>();
    useEffect(() => {
        if (profile) {
            resetForm({
                name: profile.name,
                phone: profile.phone ?? "",
                avatar: profile.avatar
            });
            setImagePreview(profile.avatar.url);
        }
    }, [profile, resetForm])

    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setTimeout(() => {
                navigate("/profile");
            },1500);
        }
        if (error) {
            toast.error(message);
            setDisabled(false);
            dispatch(resetError())
        }
    }, [error, message, dispatch, navigate, success]);
    const getImageName = () => {
        const file = getValues("avatar");
        if (file instanceof File) {
            return file.name;
        } else if (file && "url" in file) {
            return profile?.name || "Chọn ảnh"; // Nếu file là object có "url"
        }
        return "Chọn ảnh";
    }
    const onSubmit: SubmitHandler<ProfileEditProps> = (data) => {
        setDisabled(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("phone", data.phone);
        if (data.avatar instanceof File) {
            formData.append("image", data.avatar);
        }
        if (profile) {
            dispatch(editProfile(formData));
        }
    }
    return (
        <>
            {
                loading ? <Loading /> :
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-create d-flex flex-column justify-content-between rounded p-2">
                        <div>
                            <div className="box-input">
                                <label htmlFor="name">Tên người dùng: <span className="text-danger">*</span></label>
                                <input {...control.register("name",
                                    {
                                        required: { value: true, message: "Tên người dùng không được để trống" },
                                        minLength: { value: 6, message: "Tên người dùng phải lớn hơn 6 kí tự" },
                                        maxLength: { value: 30, message: "Tên người dùng phải nhỏ hơn 30 kí tự" }
                                    }
                                )} type="text" placeholder="Nhập email" />
                                {errors.name && <span className="input-error">{errors.name.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="email">Địa chỉ email: <span className="text-danger">*</span></label>
                                <span className="span-input">{profile?.email}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="author">Ảnh đại diện: <span className="text-danger">*</span></label>
                                <label htmlFor="image" className="label-file rounded">
                                    {imagePreview && (
                                        <img src={imagePreview} className="image-preview rounded" alt="image-preview" />
                                    )}

                                    <div className="d-flex align-items-center gap-2 btn-file">
                                        <div className="icon">
                                            <RiAttachment2 />
                                        </div>
                                        <span>{getImageName()}</span>
                                    </div>

                                </label>
                                <Controller
                                    name="avatar"
                                    control={control}
                                    rules={{ required: "Vui lòng chọn ảnh sách" }}
                                    render={({ field }) =>
                                        <input
                                            type="file"
                                            id="image"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const file = e.target.files[0];
                                                    field.onChange(file); // Truyền file cho react-hook-form
                                                    setImagePreview(URL.createObjectURL(file)); // Tạo URL xem trước
                                                } else {
                                                    field.onChange(profile?.avatar);
                                                    setImagePreview(profile?.avatar.url ?? null);
                                                }
                                            }}
                                            className="d-none"
                                        />
                                    }
                                />
                                {errors.avatar && <span className="input-error">{errors?.avatar?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="phone">Số điện thoại: <span className="text-danger">*</span></label>
                                <input {...control.register("phone", {
                                    required: { value: true, message: "Số điện thoại không được để trống" },
                                    pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" }
                                })} placeholder="Nhập số điện thoại" />
                                {errors.phone && <span className="input-error">{errors.phone.message}</span>}
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
                            <div className="btn-group d-flex align-items-center justify-content-end gap-2">
                                <button disabled={disabled} type="submit" className="btn-fill px-3 py-2 rounded">Lưu</button>
                                <Link to="/profile" className="btn-border px-3 py-2 rounded text-decoration-none">Quay lại</Link>
                            </div>
                        </div>
                    </form>

            }
        </>
    )
}

export default ProfileEdit