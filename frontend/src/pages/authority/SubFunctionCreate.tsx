import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { reset } from "../../apis/slices/subfunction.slice";
import { resetError } from "../../apis/slices/function.slice";
import { createSubFunction } from "../../apis/actions/subfunction.action";

interface SubFunction {
    id: string,
    name: string,
    description: string
}
const SubFunctionCreate = () => {
    const dispatch = useAppDispatch();
    const [disabled, setDisabled] = useState(false);
    const { success, error, message } = useAppSelector((state) => state.subFunction);
    const navigate = useNavigate();
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/subfunctions/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            setDisabled(false);
            dispatch(resetError());
        }
    }, [dispatch, success, error, navigate, message])
    const { handleSubmit, control, formState: { errors } } = useForm<SubFunction>();
    const onSubmit: SubmitHandler<SubFunction> = (data) => {
        setDisabled(true);
        dispatch(createSubFunction(data));
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
            <div className="d-flex flex-column">
                <div className="box-input">
                    <label htmlFor="id">Id: <span className="text-danger">*</span></label>
                    <input {...control.register("id", {
                        required: "Vui lòng nhập mã chức năng",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập mã chức năng"
                    })} minLength={2} maxLength={72} type="text" placeholder="Nhập mã chức năng" id="id" />
                    {errors.id && <span className="input-error">{errors?.id?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="name">Name: <span className="text-danger">*</span></label>
                    <input {...control.register("name", {
                        required: "Vui lòng nhập tên chức năng",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập tên chức năng"
                    })} minLength={2} maxLength={72} type="text" placeholder="Nhập tên chức năng" id="name" />
                    {errors.name && <span className="input-error">{errors?.name?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                    <textarea {...control.register("description", {
                        required: "Vui lòng nhập thông tin chức năng",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập thông tin chức năng"
                    })}
                        minLength={2} maxLength={500} placeholder="Nhập thông tin chức năng" id="description" />
                    {errors.description && <span className="input-error">{errors?.description?.message}</span>}
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <Link to="/libraries/all" className="btn-border text-decoration-none py-2 px-3 rounded">Cancel</Link>
                <button disabled={disabled} type="submit" className="btn-fill py-2 px-3 rounded">Save</button>
            </div>
        </form>
    )
}

export default SubFunctionCreate