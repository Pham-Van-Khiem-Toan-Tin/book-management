import { Link, useNavigate, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { viewFunction } from "../../apis/actions/functions.action";
import { reset, resetError } from "../../apis/slices/function.slice";


interface FunctionForm {
    name: string;
    description: string;
    subfunctions: Array<string>;
}
const FunctionEdit = () => {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error, functionDetail, message, success } = useAppSelector((state) => state.functions);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(viewFunction(id));
        }
    }, [dispatch, id]);
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/functions/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            dispatch(resetError());
            setDisabled(false);
        }
    }, [dispatch, success, error, navigate, message]);
    const { handleSubmit, control, formState: { errors }, reset: resetForm } = useForm<Library>();
    useEffect(() => {
        if (functionDetail) {
            resetForm({
                _id: functionDetail._id,
                name: functionDetail.name,
                description: functionDetail.description
            })
        }
    }, [functionDetail, resetForm])
    const onSubmit: SubmitHandler<FunctionForm> = (data) => {
        setDisabled(true);
        // dispatch(editLibrary(data));
    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (<form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <input {...control.register("_id", {
                                    required: "Vui lòng nhập mã chức năng",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập mã chức năng"
                                })} hidden minLength={2} disabled maxLength={72} type="text" placeholder="Nhập mã chức năng" id="_id" />
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
                            <Controller
                                name="subfunctions"
                                control={control}
                                render={({ field }) => (
                                    <div className="box-input">
                                        <label htmlFor="subfunctions">Subfunctions:</label>
                                        <select {...field} multiple id="subfunctions">
                                            <option value="1">Subfunction 1</option>
                                            <option value="2">Subfunction 2</option>
                                            <option value="3">Subfunction 3</option>
                                        </select>
                                    </div>
                                )}
                            />
                            <div className="box-input">
                                <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                                <textarea {...control.register("description", {
                                    required: "Description is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Description is required"
                                })}
                                    minLength={2} maxLength={500} placeholder="Enter category description" id="description" />
                                {errors.description && <span className="input-error">{errors?.description?.message}</span>}
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

export default FunctionEdit