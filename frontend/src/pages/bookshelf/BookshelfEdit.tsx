import { Link, useNavigate, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { reset, resetError } from "../../apis/slices/bookshelf/bookshelf.slice";
import { allCommonBookcase } from "../../apis/actions/bookcase.action";
import { editBookshelf, viewBookshelf } from "../../apis/actions/bookshelf.action";
import { selectStyleAsync } from "../../configs/select.config";
import { subCategory } from "../../apis/actions/category.action";

interface Bookshelf {
    _id: string,
    code: string,
    name: string,
    bookcaseId: string,
    categoryId: string,
    description: string
}

const BookshelfEdit = () => {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error, bookcases, message, success, bookshelf, loadingBookcase, loadingCategory, categories } = useAppSelector((state) => state.bookshelf);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(subCategory());
            dispatch(allCommonBookcase());
            dispatch(viewBookshelf(id));
        }
    }, [dispatch, id])
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/bookshelves/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            setDisabled(false);
            dispatch(resetError());
        }
    }, [dispatch, success, error, navigate, message])
    const { handleSubmit, control, formState: { errors }, reset: resetForm } = useForm<Bookshelf>();
    useEffect(() => {
        if (bookshelf) {
            resetForm({
                _id: bookshelf._id,
                name: bookshelf.name,
                code: bookshelf.code,
                bookcaseId: bookshelf.bookcase._id,
                categoryId: bookshelf.category._id,
                description: bookshelf.description
            })
        }
    }, [bookshelf, resetForm])

    const onSubmit: SubmitHandler<Bookshelf> = (data) => {
        setDisabled(true);
        dispatch(editBookshelf(data));
    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (<form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <input {...control.register("_id", {
                                    required: "Vui lòng nhập id giá sách",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập id giá sách"
                                })} hidden minLength={2} disabled maxLength={72} type="text" placeholder="Nhập id giá sách" id="_id" />
                            </div>
                            <div className="box-input">
                                <label htmlFor="name">Mã giá sách: <span className="text-danger">*</span></label>
                                <input {...control.register("code", {
                                    required: "Vui lòng nhập mã giá sách",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập mã giá sách"
                                })} minLength={2} maxLength={72} type="text" placeholder="Nhập mã giá sách" id="code" />
                                {errors.name && <span className="input-error">{errors?.name?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="name">Tên giá sách: <span className="text-danger">*</span></label>
                                <input {...control.register("name", {
                                    required: "Vui lòng nhập tên giá sách",
                                    validate: (value) =>
                                        value.trim() != "" || "Vui lòng nhập tên giá sách"
                                })} minLength={2} maxLength={72} type="text" placeholder="Nhập tên giá sách" id="name" />
                                {errors.name && <span className="input-error">{errors?.name?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="bookcase-id">Bookcase: <span className="text-danger">*</span></label>
                                <Controller
                                    name="bookcaseId"
                                    control={control}
                                    rules={{
                                        required: "Vui lòng chọn tủ sách",
                                    }}
                                    render={({ field }) =>
                                        <Select
                                            ref={field.ref}
                                            isLoading={loadingBookcase}
                                            options={bookcases.length > 0 ? bookcases.map((item) => ({
                                                label: `${item.code} - ${item.name}`,
                                                value: item._id
                                            })) : []}
                                            value={bookcases.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                                            onChange={val => {
                                                field.onChange(val?.value);
                                            }}
                                            styles={selectStyleAsync}
                                            isSearchable={false}
                                            inputId="bookcase-id"
                                            placeholder="Chọn tủ sách"
                                        />
                                    }
                                />
                                {errors.bookcaseId && <span className="input-error">{errors?.bookcaseId?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="category-id">Thể loại: <span className="text-danger">*</span></label>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    rules={{
                                        required: "Vui lòng chọn thể loại sách",
                                    }}
                                    render={({ field }) =>
                                        <Select
                                            ref={field.ref}
                                            isLoading={loadingCategory}
                                            options={categories.length > 0 ? categories.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            })) : []}
                                            value={categories.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                                            onChange={val => {
                                                field.onChange(val?.value);
                                            }}
                                            styles={selectStyleAsync}
                                            isSearchable={false}
                                            inputId="category-id"
                                            placeholder="Chọn thể loại sách"
                                        />
                                    }
                                />
                                {errors.categoryId && <span className="input-error">{errors?.categoryId?.message}</span>}
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                                <textarea {...control.register("description", {
                                    required: "Description is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Description is required"
                                })}
                                    minLength={2} maxLength={500} placeholder="Enter bookshelf description" id="description" />
                                {errors.description && <span className="input-error">{errors?.description?.message}</span>}
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/bookshelves/all" className="btn-border text-decoration-none py-2 px-3 rounded">Cancel</Link>
                            <button disabled={disabled} type="submit" className="btn-fill py-2 px-3 rounded">Save</button>
                        </div>
                    </form>)

            }
        </>
    )
}

export default BookshelfEdit