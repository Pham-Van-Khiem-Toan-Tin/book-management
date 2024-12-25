import { Link, useNavigate, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { reset, resetError } from "../../apis/slices/user/user.slice";
import { editUser, viewUser } from "../../apis/actions/user.action";
import Select, { StylesConfig } from "react-select";
import { authorityCommon } from "../../apis/actions/authorities.action";

interface User {
    _id: string,
    name: string,
    email: string,
    roleId: string
}
interface Option {
    label: string;
    value: string | number | null;
}
const UserEdit = () => {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, loadingAuthorities, error, user, authorities, message, success } = useAppSelector((state) => state.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const selectStyle: StylesConfig<Option, false> = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            border: '1px solid #ececec',
            boxShadow: state.isFocused ? '0 0 0 1px #00b207' : 'none',
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            "&:hover": {
                borderColor: '#ececec'
            }
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            paddingBlock: 0,
            paddingRight: 0

        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: 0
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#a6a6a6',
            fontWeight: 300,
            margin: 0
        }),
        option: (provided, state) => ({
            ...provided,
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            backgroundColor: state.isSelected ? '#00b207' : 'transparent',
            "&:hover": {
                backgroundColor: state.isSelected ? '#00b207' : '#dae5da'
            }
        })
    }
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
        }
    }, [dispatch, success, error, navigate, message]);
    const { handleSubmit, control, formState: { errors }, reset: resetForm } = useForm<User>();
    useEffect(() => {
        if (user) {
            resetForm({
                _id: user._id,
                name: user.name,
                roleId: user?.role._id,
                email: user?.email
            })
        }
    }, [user, resetForm])
    const onSubmit: SubmitHandler<User> = (data) => {
        setDisabled(true);
        dispatch(editUser(data));
    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (<form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <input {...control.register("_id", {
                                    required: "Name is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Name is required"
                                })} hidden minLength={2} disabled maxLength={72} type="text" placeholder="Enter category name" id="_id" />
                            </div>
                            <div className="box-input">
                                <label htmlFor="name">Name: <span className="text-danger">*</span></label>
                                <input {...control.register("name", {
                                    required: "Name is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Name is required"
                                })} minLength={2} maxLength={72} type="text" placeholder="Enter category name" id="name" />
                                {errors.name && <span className="input-error">{errors?.name?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="email">Location:</label>
                                <input {...control.register("email", {
                                    required: "Email is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Email is required"
                                })} type="text" placeholder="Enter email" id="email" />
                            </div>
                            <div className="box-input">
                                <label htmlFor="roleId">Role: <span className="text-danger">*</span></label>
                                <Controller
                                    name="roleId"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            ref={field.ref}
                                            isLoading={loadingAuthorities}
                                            options={authorities.length > 0 ? authorities.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            })) : []}
                                            value={authorities.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                                            onChange={val => {
                                                field.onChange(val?.value);
                                            }}
                                            styles={selectStyle}
                                            isSearchable={false}
                                            inputId="roleId"
                                        />
                                    }
                                />
                                {errors.roleId && <span className="input-error">{errors?.roleId?.message}</span>}
                            </div>
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