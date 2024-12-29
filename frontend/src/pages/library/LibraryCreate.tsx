import { SubmitHandler, useForm } from "react-hook-form";
import { createLibrary } from "../../apis/actions/library.action";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { reset, resetError } from "../../apis/slices/library/library.slice";

interface Library {
    name: string,
    location: string,
    description: string
}
const LibraryCreate = () => {
    const dispatch = useAppDispatch();
    const [disabled, setDisabled] = useState(false);
    const { success, error, message } = useAppSelector((state) => state.library);
    const navigate = useNavigate();
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/libraries/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            setDisabled(false);
            dispatch(resetError());
        }
    }, [dispatch, success, error, navigate, message])
    const { handleSubmit, control, formState: { errors } } = useForm<Library>();
    const onSubmit: SubmitHandler<Library> = (data) => {
        setDisabled(true);
        dispatch(createLibrary(data));
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
            <div className="d-flex flex-column">
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
                    <label htmlFor="location">Location: <span className="text-danger">*</span></label>
                    <input {...control.register("location", {
                        required: "Location is required",
                        validate: (value) =>
                            value.trim() != "" || "Location is required"
                    })} minLength={2} maxLength={72} type="text" placeholder="Enter location" id="location" />
                    {errors.location && <span className="input-error">{errors?.location?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                    <textarea {...control.register("description", {
                        required: "Description is required",
                        validate: (value) =>
                            value.trim() != "" || "Description is required"
                    })}
                        minLength={2} maxLength={500} placeholder="Enter library description" id="description" />
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

export default LibraryCreate