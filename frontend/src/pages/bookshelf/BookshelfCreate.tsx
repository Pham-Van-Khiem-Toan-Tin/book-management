import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { createBookshelf } from "../../apis/actions/bookshelf.action";
import { reset, resetError } from "../../apis/slices/bookshelf/bookshelf.slice";
import { allCommonBookcase } from "../../apis/actions/bookcase.action";
import { selectStyleAsync } from "../../configs/select.config";
import { subCategory } from "../../apis/actions/category.action";

interface BookShelf {
    code: string,
    name: string,
    bookcaseId: string,
    description: string,
    categoryId: string
}
const BookshelfCreate = () => {
    const dispatch = useAppDispatch();
    const [disabled, setDisabled] = useState(false);
    const { bookcases, success, error, message, loadingBookcase, loadingCategory, categories } = useAppSelector((state) => state.bookshelf);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(subCategory());
        dispatch(allCommonBookcase());
    }, [dispatch]);
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
    const { handleSubmit, control, formState: { errors } } = useForm<BookShelf>();
    const onSubmit: SubmitHandler<BookShelf> = (data) => {
        setDisabled(true);
        dispatch(createBookshelf(data));
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
            <div className="d-flex flex-column">
                <div className="box-input">
                    <label htmlFor="code">Mã giá sách: <span className="text-danger">*</span></label>
                    <input {...control.register("code", {
                        required: "Vui lòng nhập mã giá sách",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập mã giá sách"
                    })} onKeyDown={handleKeyDown} type="text" placeholder="Nhập mã giá sách" id="code" />
                    {errors.code && <span className="input-error">{errors?.code?.message}</span>}
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
                    <label htmlFor="bookcase-id">Tủ sách: <span className="text-danger">*</span></label>
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
                                    label: `${item.code} - ${item.name} - ${item.library.name}`,
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
                        required: "Vui lòng nhập thông tin chi tiết giá sách",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập thông tin chi tiết giá sách"
                    })}
                        minLength={2} maxLength={500} placeholder="Nhập thông tin chi tiết giá sách" id="description" />
                    {errors.description && <span className="input-error">{errors?.description?.message}</span>}
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <Link to="/categories/all" className="btn-border text-decoration-none py-2 px-3 rounded">Cancel</Link>
                <button disabled={disabled} type="submit" className="btn-fill py-2 px-3 rounded">Save</button>
            </div>
        </form>
    )
}

export default BookshelfCreate