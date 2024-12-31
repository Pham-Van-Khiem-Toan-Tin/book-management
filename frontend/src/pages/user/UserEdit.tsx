import { Link, useNavigate, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { reset, resetError } from "../../apis/slices/user/user.slice";
import { editUser, viewUser } from "../../apis/actions/user.action";
import Select from "react-select";
import { authorityCommon } from "../../apis/actions/authorities.action";
import { createSelectStyles, OptionAsync } from "../../configs/select.config";
import _ from "lodash";
import { resetError as resetErrorLb } from "../../apis/slices/library/library.slice";
import { allCommonLibrary } from "../../apis/actions/library.action";

interface User {
    _id: string,
    name: string,
    email: string,
    roleId: string,
}
interface OptionLb {
    label: string,
    value: string | null | undefined
}
const UserEdit = () => {
    const [showLibrary, setShowLibrary] = useState(false);
    const [messageErrorLb, setMessageErrorLb] = useState<string | null>(null);
    const [library, setLibrary] = useState<OptionLb | null>(null);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, loadingAuthorities, error, user, authorities, message, success } = useAppSelector((state) => state.user);
    const { loading: loadingLibrary, error: errorLibrary, message: messageLibrary, librariesSelect } = useAppSelector((state) => state.library);

    const { id } = useParams();
    const navigate = useNavigate();
    const selectStyle = createSelectStyles<OptionAsync>();
    const selectStyleLibrary = createSelectStyles<OptionLb>();
    useEffect(() => {
        if (id) {
            dispatch(authorityCommon());
            dispatch(viewUser(id));
        }
    }, [dispatch, id]);
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/users/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            dispatch(resetError());
            setDisabled(false);
        } else if (errorLibrary) {
            toast.error(messageLibrary);
            setDisabled(false);
            dispatch(resetErrorLb());
        }
    }, [dispatch, success, error, navigate, message, errorLibrary, messageLibrary]);
    const { handleSubmit, control, formState: { errors }, reset: resetForm } = useForm<User>();
    useEffect(() => {
        if (user) {
            resetForm({
                _id: user._id,
                name: user.name,
                roleId: user.role._id,
                email: user?.email
            })
            if(user.library != null) {
                setLibrary({ label: user.library.name, value: user.library._id });
                setShowLibrary(true);
                console.log("chay vao day");
                
                dispatch(allCommonLibrary());
            }
        }
    }, [user, resetForm, dispatch])
    const onSubmit: SubmitHandler<User> = (data) => {
        if (user) {
            const isChangeData = _.isEqual({
                _id: data._id,
                name: data.name,
                roleId: data.roleId,
                email: data?.email,
                libraryId: library?.value
            }, {
                _id: user._id,
                name: user.name,
                roleId: user.role._id,
                email: user?.email,
                libraryId: user.library?._id
            });
            if (isChangeData) {
                toast.error("Không có dữ liệu thay đổi");
                return;
            }
            if (user.role._id != 'LIBRARIAN' && data.roleId === 'LIBRARIAN' && !library) {
                setMessageErrorLb("Vui lòng chọn thư viện");
                return;
            }
            setDisabled(true);
            const reqData = {
                ...data,
                libraryId: library?.value
            }
            dispatch(editUser(reqData));
        }
    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (<form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input" hidden>
                                <input {...control.register("_id", {
                                    required: "Vui lòng nhập id người dùng",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập id người dùng"
                                })} minLength={2} disabled maxLength={72} type="text" placeholder="Nhập id người dùng" id="_id" />
                            </div>
                            <div className="box-input">
                                <label htmlFor="name">Tên tài khoản: <span className="text-danger">*</span></label>
                                <input {...control.register("name", {
                                    required: "Vui lòng nhập tên",
                                    minLength: { value: 2, message: "Tên phải dài hơn 2 ký tự" },
                                    maxLength: { value: 72, message: "Tên phải ngắn hơn 72 ký tự" },
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập tên"
                                })} maxLength={72} type="text" placeholder="Nhập tên tài khoản" id="name" />
                                {errors.name && <span className="input-error">{errors?.name?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="email">Địa chỉ email: <span className="text-danger">*</span></label>
                                <input {...control.register("email", {
                                    required: "Vui lòng nhập email",
                                    validate: (value) => {
                                        if (value.trim() == "") {
                                            return "Vui lòng nhập email";
                                        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                                            return "Email không hợp lệ";
                                        }
                                    }
                                })} type="text" placeholder="Nhập email" id="email" />
                            </div>
                            <div className="box-input">
                                <label htmlFor="roleId">Role: <span className="text-danger">*</span></label>
                                <Controller
                                    name="roleId"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            loadingMessage={() => "Đang tải dữ liệu"}
                                            ref={field.ref}
                                            isLoading={loadingAuthorities}
                                            options={authorities.length > 0 ? authorities.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            })) : []}
                                            value={authorities.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                                            onChange={val => {
                                                if (val?.value === 'LIBRARIAN') {
                                                    setShowLibrary(true);
                                                    dispatch(allCommonLibrary());
                                                } else setShowLibrary(false);
                                                field.onChange(val?.value);
                                            }
                                            }
                                            noOptionsMessage={() => "Không tìm thấy nhóm quyền"}
                                            placeholder="Chọn nhóm quyền"
                                            styles={selectStyle}
                                            isSearchable={false}
                                            inputId="roleId"
                                        />
                                    }
                                />
                                {errors.roleId && <span className="input-error">{errors?.roleId?.message}</span>}
                            </div>
                            {showLibrary &&
                                <div className="box-input">
                                    <label htmlFor="libraryId">Library: <span className="text-danger">*</span></label>
                                    <Select
                                        loadingMessage={() => "Đang tải dữ liệu"}
                                        isLoading={loadingLibrary}
                                        styles={selectStyleLibrary}
                                        value={library}
                                        noOptionsMessage={() => "Không tìm thấy thư viện"}
                                        isSearchable={false}
                                        onChange={(val) => {
                                            setLibrary(val);
                                            if (val?.value) setMessageErrorLb(null);
                                        }}
                                        placeholder="Chọn thư viện"
                                        options={librariesSelect.map((item) => ({
                                            label: item.name,
                                            value: item._id
                                        }))}
                                    />
                                    {messageErrorLb && <span className="input-error">{messageErrorLb}</span>}
                                </div>}
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/libraries/all" className="btn-border text-decoration-none py-2 px-3 rounded">Cancel</Link>
                            <button disabled={disabled} type="submit" className="btn-fill py-2 px-3 rounded">Save</button>
                        </div>
                    </form>)

            }
        </>
    )
}

export default UserEdit