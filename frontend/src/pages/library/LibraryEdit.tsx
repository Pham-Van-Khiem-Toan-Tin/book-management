import { Link, useNavigate, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { SubmitHandler, useForm } from "react-hook-form";
import { editLibrary, viewLibrary } from "../../apis/actions/library.action";
import { reset, resetError } from "../../apis/slices/library/library.slice";

interface Library {
    _id: string,
    name: string,
    location: string,
    description: string
}
const LibraryEdit = () => {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error, library, message, success } = useAppSelector((state) => state.library);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(viewLibrary(id));
        }
    }, [dispatch, id]);
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
            dispatch(resetError());
            setDisabled(false);
        }
    }, [dispatch, success, error, navigate, message]);
    const { handleSubmit, control, formState: { errors }, reset: resetForm } = useForm<Library>();
    useEffect(() => {
        if (library) {
            resetForm({
                _id: library._id,
                name: library.name,
                location: library.location,
                description: library.description
            })
        }
    }, [library, resetForm])
    const onSubmit: SubmitHandler<Library> = (data) => {
        setDisabled(true);
        dispatch(editLibrary(data));
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
                                <label htmlFor="location">Location:</label>
                                <input {...control.register("location", {
                                    required: "Name is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Name is required"
                                })} type="text" placeholder="Enter location" id="location" />
                            </div>
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

export default LibraryEdit