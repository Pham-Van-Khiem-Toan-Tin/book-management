import { Link, useNavigate, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { editBookcase, viewBookcase } from "../../apis/actions/bookcase.action";
import { reset, resetError } from "../../apis/slices/bookcase.slice";
import { allCommonLibrary } from "../../apis/actions/library.action";
import { selectStyleAsync } from "../../configs/select.config";
import { subCategory } from "../../apis/actions/category.action";
import { resetError as resetErrorLb } from "../../apis/slices/library.slice";

interface Bookcase {
    _id: string,
    id: string,
    name: string,
    libraryId: string,
    description: string,
}


const BookcaseEdit = () => {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error, bookcase, message, success } = useAppSelector((state) => state.bookcase);
    const { loading: loadingLibrary, error: errorLibrary, message: messageLibrary, librariesSelect } = useAppSelector((state) => state.library);

    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(subCategory());
            dispatch(allCommonLibrary());
            dispatch(viewBookcase(id));
        }
    }, [dispatch, id])
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/bookcases/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            setDisabled(false);
            dispatch(resetError());
        } else if (errorLibrary) {
            toast.error(messageLibrary);
            setDisabled(false);
            dispatch(resetErrorLb());
        }
    }, [dispatch, success, error, navigate, message, errorLibrary, messageLibrary])

    const { handleSubmit, control, formState: { errors }, reset: resetForm } = useForm<Bookcase>();
    useEffect(() => {
        if (bookcase) {
            resetForm({
                _id: bookcase._id,
                id: bookcase.code,
                name: bookcase.name,
                libraryId: bookcase.library?._id,
                description: bookcase.description
            })
        }
    }, [bookcase, resetForm])

    const onSubmit: SubmitHandler<Bookcase> = (data) => {
        setDisabled(true);
        dispatch(editBookcase(data));
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (<form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <input {...control.register("_id", {
                                    required: "Vui lòng nhập id tủ sách",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập id tủ sách"
                                })} hidden minLength={2} disabled maxLength={72} type="text" placeholder="Nhập id tủ sách" id="_id" />
                            </div>
                            <div className="box-input">
                                <label htmlFor="id">Mã tủ sách: <span className="text-danger">*</span></label>
                                <input {...control.register("id", {
                                    required: "Vui lòng nhập mã tủ sách",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập mã tủ sách"
                                })} onKeyDown={handleKeyDown} type="text" placeholder="Nhập mã tủ sách" id="id" />
                                {errors.name && <span className="input-error">{errors?.name?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="name">Tên tử sách: <span className="text-danger">*</span></label>
                                <input {...control.register("name", {
                                    required: "Vui lòng nhập tên tủ sách",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập tên tủ sách"
                                })} minLength={2} maxLength={72} type="text" placeholder="Nhập tên tủ sách" id="name" />
                                {errors.name && <span className="input-error">{errors?.name?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="library-id">Thư viện: <span className="text-danger">*</span></label>
                                <Controller
                                    name="libraryId"
                                    control={control}
                                    rules={{
                                        required: "Vui lòng chọn thư viện",
                                    }}
                                    render={({ field }) =>
                                        <Select
                                            ref={field.ref}
                                            isLoading={loadingLibrary}
                                            options={librariesSelect.length > 0 ? librariesSelect.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            })) : []}
                                            value={librariesSelect.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                                            onChange={val => {
                                                field.onChange(val?.value);
                                            }}
                                            styles={selectStyleAsync}
                                            isSearchable={false}
                                            inputId="parent-id"
                                            placeholder="Enter parent id"
                                        />
                                    }
                                />
                                {errors.libraryId && <span className="input-error">{errors?.libraryId?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                                <textarea {...control.register("description", {
                                    required: "Description is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Description is required"
                                })}
                                    minLength={2} maxLength={500} placeholder="Enter bookcase description" id="description" />
                                {errors.description && <span className="input-error">{errors?.description?.message}</span>}
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/bookcases/all" className="btn-border text-decoration-none py-2 px-3 rounded">Cancel</Link>
                            <button disabled={disabled} type="submit" className="btn-fill py-2 px-3 rounded">Save</button>
                        </div>
                    </form>)

            }
        </>
    )
}

export default BookcaseEdit